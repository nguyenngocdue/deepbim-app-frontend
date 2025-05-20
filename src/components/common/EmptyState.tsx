export default function EmptyState({ message = "No data to display." }) {
  return (
    <div className="text-center text-muted-foreground py-8">
      {message}
    </div>
  );
}
