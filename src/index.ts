import express, { Request, Response } from "express";
import blogsRouter from "./routes/blogs-router";
import postsRouter from "./routes/posts-router";
import { blogsRepository } from "./repositories/blogs-repo";
import { postsRepository } from "./repositories/posts-repo";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);

// app.use("/videos", videosRouter);
app.delete("/testing/all-data", (req: Request, res: Response) => {
  blogsRepository.deleteAll();
  postsRepository.deleteAll();
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
