// next-auth type augmentation — extends Session and JWT with app-specific fields
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    provider?: string
    supabaseUserId?: string
    expiresAt?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    provider?: string
    supabaseUserId?: string
    expiresAt?: number
  }
}
