import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authConfig } from '@/config/auth'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // Редирект если нет токена
    if (!token && authConfig.protectedRoutes.some(route => pathname.startsWith(route))) {
        console.log(pathname)
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Для публичных маршрутов ничего не делаем
    if (authConfig.publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next()
    }

    // Если авторизован, но на странице входа
    if (token && authConfig.authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL(authConfig.defaultRedirect, request.url))
    }

    return NextResponse.next()
}