import { Separator } from "@/components/ui/separator";
import { Blog } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";

function BlogList({
  blogs,
}: {
  blogs: Pick<Blog, "id" | "title" | "slug" | "content" | "createdAt">[];
}) {
  return (
    <div className="space-y-8">
      {blogs.map((blog) => (
        <React.Fragment key={blog.id}>
          <article className="group">
            <Link href={`/${blog.slug}`}>
              <div className="space-y-1">
                <h2 className="text-xl font-medium leading-tight group-hover:text-white/80 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-sm text-white/60">
                  {formatDate(blog.createdAt)}
                </p>
              </div>
              <p>
                {blog.content.substring(0, 150) +
                  (blog.content.length > 150 ? "..." : "")}
              </p>
            </Link>
          </article>
          <Separator className="h-[1px] text-white bg-white" />
        </React.Fragment>
      ))}
    </div>
  );
}

export default BlogList;
