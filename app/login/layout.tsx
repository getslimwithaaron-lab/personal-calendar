// Login layout — no auth gate. The login page is always accessible.
// After sign-in, NextAuth redirects to /week via callbackUrl.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
