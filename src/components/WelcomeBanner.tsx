
export function WelcomeBanner({ name }: { name: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold tracking-tight">
        Welcome, <span className="capitalize">{name}</span>
      </h2>
      <p className="text-sm text-muted-foreground">
        What would you like to do today?
      </p>
    </div>
  )
}
