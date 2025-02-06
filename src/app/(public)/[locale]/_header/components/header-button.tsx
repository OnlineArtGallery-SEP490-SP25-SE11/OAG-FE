import React, { forwardRef } from 'react';

const HeaderButton = forwardRef<
	HTMLButtonElement,
	{
		children: React.ReactNode;
		className?: string;
		isGradient?: boolean;
	} & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className = '', isGradient = false, ...props }, ref) => {
	return (
		<button
			ref={ref} // Gán ref cho button
			className={`relative flex items-center justify-center w-10 h-10 rounded-full ${
				isGradient
					? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400'
					: 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
			} p-1 ${className}`}
			{...props} // Truyền tất cả props vào button, bao gồm onClick
		>
			<div className='flex items-center justify-center w-full h-full rounded-full'>
				{children}
			</div>
		</button>
	);
});

HeaderButton.displayName = 'HeaderButton';
export default HeaderButton;
