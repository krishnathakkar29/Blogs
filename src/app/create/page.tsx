"use client";

import { MarkdownPreview } from "@/components/custom/markdown-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { Code, ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/custom/image-upload";
import { createBlog } from "../../../actions/blog";

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      const blog = await createBlog({
        title,
        slug: finalSlug,
        content,
      });

      if (!blog.success) {
        toast.error("Error creating blog");
        return;
      }

      toast.success("Blog created successfully");
      router.push(`${blog.blog?.slug}`);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Error creating blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertCodeSnippet = (code: string, lang: string) => {
    const codeBlock = `\`\`\`${lang}\n${code}\n\`\`\``;
    insertAtCursor(codeBlock);
    setShowCodeEditor(false);
  };

  const insertImage = (imageUrl: string, altText: string) => {
    const imageMarkdown = `![${altText}](${imageUrl})`;
    insertAtCursor(imageMarkdown);
    setShowImageUpload(false);
    toast.success("Image inserted into content");
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent =
        content.substring(0, start) +
        "\n\n" +
        text +
        "\n\n" +
        content.substring(end);

      setContent(newContent);

      // Focus and set cursor position after state update
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + text.length + 4;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    } else {
      setContent((prev) => prev + "\n\n" + text + "\n\n");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Auto-generate slug if not manually set
    if (!slug) {
      const autoSlug = newTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setSlug(autoSlug);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tighter">Create Blog</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {isPreview ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter">
              {title || "Untitled Blog"}
            </h1>
            <p className="text-sm text-white/60">
              {formatDate(new Date().toISOString())}
            </p>
          </div>

          <hr className="border-zinc-800" />

          <div className="prose prose-invert max-w-none">
            <MarkdownPreview content={content} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter blog title"
              className="bg-zinc-900 border-zinc-800"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              className="bg-zinc-900 border-zinc-800"
            />
            <p className="text-xs text-white/60">
              Leave empty to auto-generate from title
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content (Markdown supported)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(true)}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Add Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCodeEditor(true)}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Add Code
                </Button>
              </div>
            </div>
            <Textarea
              id="content"
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              className="min-h-[400px] bg-zinc-900 border-zinc-800 font-mono text-sm"
              required
            />
            <p className="text-xs text-white/60">
              Supports Markdown: **bold**, *italic*, # headings, \`\`\`code
              blocks\`\`\`, images, etc.
            </p>
          </div>

          {/* {showCodeEditor && (
            <CodeSnippetEditor
              onInsert={insertCodeSnippet}
              onCancel={() => setShowCodeEditor(false)}
              language={language}
              onLanguageChange={setLanguage}
            />
          )} */}
          {showImageUpload && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                <ImageUpload
                  onInsert={insertImage}
                  onCancel={() => setShowImageUpload(false)}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Blog"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
