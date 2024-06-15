import express, { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs-repo";
import { createUpdateBodyValidationMiddleware } from "../middleware/validation/validation-blogs";
import { sendErrorsIfAnyMiddleware } from "../middleware/validation/validation-universal";
import { basicAuthMiddleware } from "../middleware/auth/basic";

const router = express.Router();

// Read all blogs
router.get("/", async (req: Request, res: Response) => {
  const blogs = await blogsRepository.findAll();
  res.status(200).json(blogs);
});

// Read one blog
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await blogsRepository.findById(id);
  if (blog) {
    res.status(200).json({ ...blog, id: blog._id, _id: undefined });
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
  async (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    const blog = {
      name,
      description,
      websiteUrl,
    };
    const createdId = await blogsRepository.create(blog);

    const createdBlog = await blogsRepository.findById(createdId);

    if (!createdBlog) return res.sendStatus(500);

    return res
      .status(201)
      .json({ ...createdBlog, id: createdBlog._id.toString(), _id: undefined });
  }
);

// Update blog
router.put(
  "/:id",
  createUpdateBodyValidationMiddleware,
  sendErrorsIfAnyMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name, description, websiteUrl } = req.body;

    const isUpdated = await blogsRepository.updateById(id, {
      name,
      description,
      websiteUrl,
    });

    if (isUpdated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

// Delete blog
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await blogsRepository.findById(id);
  if (!blog) {
    return res.sendStatus(404);
  }

  const isDeleted = await blogsRepository.deleteById(id);
  if (isDeleted) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(500);
  }
});

export default router;
