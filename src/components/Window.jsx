import { useEffect, useRef, useState } from 'react'
import { X, Minus, Maximize2 } from 'lucide-react'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export default function Window({
  id,
  title,
  icon: Icon,
  children,
  position,
  size,
  zIndex,
  minimized,
  maximized,
  onDrag,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}) {
  const winRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const offsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragging) return
      const node = winRef.current
      if (!node) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      const newX = clamp(e.clientX - offsetRef.current.x, 0, vw - node.offsetWidth)
      const newY = clamp(e.clientY - offsetRef.current.y, 0, vh - node.offsetHeight)
      onDrag(id, { x: newX, y: newY })
    }
    function onMouseUp() {
      setDragging(false)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragging, id, onDrag])

  const handleMouseDown = (e) => {
    if (maximized) return
    const rect = winRef.current?.getBoundingClientRect()
    if (!rect) return
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setDragging(true)
    onFocus(id)
  }

  const style = maximized
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
      }
    : {
        left: position.x,
        top: position.y,
        width: size.w,
        height: size.h,
      }

  return (
    <div
      ref={winRef}
      onMouseDown={() => onFocus(id)}
      className={`fixed bg-white dark:bg-neutral-900 shadow-2xl rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden select-none ${
        minimized ? 'hidden' : ''
      }`}
      style={{ ...style, zIndex }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" /> : null}
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation()
              onMinimize(id)
            }}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            aria-label={maximized ? 'Restore' : 'Maximize'}
            onClick={(e) => {
              e.stopPropagation()
              onMaximize(id)
            }}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              onClose(id)
            }}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="w-full h-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
        {children}
      </div>
    </div>
  )
}
