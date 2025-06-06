import BlogList from "@/components/custom/blog-list";
import { prisma } from "@/lib/db";

async function page() {
  const blogs = await prisma.blog.findMany({});
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tighter">Blogs</h1>
      <BlogList blogs={blogs} />
    </div>
  );
}
export default page;
