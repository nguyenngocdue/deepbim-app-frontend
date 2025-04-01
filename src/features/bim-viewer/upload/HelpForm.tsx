import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HelpFormProps {
  onClose: () => void;
}

const HelpForm = ({ onClose }: HelpFormProps) => {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed bottom-16 left-6 w-80 rounded-2xl border-2 border-border bg-background p-6 shadow-xl ring-1 ring-gray-100/50 transition-all duration-200 hover:shadow-2xl">
      <h2 className="mb-5 text-xl font-semibold text-foreground">Got an issue?</h2>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Business Email
        </label>
        <input
          type="email"
          placeholder="your.email@your-company.com"
          className="w-full rounded-lg border-2 border-input bg-input/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/50 focus-visible:outline-none transition-colors duration-150"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Description Textarea */}
      <div className="mt-5 space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Description <span className="text-muted-foreground/80">(required)</span>
        </label>
        <textarea
          placeholder="Tell us what’s wrong or how we can improve!"
          className="h-28 w-full rounded-lg border-2 border-input bg-input/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/50 focus-visible:outline-none transition-colors duration-150"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Capture Screenshot Button */}
      <div className="mt-5">
        <Button
          variant="secondary"
          className="w-full rounded-lg border-2 border-secondary bg-secondary/80 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/95 hover:border-secondary-dark transition-all duration-200"
        >
          Capture a screenshot
        </Button>
        <p className="mt-1.5 text-xs text-destructive/90 italic">Permission denied</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="default"
          className="w-full rounded-lg border-2 border-primary bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:border-primary-dark transition-all duration-200"
        >
          Submit
        </Button>
        <Button
          variant="secondary"
          className="w-full rounded-lg border-2 border-secondary bg-secondary/80 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/95 hover:border-secondary-dark transition-all duration-200"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default HelpForm;