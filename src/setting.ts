import express, { Request, Response } from "express";
import blogsRouter from "./routes/blogs-router";
import postsRouter from "./routes/posts-router";
import { blogsRepository } from "./repositories/blogs-repo";
import { postsRepository } from "./repositories/posts-repo";

export const app = express();

app.use(express.json());
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);

// app.use("/videos", videosRouter);
app.delete("/testing/all-data", async (req: Request, res: Response) => {
  await blogsRepository.deleteAll();
  await postsRepository.deleteAll();
  res.sendStatus(204);
});
