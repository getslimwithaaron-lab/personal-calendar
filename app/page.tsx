import { redirect } from 'next/navigation'

// Root always redirects to week view
export default function Home() {
  redirect('/week')
}
