import { useEffect, useMemo, useState } from 'react'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import Window from './components/Window'
import { FileText, Globe, Terminal, Folder, Settings } from 'lucide-react'
import Launcher from './components/Launcher'

const APP_META = {
  notes: { title: 'Notes', icon: FileText, minSize: { w: 360, h: 260 } },
  browser: { title: 'Browser', icon: Globe, minSize: { w: 500, h: 360 } },
  terminal: { title: 'Terminal', icon: Terminal, minSize: { w: 420, h: 280 } },
  files: { title: 'Files', icon: Folder, minSize: { w: 400, h: 300 } },
  settings: { title: 'Settings', icon: Settings, minSize: { w: 420, h: 320 } },
}

function getRandomPos() {
  const w = Math.max(360, Math.round(window.innerWidth * 0.4))
  const h = Math.max(260, Math.round(window.innerHeight * 0.45))
  const x = Math.round(Math.random() * (window.innerWidth - w - 40)) + 20
  const y = Math.round(Math.random() * (window.innerHeight - h - 100)) + 20
  return { position: { x, y }, size: { w, h } }
}

export default function App() {
  const [windows, setWindows] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [zTop, setZTop] = useState(10)
  const [showLauncher, setShowLauncher] = useState(false)
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const openApp = (appId) => {
    const meta = APP_META[appId]
    if (!meta) return
    const { position, size } = getRandomPos()
    const id = `${appId}-${Date.now()}-${Math.floor(Math.random() * 9999)}`
    const newWin = {
      id,
      appId,
      title: meta.title,
      icon: meta.icon,
      position,
      size,
      minimized: false,
      maximized: false,
      z: zTop + 1,
    }
    setZTop((z) => z + 2)
    setWindows((prev) => [...prev, newWin])
    setActiveId(id)
    setShowLauncher(false)
  }

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const minimizeWindow = (id) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)))
    if (activeId === id) setActiveId(null)
  }

  const maximizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w))
    )
    setActiveId(id)
    setZTop((z) => z + 1)
  }

  const focusWindow = (id) => {
    const z = zTop + 1
    setZTop(z)
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)))
    setActiveId(id)
  }

  const dragWindow = (id, position) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position } : w)))
  }

  const activateFromTaskbar = (id) => {
    const win = windows.find((w) => w.id === id)
    if (!win) return
    if (win.minimized) {
      focusWindow(id)
    } else if (activeId === id) {
      minimizeWindow(id)
    } else {
      focusWindow(id)
    }
  }

  const running = useMemo(() => windows.map((w) => ({ id: w.id, title: w.title, icon: w.icon })), [windows])

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <Desktop onOpen={openApp} />

      {windows.map((w) => (
        <Window
          key={w.id}
          id={w.id}
          title={w.title}
          icon={w.icon}
          position={w.position}
          size={w.size}
          minimized={w.minimized}
          maximized={w.maximized}
          zIndex={w.z}
          onDrag={dragWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
        >
          <AppContent appId={w.appId} />
        </Window>
      ))}

      <Launcher visible={showLauncher} onLaunch={openApp} onClose={() => setShowLauncher(false)} />

      <Taskbar
        windows={running}
        activeId={activeId}
        onActivate={activateFromTaskbar}
        onToggleLauncher={() => setShowLauncher((v) => !v)}
        dark={dark}
        setDark={setDark}
      />
    </div>
  )
}

function AppContent({ appId }) {
  switch (appId) {
    case 'notes':
      return <NotesApp />
    case 'browser':
      return <BrowserApp />
    case 'terminal':
      return <TerminalApp />
    case 'files':
      return <FilesApp />
    case 'settings':
      return <SettingsApp />
    default:
      return <div className="p-4">Unknown app</div>
  }
}

function NotesApp() {
  const [text, setText] = useState('Welcome to your notes!\n\n- Jot thoughts\n- Draft ideas\n- Plan your next big win')
  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-3 py-2 text-xs text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Notes</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-4 outline-none bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 resize-none"
      />
    </div>
  )
}

function BrowserApp() {
  const [url, setUrl] = useState('https://example.com')
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-2 p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <span className="text-xs text-neutral-500">Address</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm outline-none"
        />
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-sm"
        >
          Go
        </a>
      </div>
      <div className="flex-1 p-6 text-sm text-neutral-700 dark:text-neutral-300 overflow-auto">
        <h3 className="text-lg font-semibold mb-2">Mini Browser</h3>
        <p className="mb-2">For security, external pages open in a new tab. Use the address bar and click Go.</p>
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-4">
          <p className="mb-1">Suggested links:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><a className="text-sky-600 hover:underline" href="https://example.com" target="_blank" rel="noreferrer">example.com</a></li>
            <li><a className="text-sky-600 hover:underline" href="https://developer.mozilla.org" target="_blank" rel="noreferrer">MDN Web Docs</a></li>
            <li><a className="text-sky-600 hover:underline" href="https://news.ycombinator.com" target="_blank" rel="noreferrer">Hacker News</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function TerminalApp() {
  const [lines, setLines] = useState(['web-os$ Hello! Type "help"'])
  const [input, setInput] = useState('')
  const onSubmit = (e) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return
    let output = ''
    switch (cmd) {
      case 'help':
        output = 'commands: help, date, echo <text>, about'
        break
      case 'date':
        output = new Date().toString()
        break
      case 'about':
        output = 'This is a playful web OS terminal. Built with love.'
        break
      default:
        if (cmd.startsWith('echo ')) output = cmd.slice(5)
        else output = `command not found: ${cmd}`
    }
    setLines((prev) => [...prev, `web-os$ ${cmd}`, output])
    setInput('')
  }
  return (
    <div className="w-full h-full bg-neutral-950 text-neutral-100 font-mono text-sm p-3">
      <div className="h-full overflow-auto space-y-1">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">{l}</div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
        <span className="text-emerald-400">web-os$</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none border-b border-neutral-700"
        />
      </form>
    </div>
  )
}

function FilesApp() {
  const files = [
    { name: 'Resume.pdf', type: 'pdf', size: '128 KB' },
    { name: 'Photo.png', type: 'image', size: '2.4 MB' },
    { name: 'Song.mp3', type: 'audio', size: '5.1 MB' },
    { name: 'Notes.txt', type: 'text', size: '4 KB' },
  ]
  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-3 py-2 text-xs text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">This is a mock file explorer</div>
      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-auto">
        {files.map((f) => (
          <div key={f.name} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{f.name}</div>
            <div className="text-xs text-neutral-500">{f.type} • {f.size}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsApp() {
  const [accent, setAccent] = useState('indigo')
  return (
    <div className="w-full h-full p-4 space-y-4">
      <h3 className="text-lg font-semibold">Settings</h3>
      <div className="space-y-2">
        <div className="text-sm text-neutral-500">Accent color</div>
        <div className="flex items-center gap-2">
          {['indigo', 'sky', 'emerald', 'violet', 'rose'].map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={`w-8 h-8 rounded-full bg-${accent === c ? c : 'neutral'}-500`}
              aria-label={c}
            />
          ))}
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">This is a demo. Accent color updates here only.</p>
      </div>
    </div>
  )
}
