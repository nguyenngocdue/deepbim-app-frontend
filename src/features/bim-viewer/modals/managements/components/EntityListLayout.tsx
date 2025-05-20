// EntityListLayout.tsx
import { ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EntityListLayoutProps {
  title: string
  description?: string
  tabs?: { value: string; label: string }[]
  activeTab?: string
  onTabChange?: (value: string) => void
  dialog: ReactNode
  searchBar: ReactNode
  children: ReactNode // TableContent hoặc bất kỳ bảng nào
  footer?: ReactNode // Custom footer (optional)
  countInfo?: string // Hiển thị số lượng (optional)
}

export function EntityListLayout({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  dialog,
  searchBar,
  children,
  footer,
  countInfo
}: EntityListLayoutProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1 text-gray-700 dark:text-gray-200">{title}</h1>
      {description && <p className="text-muted-foreground mb-6">{description}</p>}

      {tabs && (
        <Tabs value={activeTab || tabs[0]?.value} className="mb-4" onValueChange={onTabChange}>
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="flex items-center justify-between mb-4">
        {dialog}
        <div className="flex gap-2 items-center justify-between">
          {searchBar}
        </div>
      </div>

      {children}

      {footer ? (
        footer
      ) : (
        <div className="flex justify-between items-center px-4 py-2 text-sm text-muted-foreground">
          <div>{countInfo}</div>
          <div className="flex gap-2">
            <button className="btn-ghost">«</button>
            <div>1 of 1</div>
            <button className="btn-ghost">»</button>
          </div>
        </div>
      )}
    </div>
  )
}
