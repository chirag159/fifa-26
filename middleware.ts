import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const authHeader = req.headers.get('authorization')

        if (authHeader) {
            const authValue = authHeader.split(' ')[1]
            const [user, pwd] = atob(authValue).split(':')

            if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
                return NextResponse.next()
            }
        }

        return new NextResponse('Auth Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
