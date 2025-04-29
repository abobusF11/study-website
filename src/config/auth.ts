export const authConfig = {
    publicRoutes: ['/', '/about', "/api/clients/group/create"],
    protectedRoutes: ['/template', '/dashboard', '/archive', '/orders'],
    authRoutes: ['/auth/login'],
    defaultRedirect: '/template'
} as const