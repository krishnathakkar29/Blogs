"use server";

import { prisma } from "@/lib/db";

export async function createBlog({
  title,
  slug,
  content,
}: {
  title: string;
  slug: string;
  content: string;
}) {
  try {
    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
      },
    });

    return {
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    };
  } catch (error) {
    console.error("Error creating blog:", error);
    return {
      success: false,
      message: "Error creating blog",
    };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        slug,
      },
    });

    return {
      success: true,
      blog,
    };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return {
      success: false,
      message: "Error fetching blog",
    };
  }
}

export async function getAllBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      blogs,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      message: "Error fetching blogs",
    };
  }
}
