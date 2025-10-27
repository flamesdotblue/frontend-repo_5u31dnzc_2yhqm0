import { useEffect, useState } from 'react'
import { Menu, Sun, Moon, Wifi, Battery, Power } from 'lucide-react'

export default function Taskbar({ windows, activeId, onActivate, onToggleLauncher, dark, setDark }) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <button onClick={onToggleLauncher} className="px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2">
          <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
          <span className="hidden sm:block text-sm font-medium text-neutral-800 dark:text-neutral-200">Start</span>
        </button>
        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw] sm:max-w-[60vw]">
          {windows.map((w) => (
            <button
              key={w.id}
              onClick={() => onActivate(w.id)}
              className={`mx-1 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border transition-colors ${
                activeId === w.id
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              {w.icon ? <w.icon className="w-4 h-4" /> : null}
              <span className="hidden sm:block truncate max-w-[10rem]">{w.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-200">
        <Wifi className="w-4 h-4" />
        <Battery className="w-4 h-4" />
        <button
          onClick={() => setDark(!dark)}
          className="px-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <span className="text-sm tabular-nums">{timeStr}</span>
        <button className="px-2 py-1.5 rounded-lg hover:bg-red-100/60 dark:hover:bg-red-900/40 text-red-600" aria-label="Power">
          <Power className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
