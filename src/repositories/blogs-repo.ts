// import { v4 as uuidv4 } from "uuid";
import { client } from "./db";
import { ObjectId } from "mongodb";

export type Blog = {
  name: string;
  description: string;
  websiteUrl: string;
};

const blogs = client.db("samurai").collection("blogs");

export const blogsRepository = {
  async create(blog: Blog) {
    const result = await blogs.insertOne(blog);
    return result.insertedId.toString();
  },
  async findAll() {
    return blogs.find().toArray();
  },

  async findById(id: string) {
    return blogs.findOne({ _id: new ObjectId(id) });
  },
  async deleteById(id: string) {
    const result = await blogs.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
  async updateById(id: string, blog: Blog) {
    const result = await blogs.replaceOne({ _id: new ObjectId(id) }, blog);
    return result.modifiedCount === 1;
  },
  async deleteAll() {
    //drop the blogs collection
    await blogs.drop();
  },
};
