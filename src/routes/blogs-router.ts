import express, { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs-repo";
import { v4 as uuidv4 } from "uuid";
import { createUpdateBodyValidationMiddleware } from "../middleware/validation/validation-blogs";
import { sendErrorsIfAnyMiddleware } from "../middleware/validation/validation-universal";
import { basicAuthMiddleware } from "../middleware/auth/basic";

const router = express.Router();

// Read all blogs
router.get("/", (req: Request, res: Response) => {
  const blogs = blogsRepository.findAll();
  res.status(200).json(blogs);
});

// Read one blog
router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = blogsRepository.findById(id);
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.sendStatus(404);
  }
});

router.use(basicAuthMiddleware);

// Create blog
router.post(
  "/",
  createUpdateBodyValidationMiddleware,
  sendErrorsIfAnyMiddleware,
  (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    const id = uuidv4();

    const blog = {
      id,
      name,
      description,
      websiteUrl,
    };
    blogsRepository.create(blog);
    return res.status(201).json(blogsRepository.findById(id));
  }
);

// Update blog
router.put(
  "/:id",
  createUpdateBodyValidationMiddleware,
  sendErrorsIfAnyMiddleware,
  (req: Request, res: Response) => {
    const id = req.params.id;
    const { name, description, websiteUrl } = req.body;

    const updated = blogsRepository.updateById(id, {
      id,
      name,
      description,
      websiteUrl,
    });

    if (updated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

// Delete blog
router.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = blogsRepository.findById(id);
  if (blog) {
    blogsRepository.deleteById(id);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

export default router;
