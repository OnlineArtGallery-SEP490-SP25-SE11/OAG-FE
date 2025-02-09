import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArtModal } from '@/hooks/useArtModal';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSignIcon, Info, RulerIcon, UserIcon, X } from 'lucide-react';
import Image from 'next/image';
import { Fragment, memo, useCallback, useEffect } from 'react';
import { BiComment } from 'react-icons/bi';

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

// const detailsVariants = {
// 	initial: {
// 		opacity: 0,
// 		x: 20
// 	},
// 	animate: (index: number) => ({
// 		opacity: 1,
// 		x: 0,
// 		transition: {
// 			duration: 0.3,
// 			delay: index * 0.1,
// 			ease: 'easeOut'
// 		}
// 	}),
// 	exit: {
// 		opacity: 0,
// 		x: 20,
// 		transition: {
// 			duration: 0.2,
// 			ease: 'easeIn'
// 		}
// 	}
// };

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
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent'
				>
					<motion.div
						key='modal'
						layoutId={`card-${selected.id}`}
						onClick={(e) => e.stopPropagation()}
						// className='w-full max-w-[1500px] relative rounded-lg overflow-hidden flex acrylic'
						// style={
						// 	{
						// 		'--gradient-angle': '120deg',
						// 		'--gradient-end': 'rgba(0, 0, 255, 0.2)'
						// 	} as React.CSSProperties
						// }
						className='w-full max-w-[1500px] relative rounded-lg overflow-hidden flex flex-col lg:flex-row backdrop-blur-2xl border-2 bg-black/50'
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
							// className='flex-1 p-4 h-[70vh] flex items-center justify-center relative lg:w-[70%]'
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
						<motion.div
							className='flex-1 p-6 max-h-[70vh] lg:w-[30%] border-l border-white/10 pt-16'
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Tabs defaultValue='details' className='h-full'>
								<TabsList className='grid grid-cols-2 w-full mb-4'>
									<TabsTrigger
										value='details'
										className='flex flex-row space-x-2.5'
									>
										<Info className='w-5 h-5' />
										Info
									</TabsTrigger>
									<TabsTrigger
										value='comments'
										className='flex flex-row space-x-2.5'
									>
										<BiComment className='w-5 h-5' />
										Comments (
										{(selected as any).commentsCount || 0}
										)
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value='details'
									className='h-[calc(70vh-100px)]'
								>
									<ScrollArea className='h-full pr-4'>
										<div className='space-y-4'>
											<h2 className='text-2xl font-bold text-white'>
												{selected.title}
											</h2>
											<div className='space-y-2 text-sm text-white'>
												<div className='flex items-center gap-2'>
													<UserIcon className='w-4 h-4' />
													<span>
														{selected.artist}
													</span>
												</div>
												<div className='flex items-center gap-2'>
													<DollarSignIcon className='w-4 h-4' />
													<span>
														$
														{selected.price.toLocaleString()}
													</span>
												</div>
												<div className='flex items-center gap-2'>
													<RulerIcon className='w-4 h-4' />
													<span>
														{selected.width}x
														{selected.height}px
													</span>
												</div>
											</div>

											<Separator className='my-4 bg-white/20' />

											<p className='text-sm text-white/80 leading-relaxed'>
												{selected.description}
											</p>
										</div>
									</ScrollArea>
								</TabsContent>

								<TabsContent
									value='comments'
									className='h-[calc(70vh-100px)]'
								>
									<div className='flex flex-col h-full'>
										<ScrollArea className='flex-1 pr-4 mb-4'>
											{/* Component bình luận */}
											{/*<CommentSection comments={selected.comments} />*/}
										</ScrollArea>
										{/*<CommentInput />*/}
									</div>
								</TabsContent>
							</Tabs>
						</motion.div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</Fragment>
	);
}

export default memo(Modal);
