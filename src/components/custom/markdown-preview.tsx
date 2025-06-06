"use client";

import { Markdown } from "./markdown";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content) {
    return <p className="text-white/60 italic">No content to preview</p>;
  }

  return <Markdown content={content} />;
}
