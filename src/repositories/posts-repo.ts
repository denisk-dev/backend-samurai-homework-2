import { v4 as uuidv4 } from "uuid";

export type Post = {
  id: ReturnType<typeof uuidv4>;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

export let posts: Array<Post> = [
  // {
  //   id: "acxvsfsf23",
  //   title: "Post 1",
  //   shortDescription: "Content 1",
  //   content: "Lorem Lorem Lorem",
  //   blogId: "24234ssfgd",
  //   blogName: "Blog 1",
  // },
];

export const postsRepository = {
  create(post: Post) {
    if (post) {
      posts.push(post);
      return true;
    } else {
      return false;
    }
  },
  findAll() {
    return posts;
  },
  findById(id: string) {
    return posts.find((post) => post.id === id);
  },
  deleteById(id: string) {
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex !== -1) {
      posts.splice(postIndex, 1);
      return true;
    } else {
      return false;
    }
  },
  updateById(id: string, post: Post) {
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex !== -1) {
      posts[postIndex] = post;
      return true;
    } else {
      return false;
    }
  },
  deleteAll() {
    posts = [];
  },
};
