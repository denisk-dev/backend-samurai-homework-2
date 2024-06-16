import express, { Request, Response } from "express";
import { postsRepository } from "../repositories/posts-repo";
import { basicAuthMiddleware } from "../middleware/auth/basic";
import { createUpdateBodyValidationMiddleware } from "../middleware/validation/validation-posts";
import { sendErrorsIfAnyMiddleware } from "../middleware/validation/validation-universal";
import { Post } from "../repositories/posts-repo";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await postsRepository.findAll();
  res.send(
    posts.map((post) => ({ ...post, id: post._id.toString(), _id: undefined }))
  );
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await postsRepository.findById(id);
  if (post) {
    res.status(200).json({ ...post, id: post._id.toString(), _id: undefined });
  } else {
    res.sendStatus(404);
  }
});

router.use(basicAuthMiddleware);

router.post(
  "/",
  createUpdateBodyValidationMiddleware,
  sendErrorsIfAnyMiddleware,
  async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId, blogName } = req.body;

    const post: Post = {
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    };
    const insertedId = await postsRepository.create(post);

    const createdPost = await postsRepository.findById(insertedId);

    if (!createdPost) return res.sendStatus(500);

    return res
      .status(201)
      .json({ ...createdPost, id: createdPost._id.toString(), _id: undefined });
  }
);

router.put(
  "/:id",
  createUpdateBodyValidationMiddleware,
  sendErrorsIfAnyMiddleware,
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { title, shortDescription, content, blogId, blogName } = req.body;

    const isUpdated = await postsRepository.updateById(id, {
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    });

    if (isUpdated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await postsRepository.findById(id);
  if (!post) {
    return res.sendStatus(404);
  }

  const isDeleted = await postsRepository.deleteById(id);

  if (isDeleted) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(500);
  }
});

export default router;
