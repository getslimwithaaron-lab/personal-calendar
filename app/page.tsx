'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') router.replace('/week')
  }, [status, router])

  if (status === 'loading') {
    return <div className="min-h-screen bg-slate-950" />
  }

  if (status === 'authenticated') {
    return <div className="min-h-screen bg-slate-950" />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight">FamilyCal</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-2 transition-colors">
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Your family&apos;s calendar,
          <br />
          <span className="text-blue-400">all in one place</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A shared dashboard for busy families. See everyone&apos;s schedule, manage grocery lists,
          track chores, plan meals, and stay in sync &mdash; all from one beautiful screen.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="w-full sm:w-auto text-center font-semibold bg-blue-600 hover:bg-blue-500 rounded-xl px-8 py-4 text-lg transition-colors">
            Start Free Trial
          </Link>
          <Link href="#pricing" className="w-full sm:w-auto text-center font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl px-8 py-4 text-lg transition-colors">
            See Pricing
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">14-day free trial. No credit card required.</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Everything your family needs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Shared Calendar', desc: 'Connect Google or Outlook calendars. See everyone\'s schedule side by side.', icon: '\u{1F4C5}' },
            { title: 'Grocery Lists', desc: 'Add items from any device. Check them off at the store together.', icon: '\u{1F6D2}' },
            { title: 'Meal Planning', desc: 'Plan your week\'s meals. Link recipes and generate shopping lists.', icon: '\u{1F37D}\u{FE0F}' },
            { title: 'Chore Charts', desc: 'Assign tasks to family members. Track who did what and when.', icon: '\u{2705}' },
            { title: 'Family Alerts', desc: 'Send quick messages to the family dashboard. Great for reminders.', icon: '\u{1F514}' },
            { title: 'Touch Friendly', desc: 'Built for big screens and tablets. Works beautifully on any device.', icon: '\u{1F446}' },
          ].map((f) => (
            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Simple, honest pricing</h2>
        <p className="text-slate-400 text-center mb-12">Start free for 14 days. No credit card required.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-300">Monthly</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">$4.99</span>
              <span className="text-slate-400 ml-1">/mo</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-400 text-left">
              <li className="flex items-center gap-2"><span className="text-green-400">{'\u2713'}</span> Unlimited calendars</li>
              <li className="flex items-center gap-2"><span className="text-green-400">{'\u2713'}</span> All widgets included</li>
              <li className="flex items-center gap-2"><span className="text-green-400">{'\u2713'}</span> 2 family members</li>
              <li className="flex items-center gap-2"><span className="text-green-400">{'\u2713'}</span> Cancel anytime</li>
            </ul>
            <Link href="/signup" className="mt-6 block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium transition-colors">
              Start Free Trial
            </Link>
          </div>
          <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl p-8 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-xs font-bold px-3 py-1 rounded-full">
              SAVE 35%
            </div>
            <h3 className="text-lg font-semibold text-slate-300">Yearly</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">$39</span>
              <span className="text-slate-400 ml-1">/yr</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-400 text-left">
              <li className="flex items-center gap-2"><span className="text-green-400">{'\u2713'}</span> Unlimited calendars</li>
              <li className="flex items-center gap-2"><span className="text-green-400">{'\u2713'}</span> All widgets included</li>
              <li className="flex items-center gap-2"><span className="text-green-400">{'\u2713'}</span> 2 family members</li>
              <li className="flex items-center gap-2"><span className="text-green-400">{'\u2713'}</span> Cancel anytime</li>
            </ul>
            <Link href="/signup" className="mt-6 block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get organized?</h2>
        <p className="text-slate-400 mb-8">Join families who are finally on the same page.</p>
        <Link href="/signup" className="inline-block font-semibold bg-blue-600 hover:bg-blue-500 rounded-xl px-8 py-4 text-lg transition-colors">
          Start Your Free Trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>FamilyCal &mdash; Built for families who want to stay in sync.</p>
      </footer>
    </div>
  )
}
