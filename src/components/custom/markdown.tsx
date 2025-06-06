"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface SimpleMarkdownPreviewProps {
  content: string;
}

const components: Components = {
  code({ node, inline, className, children, ...props }: any) {
    if (inline) {
      return (
        <code className="bg-zinc-800 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    }

    return (
      <pre className="bg-zinc-900 p-4 rounded-md overflow-x-auto border border-zinc-800">
        <code className="text-sm font-mono" {...props}>
          {children}
        </code>
      </pre>
    );
  },
  img({ src, alt, ...props }: any) {
    return (
      <img
        src={src || "/placeholder.svg?height=400&width=600"}
        alt={alt}
        className="rounded-lg max-w-full h-auto my-4 border border-zinc-800"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg?height=400&width=600";
        }}
        {...props}
      />
    );
  },
  h1({ children }) {
    return <h1 className="text-3xl font-bold mb-4 text-white">{children}</h1>;
  },
  h2({ children }) {
    return (
      <h2 className="text-2xl font-semibold mb-3 text-white">{children}</h2>
    );
  },
  h3({ children }) {
    return <h3 className="text-xl font-medium mb-2 text-white">{children}</h3>;
  },
  p({ children }) {
    return <p className="mb-4 text-white/90 leading-relaxed">{children}</p>;
  },
  ul({ children }) {
    return (
      <ul className="list-disc list-inside mb-4 text-white/90">{children}</ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="list-decimal list-inside mb-4 text-white/90">
        {children}
      </ol>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-4 border-zinc-600 pl-4 italic text-white/80 my-4">
        {children}
      </blockquote>
    );
  },
};

export function Markdown({ content }: SimpleMarkdownPreviewProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
