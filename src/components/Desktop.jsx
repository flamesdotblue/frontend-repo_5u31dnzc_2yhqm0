import { FileText, Globe, Terminal, Folder } from 'lucide-react'

const icons = [
  { id: 'notes', name: 'Notes', icon: FileText },
  { id: 'browser', name: 'Browser', icon: Globe },
  { id: 'terminal', name: 'Terminal', icon: Terminal },
  { id: 'files', name: 'Files', icon: Folder },
]

const wallpapers = {
  aurora: 'from-sky-100 via-indigo-100 to-fuchsia-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-black',
  sunset: 'from-rose-100 via-orange-100 to-amber-100 dark:from-rose-900 dark:via-fuchsia-950 dark:to-amber-950',
  ocean: 'from-cyan-100 via-sky-100 to-indigo-100 dark:from-slate-900 dark:via-sky-950 dark:to-indigo-950',
}

export default function Desktop({ onOpen, wallpaper = 'aurora' }) {
  const gradient = wallpapers[wallpaper] || wallpapers.aurora
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      <div className="absolute inset-0 opacity-[0.05]" aria-hidden>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-neutral-900 dark:text-white" />
        </svg>
      </div>

      <div className="relative p-6 grid grid-cols-3 sm:grid-cols-6 gap-6 max-w-5xl">
        {icons.map((app) => (
          <button
            key={app.id}
            onClick={() => onOpen(app.id)}
            className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5"
          >
            <div className="w-14 h-14 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur grid place-items-center border border-white/40 dark:border-white/10 shadow">
              <app.icon className="w-7 h-7 text-neutral-800 dark:text-neutral-200" />
            </div>
            <span className="text-xs text-neutral-800/90 dark:text-neutral-200/90">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
