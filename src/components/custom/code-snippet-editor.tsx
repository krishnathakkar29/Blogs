"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimpleCodeEditorProps {
  onInsert: (code: string, language: string) => void;
  onCancel: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "json", label: "JSON" },
  { value: "python", label: "Python" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
];

export function CodeSnippetEditor({
  onInsert,
  onCancel,
  language,
  onLanguageChange,
}: SimpleCodeEditorProps) {
  const [code, setCode] = useState("");

  return (
    <div className="space-y-4 p-4 border border-zinc-800 rounded-md bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Add Code Snippet</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`Enter your ${
            LANGUAGES.find((l) => l.value === language)?.label || language
          } code here...`}
          className="min-h-[200px] bg-zinc-900 border-zinc-800 font-mono text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onInsert(code, language)}
          disabled={!code.trim()}
        >
          Insert Code
        </Button>
      </div>
    </div>
  );
}
