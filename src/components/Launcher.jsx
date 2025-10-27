import { FileText, Globe, Terminal, Folder, Settings, Search } from 'lucide-react'

const apps = [
  { id: 'notes', name: 'Notes', icon: FileText, color: 'bg-amber-500' },
  { id: 'browser', name: 'Browser', icon: Globe, color: 'bg-sky-500' },
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-emerald-500' },
  { id: 'files', name: 'Files', icon: Folder, color: 'bg-violet-500' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'bg-neutral-700' },
]

export default function Launcher({ visible, onLaunch, onClose }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full sm:max-w-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            placeholder="Search apps..."
            className="w-full bg-transparent outline-none text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400"
          />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onLaunch(app.id)}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <div className={`w-14 h-14 rounded-xl ${app.color} text-white grid place-items-center shadow-md group-hover:scale-105 transition-transform`}>
                <app.icon className="w-7 h-7" />
              </div>
              <span className="text-xs text-neutral-700 dark:text-neutral-300">{app.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
