'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if dismissed
    if (localStorage.getItem('pwa-install-dismissed') === 'true') return

    // Detect iOS
    const ua = navigator.userAgent
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches

    if (isStandalone) return // Already installed

    if (isiOS) {
      setIsIOS(true)
      setShowBanner(true)
      return
    }

    function handleBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  function dismiss() {
    setShowBanner(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 rounded-t-2xl py-4 px-6 z-50 shadow-lg">
      <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">
            Add FamilyCal to your home screen
          </p>
          {isIOS && (
            <p className="text-blue-100 text-xs mt-1">
              Tap <span className="font-semibold">Share</span> then{' '}
              <span className="font-semibold">Add to Home Screen</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="bg-white text-blue-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Install
            </button>
          )}
          <button
            onClick={dismiss}
            className="text-blue-100 hover:text-white text-sm px-2 py-2 transition-colors"
            aria-label="Dismiss"
          >
            &#10005;
          </button>
        </div>
      </div>
    </div>
  )
}
