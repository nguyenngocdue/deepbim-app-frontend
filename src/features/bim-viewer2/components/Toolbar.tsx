interface ToolbarProps {
  onToggleSection: () => void
  onResetView: () => void
}

export default function Toolbar({ onToggleSection, onResetView }: ToolbarProps) {
  return (
    <div className="fixed top-4 left-4 z-50 flex space-x-2 bg-black/40 p-2 rounded text-white shadow">
      <button onClick={onToggleSection} className="hover:bg-white hover:text-black px-3 py-1 rounded">
        ✂️ Section
      </button>
      <button onClick={onResetView} className="hover:bg-white hover:text-black px-3 py-1 rounded">
        🔄 Reset
      </button>
    </div>
  )
}
