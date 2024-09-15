import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const isCookiesExist = !!request.cookies.get("user_token");
    
    // Periksa apakah user berada di halaman login atau register
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    // jika cookies ada dan user sedang berada di halaman login atau register => redirect ke halaman "/"
    if (isCookiesExist && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    
    // jika cookies tidak ada dan user tidak berada di halaman login atau register => redirect ke halaman "/login"
    if (!isCookiesExist && !isAuthPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        // Eclude static assets
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|japan-gapura.png).*)',
        // You can also exclude other static asset extensions by adding them explicitly, like '/.*\.(png|jpg|jpeg|svg|gif)$'
    ],
};
