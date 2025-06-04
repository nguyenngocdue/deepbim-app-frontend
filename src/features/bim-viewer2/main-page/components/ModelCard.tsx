import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

interface ModelCardProps {
  title: string
  description: string
  imageUrl: string
  linkUrl: string 
}

export default function ModelCard({ title, description, imageUrl, linkUrl }: ModelCardProps) {
  return (
    <a href={linkUrl} target="_blank" rel="noopener noreferrer">
      <Card className="w-full max-w-sm shadow-md hover:shadow-lg transition hover:ring-2 hover:ring-blue-400">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-t-md" />
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
        </CardContent>
      </Card>
    </a>
  )
}
