// import { v4 as uuidv4 } from "uuid";
import { posts } from "./db";
import { ObjectId } from "mongodb";

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

export const postsRepository = {
  async create(post: Post) {
    const result = await posts.insertOne({ ...post, createdAt: new Date() });
    return result.insertedId.toString();
  },
  async findAll() {
    return posts.find().toArray();
  },
  async findById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return posts.findOne({ _id: new ObjectId(id) });
  },
  async deleteById(id: string) {
    const result = await posts.deleteOne({ _id: new ObjectId(id) });
    if (!ObjectId.isValid(id)) {
      return false;
    }
    return result.deletedCount === 1;
  },
  async updateById(id: string, post: Post) {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const result = await posts.updateOne(
      { _id: new ObjectId(id) },
      { $set: post }
    );
    return result.matchedCount === 1;
  },
  async deleteAll() {
    await posts.drop();
  },
};
