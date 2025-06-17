import { Card, CardContent } from "@/components/ui/card";

export default function UpdatingContentCard() {
  return (
    <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 pt-8 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 font-semibold">
          Chúng tôi đang cập nhật nội dung
        </p>
      </CardContent>
    </Card>
  );
}