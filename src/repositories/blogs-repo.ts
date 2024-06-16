// import { v4 as uuidv4 } from "uuid";
import { client } from "./db";
import { ObjectId } from "mongodb";
import { blogs } from "./db";

export type Blog = {
  name: string;
  description: string;
  websiteUrl: string;
  //TODO this won't be optional in the future
  isMembership?: boolean;
};

export const blogsRepository = {
  async create(blog: Blog) {
    const result = await blogs.insertOne({
      ...blog,
      isMembership: false,
      createdAt: new Date(),
    });
    return result.insertedId.toString();
  },
  async findAll() {
    return blogs.find().toArray();
  },

  async findById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return blogs.findOne({ _id: new ObjectId(id) });
  },
  async deleteById(id: string) {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const result = await blogs.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
  async updateById(id: string, blog: Blog) {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const result = await blogs.updateOne(
      { _id: new ObjectId(id) },
      { $set: blog }
    );
    return result.matchedCount === 1;
  },
  async deleteAll() {
    //drop the blogs collection
    await blogs.drop();
  },
};
