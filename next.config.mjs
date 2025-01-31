import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['picsum.photos']
	},
	experimental: {},
	eslint: {
		ignoreDuringBuilds: true
	},
	webpack: (config) => {
		config.cache = false;
		return config;
	} // tắt caching
};

export default withNextIntl(nextConfig);
