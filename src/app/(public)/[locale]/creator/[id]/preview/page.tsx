'use client';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

export default function PreviewPage() {
	return (
		<div className='flex h-full'>
			{/* 3D Preview Section */}
			<div className='w-2/3 h-[calc(90vh-4rem)] relative'>
				<Canvas>
					<Suspense fallback={null}>
						<Environment preset='sunset' background />

						<OrbitControls />
						{/* 3D Gallery Preview Here */}
					</Suspense>
				</Canvas>
			</div>

			{/* Control Panel */}
			<div className='w-1/3 h-[calc(90vh-4rem)] bg-white p-6 overflow-y-auto border-l'>
				<div className='space-y-6'>
					<div>
						<h2 className='text-2xl font-bold mb-4'>
							Gallery Preview
						</h2>
						<p className='text-gray-600'>
							Use your mouse to navigate around the gallery space:
						</p>
						<ul className='mt-2 text-sm text-gray-600 space-y-1'>
							<li>• Left click + drag to rotate</li>
							<li>• Right click + drag to pan</li>
							<li>• Scroll to zoom in/out</li>
						</ul>
					</div>

					{/* Settings Section */}
					<div className='border-t pt-6'>
						<h3 className='text-lg font-semibold mb-3'>
							Display Settings
						</h3>
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Environment
								</label>
								<select className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'>
									<option>Sunset</option>
									<option>Studio</option>
									<option>Night</option>
									<option>Dawn</option>
								</select>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Quality
								</label>
								<select className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'>
									<option>High</option>
									<option>Medium</option>
									<option>Low</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
