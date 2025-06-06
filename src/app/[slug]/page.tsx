import { formatDate } from "@/lib/utils";
import React from "react";

import { prisma } from "@/lib/db";
import { Markdown } from "@/components/custom/markdown";

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const blog = await prisma.blog.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!blog) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold tracking-tighter">Blog not found</h1>
      </div>
    );
  }

  return (
    <article className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">{blog.title}</h1>
        <p className="text-sm text-white/60">
          {formatDate(blog.createdAt)}
          {/* {blog.formattedDate && `(${blog.formattedDate})`} */}
        </p>
      </div>

      <hr className="border-zinc-800" />

      <div className="prose">
        <Markdown content={blog.content} />
      </div>
    </article>
  );
}

export default page;
