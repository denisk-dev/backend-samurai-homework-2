import express, { Request, Response } from "express";
import { postsRepository } from "../repositories/posts-repo";
import { basicAuthMiddleware } from "../middleware/auth/basic";
import { createUpdateBodyValidationMiddleware } from "../middleware/validation/validation-posts";
import { sendErrorsIfAnyMiddleware } from "../middleware/validation/validation-universal";
import { Post } from "../repositories/posts-repo";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.get("/", (req, res) => {
  res.send(postsRepository.findAll());
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const post = postsRepository.findById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.sendStatus(404);
  }
});

router.use(basicAuthMiddleware);

router.post(
  "/",
  createUpdateBodyValidationMiddleware,
  sendErrorsIfAnyMiddleware,
  (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId, blogName } = req.body;

    const id = uuidv4();

    const post: Post = {
      id,
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    };
    postsRepository.create(post);
    return res.status(201).json(postsRepository.findById(id));
  }
);

router.put(
  "/:id",
  createUpdateBodyValidationMiddleware,
  sendErrorsIfAnyMiddleware,
  (req: Request, res: Response) => {
    const id: string = req.params.id;
    const { title, shortDescription, content, blogId, blogName } = req.body;

    const updated = postsRepository.updateById(id, {
      id,
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    });

    if (updated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const deleted = postsRepository.deleteById(id);
  if (deleted) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

export default router;
