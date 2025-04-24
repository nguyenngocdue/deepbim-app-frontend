// ✅ File: src/utils/EventEmitter.ts
export default class EventEmitter {
    private callbacks: Record<string, Record<string, Array<(...args: any[]) => any>>> = {
      base: {},
    }
  
    on(eventNames: string, callback: (...args: any[]) => void): this {
      const names = this.resolveNames(eventNames)
  
      for (const rawName of names) {
        const { namespace, value } = this.resolveName(rawName)
  
        if (!this.callbacks[namespace]) {
          this.callbacks[namespace] = {}
        }
  
        if (!this.callbacks[namespace][value]) {
          this.callbacks[namespace][value] = []
        }
  
        this.callbacks[namespace][value].push(callback)
      }
  
      return this
    }
  
    off(eventNames: string): this {
      const names = this.resolveNames(eventNames)
  
      for (const rawName of names) {
        const { namespace, value } = this.resolveName(rawName)
  
        if (namespace !== 'base' && value === '') {
          delete this.callbacks[namespace]
        } else if (namespace === 'base') {
          for (const ns in this.callbacks) {
            delete this.callbacks[ns][value]
            if (Object.keys(this.callbacks[ns]).length === 0) delete this.callbacks[ns]
          }
        } else {
          delete this.callbacks[namespace][value]
          if (Object.keys(this.callbacks[namespace]).length === 0) delete this.callbacks[namespace]
        }
      }
  
      return this
    }
  
    trigger(eventName: string, args: any[] = []): void {
      const resolvedNames = this.resolveNames(eventName)
      const { namespace, value } = this.resolveName(resolvedNames[0])
  
      if (namespace === 'base') {
        for (const ns in this.callbacks) {
          const callbacks = this.callbacks[ns][value]
          if (callbacks) callbacks.forEach(cb => cb(...args))
        }
      } else {
        const callbacks = this.callbacks[namespace]?.[value]
        if (callbacks) callbacks.forEach(cb => cb(...args))
      }
    }
  
    private resolveNames(names: string): string[] {
      return names.replace(/[^a-zA-Z0-9 ,/.]/g, '').replace(/[,/]+/g, ' ').split(' ')
    }
  
    private resolveName(name: string): { value: string; namespace: string } {
      const parts = name.split('.')
      return {
        value: parts[0],
        namespace: parts[1] || 'base',
      }
    }
  }