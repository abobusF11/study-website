export const authConfig = {
    publicRoutes: ['/', '/about'],
    protectedRoutes: ['/template', '/dashboard', '/profile'],
    authRoutes: ['/auth/login', '/auth/register'],
    defaultRedirect: '/dashboard'
} as const