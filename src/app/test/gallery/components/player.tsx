"use client";
import { useEffect, useRef } from "react";
import { useSphere } from "@react-three/cannon";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Mesh } from "three";
import { keyMap } from "./keyMap";

// Movement controls
export const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

export function Player() {
  const { camera } = useThree();

  // đối tượng vật lý dạng cầu
  const [ref, api] = useSphere<Mesh>(() => ({
    //ref: tham chiếu đối tượng, api: tương tác vật lý
    mass: 1, // khối lượng
    type: "Dynamic", // đối tượng động, có thể di chuyển và bị tác động bởi lực.
    position: [0, 2, 5], // vị trí ban đầu
    // Add these physics properties
    fixedRotation: true, // không bị xoay khi va chạm
    linearDamping: 0.95, // giảm tốc độ tuyến tính
    material: {
      friction: 0.1, // ma sát
    },
  }));

  //theo dõi vận tốc và vị trí của đối tượng
  const velocity = useRef([0, 0, 0]); // Lưu vận tốc hiện tại của cầu (để xử lý lực hấp dẫn và chuyển động ngang).
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v)); //theo dõi vận tốc
  }, [api.velocity]);

  const pos = useRef([0, 0, 0]); //Lưu vị trí hiện tại của cầu.
  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p)); //theo dõi vị trí
  }, [api.position]);

  useFrame(() => {
    camera.position.set(pos.current[0], pos.current[1], pos.current[2]); //cam luôn theo sát vị trí vật thể

    const frontVector = new Vector3(0, 0, 0); // tiến lùi
    const sideVector = new Vector3(0, 0, 0); // trái phải
    const direction = new Vector3(); // hướng di chuyển tổng hợp 2 vector trên

    const speed = 5; // tốc độ di chuyển
    const look = camera.getWorldDirection(direction);

    if (keys.forward) frontVector.add(look);
    if (keys.backward) frontVector.sub(look);
    if (keys.left)
      sideVector.sub(camera.getWorldDirection(direction).cross(camera.up));
    if (keys.right)
      sideVector.add(camera.getWorldDirection(direction).cross(camera.up));

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed);

    // Keep vertical velocity (gravity) but update horizontal movement
    api.velocity.set(direction.x, velocity.current[1], direction.z);
  });

  return <mesh ref={ref} />;
}

document.addEventListener("keydown", (e) => {
  if (keyMap[e.code]) keys[keyMap[e.code]] = true;
});

document.addEventListener("keyup", (e) => {
  if (keyMap[e.code]) keys[keyMap[e.code]] = false;
});
