// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
    console.log('Middleware triggered:', {
        pathname: request.nextUrl.pathname,
        method: request.method,
        headers: Object.fromEntries(request.headers)
    });

    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}
