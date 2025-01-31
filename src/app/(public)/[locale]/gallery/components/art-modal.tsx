import { ScrollArea } from '@/components/ui/scroll-area';
import { useArtModal } from '@/hooks/useArtModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import Image from 'next/image';
import { Fragment, memo, useCallback, useEffect } from 'react';

const overlayVariants = {
	initial: {
		opacity: 0
	},
	animate: {
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: 'easeOut'
		}
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 0.2,
			ease: 'easeIn'
		}
	}
};

const contentVariants = {
	initial: {
		opacity: 0,
		scale: 0.95,
		y: 20
	},
	animate: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: 'easeOut'
		}
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		y: 20,
		transition: {
			duration: 0.2,
			ease: 'easeIn'
		}
	}
};

const detailsVariants = {
	initial: {
		opacity: 0,
		x: 20
	},
	animate: (index: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.3,
			delay: index * 0.1,
			ease: 'easeOut'
		}
	}),
	exit: {
		opacity: 0,
		x: 20,
		transition: {
			duration: 0.2,
			ease: 'easeIn'
		}
	}
};

function Modal() {
	const { selected, setSelected } = useArtModal();

	const handleClose = useCallback(() => {
		setSelected(null);
	}, [setSelected]);

	useEffect(() => {
		if (!selected) return;

		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth;
		document.body.style.paddingRight = `${scrollbarWidth}px`;
		document.body.classList.add('overflow-hidden');

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') handleClose();
		};
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.body.style.paddingRight = '0px';
			document.body.classList.remove('overflow-hidden');
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [selected, handleClose]);

	if (!selected) return null;

	return (
		<Fragment>
			<AnimatePresence mode='wait'>
				<motion.div
					key='overlay'
					variants={overlayVariants}
					initial='initial'
					animate='animate'
					exit='exit'
					onClick={handleClose}
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'
				>
					<motion.div
						key='modal'
						layoutId={`card-${selected.id}`}
						onClick={(e) => e.stopPropagation()}
						className='w-full max-w-[1500px] relative rounded-lg overflow-hidden flex acrylic'
						style={
							{
								'--gradient-angle': '120deg',
								'--gradient-end': 'rgba(0, 0, 255, 0.2)'
							} as React.CSSProperties
						}
					>
						<motion.button
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className='absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-100'
							onClick={handleClose}
						>
							<X className='w-6 h-6 text-white dark:text-gray-100' />
						</motion.button>

						<motion.div
							variants={contentVariants}
							initial='initial'
							animate='animate'
							exit='exit'
							className='flex-1 p-4 h-[80vh] flex items-center justify-center w-full relative'
						>
							<Image
								width={selected.width}
								height={selected.height}
								alt={selected.title}
								src={selected.imageUrl}
								className='max-w-full max-h-full object-contain rounded-md'
								priority
							/>
						</motion.div>

						<motion.div className='flex-1 p-8 space-y-4 max-h-[80vh]'>
							<ScrollArea className='prose dark:prose-invert max-w-none h-[80vh]'>
								<motion.h3
									variants={detailsVariants}
									custom={0}
									initial='initial'
									animate='animate'
									exit='exit'
									className='text-3xl font-extrabold text-white dark:text-gray-100 mb-4'
								>
									{selected.title}
								</motion.h3>

								<ScrollArea className='h-64'>
									<motion.p
										variants={detailsVariants}
										custom={1}
										initial='initial'
										animate='animate'
										exit='exit'
										className='text-lg leading-relaxed text-white/80 dark:text-gray-300 mb-4'
									>
										{selected.description}
									</motion.p>
								</ScrollArea>

								<motion.div
									variants={detailsVariants}
									custom={2}
									initial='initial'
									animate='animate'
									exit='exit'
									className='flex items-center gap-2 text-white/70 dark:text-gray-400 mb-2'
								>
									<span className='font-medium'>Artist:</span>
									<span className='text-white dark:text-gray-200'>
										{selected.artist}
									</span>
								</motion.div>

								<motion.div
									variants={detailsVariants}
									custom={3}
									initial='initial'
									animate='animate'
									exit='exit'
									className='flex items-center gap-2 text-white/70 dark:text-gray-400 mb-2'
								>
									<span className='font-medium'>Price:</span>
									<span className='text-white dark:text-gray-200'>
										${selected.price.toLocaleString()}
									</span>
								</motion.div>

								<motion.div
									variants={detailsVariants}
									custom={4}
									initial='initial'
									animate='animate'
									exit='exit'
									className='flex items-center gap-2 text-white/70 dark:text-gray-400 mb-6'
								>
									<span className='font-medium'>
										Dimensions:
									</span>
									<span className='text-white dark:text-gray-200'>
										{selected.width} x {selected.height} px
									</span>
								</motion.div>

								<motion.a
									variants={detailsVariants}
									custom={5}
									initial='initial'
									animate='animate'
									exit='exit'
									href={selected.imageUrl}
									download
									className='inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors'
								>
									Download
									<Download className='w-5 h-5' />
								</motion.a>
							</ScrollArea>
						</motion.div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</Fragment>
	);
}

export default memo(Modal);
