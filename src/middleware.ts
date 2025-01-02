import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
	matcher: [
		'/',
		'/(vi|en)/:path*',
		'/((?!admin|api|_next|test|.*\\..*).*)'
		// '/test/:path*',
	]
};

/*
❌
/admin/
/api/
/_next/
/images/logo.png
/styles.css

✅
/about
/en/about
/vi/about
*/
