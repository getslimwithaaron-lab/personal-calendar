import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

// ── Dashboard layout — server component ───────────────────────────────────────
// Validates session on every dashboard page render.
// Middleware handles the redirect too, but this is a belt-and-suspenders check.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {children}
    </div>
  )
}
