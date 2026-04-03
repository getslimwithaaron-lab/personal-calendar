import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

export const credentialsProvider = CredentialsProvider({
  name: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, password_hash')
      .eq('email', (credentials.email as string).toLowerCase())
      .single()

    if (!user?.password_hash) return null

    const valid = await bcrypt.compare(
      credentials.password as string,
      user.password_hash
    )
    if (!valid) return null

    return { id: user.id, email: user.email, name: user.name }
  },
})
