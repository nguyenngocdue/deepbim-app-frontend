// ✅ File: src/hooks/useCoffeeSteamControls.ts
import { useControls } from 'leva'

export function useCoffeeSteamControls() {
  const controls = useControls('Coffee Steam', {
    visible: { value: true },
    color: { value: '#d2958a' },
    uTimeFrequency: { value: 0.0004, min: 0.0001, max: 0.001, step: 0.0001 },
    uUvX: { value: 4, min: 0.001, max: 100, step: 0.001 },
    uUvY: { value: 5, min: 0.001, max: 100, step: 0.001 },
  }, { collapsed: true })

  return controls
}