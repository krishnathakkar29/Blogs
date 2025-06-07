import BlogList from "@/components/custom/blog-list";
import { prisma } from "@/lib/db";
import { getAllBlogs } from "../../actions/blog";

async function page() {
  const blogs = await getAllBlogs();

  if (!blogs.success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">
          Error fetching blogs, Try reloading
        </h1>
      </div>
    );
  }

  if (blogs.blogs!.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">
          Hang on , no blogs at this moment
        </h1>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tighter">Blogs</h1>
      <BlogList blogs={blogs.blogs!} />
    </div>
  );
}
export default page;
