'use client'
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Mesh, Vector3, BoxGeometry, PlaneGeometry, MeshStandardMaterial, MeshBasicMaterial } from "three";
import { Vec3 } from "@/types/gallery";
import { useRaycaster } from "@/hooks/useRaycaster";
import { ArtworkPortal } from "./artwork-portal";

import { ArtworkInfoOverlay } from './artwork-info-overlay';

import { useCameraTransition } from '@/hooks/useCameraTransition';
import { useCameraStore } from '@/store/cameraStore';
import { TEXTURE_URL } from '@/utils/constants';
import { useCloudinaryAsset } from '@/hooks/useCloudinaryAsset';

// Định nghĩa các hằng số
const FRAME_THICKNESS = 0.1; // Độ dày của khung tranh
const BASE_HEIGHT = 2; // Chiều cao cơ bản của tranh
const METALNESS = 0.1;
const ROUGHNESS = 0.8;
const ENV_MAP_INTENSITY = 0.5;

// Định nghĩa interface cho dữ liệu tranh
interface Artwork {
	id: number; // ID duy nhất của tranh
	url: string; // Đường dẫn đến hình ảnh tranh
	position: Vec3; // Vị trí trong không gian 3D (x, y, z)
	rotation?: Vec3; // Góc quay của tranh (tùy chọn)
	title?: string; // Tiêu đề tranh (tùy chọn)
	description?: string; // Mô tả tranh (tùy chọn),
}

// Props cho component khung tranh
interface FrameMeshProps {
	width: number; // Chiều rộng khung
	height: number; // Chiều cao khung
}

// Định nghĩa hàm tạo geometry cho khung tranh
const FRAME_GEOMETRY = {
	// Tạo thanh ngang của khung
	createHorizontal: (width: number) =>
		new BoxGeometry(width + FRAME_THICKNESS * 2, FRAME_THICKNESS, 0.1),
	// Tạo thanh dọc của khung
	createVertical: (height: number) =>
		new BoxGeometry(FRAME_THICKNESS, height, 0.1)
};

// Component khung tranh
const FrameMesh: React.FC<FrameMeshProps> = React.memo(({ width, height}) => {
	// Load texture cho khung tranh
	const frameTexture = useCloudinaryAsset(TEXTURE_URL.FLOOR);

	// Điều chỉnh material để giảm ảnh hưởng của ánh sáng
	const frameMaterial = useMemo(
		() =>
			new MeshStandardMaterial({
				map: frameTexture,
				metalness: METALNESS, // Giảm độ phản chiếu kim loại
				roughness: ROUGHNESS, // Tăng độ nhám để giảm độ bóng
				envMapIntensity: ENV_MAP_INTENSITY // Giảm cường độ phản chiếu môi trường
			}),
		[frameTexture]
	);

	// Tạo và tái sử dụng các geometry cho khung
	const geometries = useMemo(
		() => ({
			horizontal: FRAME_GEOMETRY.createHorizontal(width),
			vertical: FRAME_GEOMETRY.createVertical(height)
		}),
		[width, height]
	);

	return (
		<group>
			{/* Thanh ngang phía trên */}
			<mesh
				position={[0, height / 2 + FRAME_THICKNESS / 2, 0]}
				geometry={geometries.horizontal}
				material={frameMaterial}
			/>
			{/* Thanh ngang phía dưới */}
			<mesh
				position={[0, -height / 2 - FRAME_THICKNESS / 2, 0]}
				geometry={geometries.horizontal}
				material={frameMaterial}
			/>
			{/* Thanh dọc bên trái */}
			<mesh
				position={[-width / 2 - FRAME_THICKNESS / 2, 0, 0]}
				geometry={geometries.vertical}
				material={frameMaterial}
			/>
			{/* Thanh dọc bên phải */}
			<mesh
				position={[width / 2 + FRAME_THICKNESS / 2, 0, 0]}
				geometry={geometries.vertical}
				material={frameMaterial}
			/>
		</group>
	);
});

// Component chính hiển thị tranh
export const ArtworkMesh: React.FC<{ artwork: Artwork }> = React.memo(
	({ artwork }) => {
		// State quản lý hiển thị chi tiết và modal
		const [showDetails, setShowDetails] = useState(false);
		const [shouldShowModal, setShouldShowModal] = useState(false);

		// Ref cho mesh chính
		const meshRef = useRef<Mesh>(null);

		// Hook để điều khiển camera
		const { setTargetPosition } = useCameraStore();
		useCameraTransition();

		// Xử lý khi người dùng click vào tranh
		const handleIntersect = useCallback(() => {
			if (!meshRef.current) return;

			// Lấy vị trí trong không gian thế giới
			const worldPosition = new Vector3();
			meshRef.current.getWorldPosition(worldPosition);

			// Cập nhật vị trí camera và hiển thị chi tiết
			setTargetPosition(worldPosition);
			setShowDetails(true);

			// Hiển thị modal sau 1 giây
			setTimeout(() => {
				setShouldShowModal(true);
			}, 1000);
		}, [meshRef, setTargetPosition]);

		// Xử lý đóng modal
		const handleClose = useCallback(() => {
			setShouldShowModal(false);
			setShowDetails(false);
			setTargetPosition(null);
		}, [setTargetPosition]);

		// Xử lý khi click ra ngoài tranh
		const handleMiss = useCallback(() => {
			if (showDetails) {
				handleClose();
			}
		}, [showDetails, handleClose]);

		// Hook xử lý raycasting
		useRaycaster({
			meshRef,
			onIntersect: handleIntersect,
			onMiss: handleMiss
		});

		// Load texture cho tranh
		const texture = useCloudinaryAsset(artwork.url);

		// Tạo material cho tranh
		const artworkMaterial = useMemo(
			() =>
				new MeshBasicMaterial({
					map: texture
				}),
			[texture]
		);

		// Tính toán kích thước và tạo geometry cho tranh
		const { geometry, dimensions } = useMemo(() => {
			const { width, height } = texture.image;
			const aspectRatio = width / height;
			const dims = {
				width: BASE_HEIGHT * aspectRatio,
				height: BASE_HEIGHT
			};

			return {
				geometry: new PlaneGeometry(dims.width, dims.height),
				dimensions: dims
			};
		}, [texture]);

		return (
			<group 
			position={artwork.position} 
			rotation={artwork.rotation || [0, 0, 0]}>
				{/* Mesh chính hiển thị tranh */}
				<mesh
					ref={meshRef}
					geometry={geometry}
					material={artworkMaterial}
				/>

				{/* Khung tranh */}
				<FrameMesh
					width={dimensions.width}
					height={dimensions.height}
				/>

				{/* Modal hiển thị thông tin chi tiết */}
				{shouldShowModal && (
					<ArtworkPortal isOpen={true} onClose={handleClose}>
						<ArtworkInfoOverlay
							title={artwork.title}
							description={artwork.description}
							onClose={() => {
								setShouldShowModal(false);
								setTargetPosition(null);
								setShowDetails(false);
							}}
						/>
					</ArtworkPortal>
				)}
			</group>
		);
	}
);

// Đặt tên hiển thị cho các component
FrameMesh.displayName = 'FrameMesh';
ArtworkMesh.displayName = 'ArtworkMesh';
