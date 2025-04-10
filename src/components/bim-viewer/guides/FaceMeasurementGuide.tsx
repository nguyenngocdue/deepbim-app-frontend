// src/components/ui/FaceMeasurementGuide.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface FaceMeasurementGuideProps {
  isEnabled: boolean;
}

export default function FaceMeasurementGuide({ isEnabled }: FaceMeasurementGuideProps) {
  if (!isEnabled) return null;

  return (
    <Card className="w-[320px] bg-black/80 text-white fixed bottom-20 right-6 z-50 shadow-xl rounded-xl">
      <CardContent className="p-5 space-y-4">
        <h2 className="text-xl font-semibold text-center">Face Measurement Tutorial</h2>
        <Accordion type="single" collapsible className="text-sm">
          <AccordionItem value="controls">
            <AccordionTrigger className="hover:no-underline">Controls</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2 leading-relaxed text-left">
                <li><strong>Double click</strong>: Create dimension</li>
                <li><strong>Press O</strong>: Delete dimension</li>
                <li><strong>Press S</strong>: Delete all dimensions</li>
                <li><strong>Press L</strong>: Set/Show saved dimensions</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}