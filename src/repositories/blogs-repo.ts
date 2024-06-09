import { v4 as uuidv4 } from "uuid";

export type Blog = {
  id: ReturnType<typeof uuidv4>;
  name: string;
  description: string;
  websiteUrl: string;
};

export let blogs: Array<Blog> = [
  //   {
  //     id: "uuidq",
  //     name: "Blog 1",
  //     description: "Content 1",
  //     websiteUrl: "https://www.blog1.com",
  //   },
];

export const blogsRepository = {
  create(blog: Blog) {
    if (blog) {
      blogs.push(blog);
      return true;
    } else {
      return false;
    }
  },
  findAll() {
    return blogs;
  },
  findById(id: string) {
    return blogs.find((blog) => blog.id === id);
  },
  deleteById(id: string) {
    const blogIndex = blogs.findIndex((blog) => blog.id === id);
    if (blogIndex !== -1) {
      blogs.splice(blogIndex, 1);
      return true;
    } else {
      return false;
    }
  },
  updateById(id: string, blog: Blog) {
    const blogIndex = blogs.findIndex((blog) => blog.id === id);
    if (blogIndex !== -1) {
      blogs[blogIndex] = blog;
      return true;
    } else {
      return false;
    }
  },
  deleteAll() {
    blogs = [];
  },
};
