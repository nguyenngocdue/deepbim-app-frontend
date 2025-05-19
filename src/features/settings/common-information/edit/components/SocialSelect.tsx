import * as Select from '@radix-ui/react-select'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaGlobe } from "react-icons/fa"

export const SOCIAL_OPTIONS = [
  { key: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-600" /> },
  { key: 'twitter', label: 'Twitter', icon: <FaTwitter className="text-sky-500" /> },
  { key: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-sky-700" /> },
  { key: 'instagram', label: 'Instagram', icon: <FaInstagram className="text-pink-600" /> },
  { key: 'github', label: 'Github', icon: <FaGithub className="text-zinc-700" /> },
  { key: 'website', label: 'Website', icon: <FaGlobe className="text-indigo-600" /> },
];

export function SocialSelect({
  value, onChange,
}: {
  value: string,
  onChange: (val: string) => void,
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className="inline-flex items-center w-36 px-3 py-2 rounded-xl border bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 justify-between"
        aria-label="Social Network"
      >
        <Select.Value>
          {SOCIAL_OPTIONS.find(opt => opt.key === value)?.label || 'Select...'}
        </Select.Value>
        <Select.Icon>
          {SOCIAL_OPTIONS.find(opt => opt.key === value)?.icon}
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white dark:bg-zinc-900 rounded-xl shadow-md mt-2">
          <Select.Viewport>
            {SOCIAL_OPTIONS.map(opt => (
              <Select.Item
                key={opt.key}
                value={opt.key}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-zinc-700 rounded-lg"
              >
                <span>{opt.icon}</span>
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
