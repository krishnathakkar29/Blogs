import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

export function escapeCodeBlocks(content: string): string {
  return content.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_, language = "", codeBody) => {
      // language is now the text immediately after ``` (e.g. "js" or "typescript")
      const escaped = encodeURIComponent(codeBody);
      return `:::code-block-start:::${language}\n${escaped}\n:::code-block-end:::`;
    }
  );
}

// Helper function to unescape code blocks for display
export function unescapeCodeBlocks(content: string): string {
  // Find all escaped code blocks and convert them back
  return content.replace(
    /:::code-block-start:::(.*?)\n([\s\S]*?)\n:::code-block-end:::/g,
    (match, language, encodedCode) => {
      const code = decodeURIComponent(encodedCode);
      return `\`\`\`${language}\n${code}\n\`\`\``;
    }
  );
}
