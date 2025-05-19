import { useState, useEffect } from 'react'
import { SocialSelect, SOCIAL_OPTIONS } from './SocialSelect'

export function SocialProfileInputs({ value = [], onChange }: {
  value?: { name: string, link: string }[],
  onChange?: (val: { name: string, link: string }[]) => void
}) {
  const [fields, setFields] = useState(
    value && value.length ? value : [{ name: '', link: '' }]
  )

  // ĐỒNG BỘ FIELDS KHI VALUE TỪ FORM/PROPS THAY ĐỔI
  useEffect(() => {
    setFields(value && value.length ? value : [{ name: '', link: '' }])
  }, [value])

  const handleAdd = () => setFields([...fields, { name: '', link: '' }])
  const handleRemove = (idx: number) => {
    const next = fields.filter((_, i) => i !== idx)
    setFields(next)
    onChange?.(next)
  }
  const handleChange = (idx: number, key: 'name' | 'link', val: string) => {
    const next = fields.map((f, i) =>
      i === idx ? { ...f, [key]: val } : f
    )
    setFields(next)
    onChange?.(next)
  }

  return (
    <div className="space-y-3">
      {fields.map((field, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <SocialSelect
            value={field.name}
            onChange={v => handleChange(idx, 'name', v)}
          />
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-xl border bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
            placeholder="Enter link or username"
            value={field.link}
            onChange={e => handleChange(idx, 'link', e.target.value)}
          />
          <span className="ml-2">{SOCIAL_OPTIONS.find(o => o.key === field.name)?.icon}</span>
          {fields.length > 1 && (
            <button type="button"
              className="ml-1 px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-red-200"
              onClick={() => handleRemove(idx)}
              tabIndex={-1}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="mt-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-xl font-medium hover:bg-indigo-200"
        onClick={handleAdd}
      >
        + Add Social Network
      </button>
    </div>
  )
}
