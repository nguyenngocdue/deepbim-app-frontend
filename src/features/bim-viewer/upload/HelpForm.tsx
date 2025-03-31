import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HelpFormProps {
  onClose: () => void;
}

const HelpForm = ({ onClose }: HelpFormProps) => {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed bottom-16 left-6 bg-background p-6 rounded-xl shadow-lg w-80 border">
      <h2 className="text-lg font-semibold">Any issue?</h2>

      {/* Email Input */}
      <label className="block text-sm mt-2">Business Email</label>
      <input
        type="email"
        placeholder="your.email@your-company.com"
        className="w-full p-2 rounded bg-input border border-input ring-offset-background focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none mt-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Description Textarea */}
      <label className="block text-sm mt-3">Description (required)</label>
      <textarea
        placeholder="What's the issue? How can we improve?"
        className="w-full p-2 rounded bg-input border border-input ring-offset-background focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none mt-1 h-20"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {/* Capture Screenshot Button */}
      <Button variant="secondary" className="mt-3 w-full">
        Capture a screenshot
      </Button>
      <p className="text-destructive text-sm mt-1">Permission denied</p>

      {/* Submit and Cancel Buttons */}
      <Button variant="default" className="mt-3 w-full">
        Submit
      </Button>
      <Button variant="secondary" className="mt-2 w-full" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );
};

export default HelpForm;