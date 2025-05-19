import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa"

export function FormProfileInput({
  label,
  defaultValue = '',
  type = 'text',
  placeholder = '',
}: {
  label: string
  defaultValue?: string
  type?: string
  placeholder?: string
}) {
  // Hỗ trợ show/hide password nếu type='password'
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <label className="block mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">{label}</label>
      <div className="relative">
        <Input
          placeholder={placeholder || label}
          defaultValue={defaultValue}
          type={isPassword && !showPassword ? 'password' : 'text'}
          className="px-4 py-3 text-base rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 pr-12"
        />
        {isPassword && (
          <button
            type="button"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>
    </div>
  )
}
