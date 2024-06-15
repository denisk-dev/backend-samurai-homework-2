// import { v4 as uuidv4 } from "uuid";
import { client } from "./db";
import { ObjectId } from "mongodb";

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

const posts = client.db("samurai").collection("posts");

export const postsRepository = {
  async create(post: Post) {
    const result = await posts.insertOne(post);
    return result.insertedId.toString();
  },
  async findAll() {
    return posts.find().toArray();
  },
  async findById(id: string) {
    return posts.findOne({ _id: new ObjectId(id) });
  },
  async deleteById(id: string) {
    const result = await posts.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
  async updateById(id: string, post: Post) {
    const result = await posts.replaceOne({ _id: new ObjectId(id) }, post);
    return result.modifiedCount === 1;
  },
  async deleteAll() {
    await posts.drop();
  },
};
