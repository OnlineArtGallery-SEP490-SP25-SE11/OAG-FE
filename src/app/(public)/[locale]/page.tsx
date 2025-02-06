'use client';

import View3d from './components/3dView';
import Docs from './components/Docs';
import Footer from './components/footer';
import Interview from './components/interview';
import TrendingArt from './components/trendingArt';
import ViewPaintings from './components/viewPaintings';

export default async function Home() {
	return (
		<>
			<Interview />
			<Docs />
			<ViewPaintings />
			<TrendingArt />
			<View3d />
			<Footer />
		</>
	);
}
