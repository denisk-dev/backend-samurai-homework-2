import request from "supertest";
import { app } from "../../src/setting";
import { blogsTestManager } from "../utils/blogs-manager";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const mongoURI = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/samurai`;

//MAKE SURE TESTS ARE ISOLATED

describe("Blogs", () => {
  const client = new MongoClient(mongoURI);

  beforeEach(() => {
    //clear all data before running tests
    return request(app).delete("/testing/all-data");
  });

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
  });

  //POST /blogs 201
  it("should create a new blog and return 201 status", async () => {
    const data = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const response = await blogsTestManager.createBlog(data, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    expect(response.body.name).toBe(data.name);
    expect(response.body.description).toBe(data.description);
    expect(response.body.websiteUrl).toBe(data.websiteUrl);

    expect(response.body.createdAt).toBeDefined();
    expect(response.body.isMembership).toBe(false);

    // now test that the blog was created
    const responseGet = await request(app).get(`/blogs/${response.body.id}`);
    expect(responseGet.body).toEqual(response.body);
  });

  //POST /blogs 401
  it("should return 401 status for unauthorized request", async () => {
    const newBlog = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    await blogsTestManager.createBlog(newBlog, {
      expectedStatusCode: 401,
    });
    // now test that the blog was not created
    const responseGet = await request(app).get("/blogs");
    expect(responseGet.body).not.toContainEqual(
      expect.objectContaining(newBlog)
    );
  });

  //POST /blogs 400
  it("should return 400 status for incorrect body", async () => {
    const incorrectBlog = {
      websiteUrl: "llll",
    };

    const response = await blogsTestManager.createBlog(incorrectBlog, {
      expectedStatusCode: 400,
      isAuthorized: true,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      errorsMessages: [
        { message: "Website URL must be a valid URL", field: "websiteUrl" },
        { message: "Name is required", field: "name" },
        { message: "Description is required", field: "description" },
      ],
    });
    //now test that the blog was not created
    const responseGet = await request(app).get("/blogs");
    expect(responseGet.body).not.toContainEqual(
      expect.objectContaining(incorrectBlog)
    );
  });

  //PUT /blogs/:id 204
  it("should return 204 for successful update", async () => {
    const blog = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const response = await blogsTestManager.createBlog(blog, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const updatedBlog = {
      name: "updated",
      description: "Description 1 updated",
      websiteUrl: "https://www.update-blog1.com",
    };

    const responseUpdate = await blogsTestManager.updateBlog(
      updatedBlog,
      response.body.id,
      {
        expectedStatusCode: 204,
        isAuthorized: true,
      }
    );

    expect(responseUpdate.statusCode).toBe(204);

    // now test that the blog was updated
    const responseGet = await request(app).get(`/blogs/${response.body.id}`);
    expect(responseGet.body).toEqual(
      expect.objectContaining({
        ...updatedBlog,
        id: response.body.id,
        isMembership: false,
        createdAt: expect.any(String),
      })
    );
  });

  //PUT /blogs/:id 404
  it("should return 404 for unsuccessful update", async () => {
    const blog = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const response = await blogsTestManager.createBlog(blog, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const updatedBlog = {
      name: "updated",
      description: "Description 1 updated",
      websiteUrl: "https://www.update-blog1.com",
    };

    const responseUpdate = await blogsTestManager.updateBlog(
      updatedBlog,
      "123",
      {
        expectedStatusCode: 404,
        isAuthorized: true,
      }
    );

    expect(responseUpdate.statusCode).toBe(404);

    // now test that the blog was not updated
    const responseGet = await request(app).get(`/blogs/${response.body.id}`);
    expect(responseGet.body).toEqual(response.body);
  });

  //PUT /blogs/:id 401
  it("should return 401 for unsuccessful update", async () => {
    const blog = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const response = await blogsTestManager.createBlog(blog, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const updatedBlog = {
      name: "updated",
      description: "Description 1 updated",
      websiteUrl: "https://www.update-blog1.com",
    };

    const responseUpdate = await blogsTestManager.updateBlog(
      updatedBlog,
      response.body.id,
      {
        expectedStatusCode: 401,
      }
    );

    expect(responseUpdate.statusCode).toBe(401);

    // now test that the blog was not updated
    const responseGet = await request(app).get(`/blogs/${response.body.id}`);
    expect(responseGet.body).toEqual(response.body);
  });

  //PUT /blogs/:id 400
  it("should return 400 for incorrect body", async () => {
    const blog = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const response = await blogsTestManager.createBlog(blog, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const updatedBlog = {
      name: "sdfgsdfgdfsgsdfgsdfgsdfg",
      websiteUrl: "sss",
    };

    const responseUpdate = await blogsTestManager.updateBlog(
      updatedBlog,
      response.body.id,
      {
        expectedStatusCode: 400,
        isAuthorized: true,
      }
    );

    expect(responseUpdate.statusCode).toBe(400);
    expect(responseUpdate.body).toEqual({
      errorsMessages: [
        { message: "Website URL must be a valid URL", field: "websiteUrl" },
        { message: "Name must not exceed 15 characters", field: "name" },
        { message: "Description is required", field: "description" },
      ],
    });

    // now test that the blog was not updated
    const responseGet = await request(app).get(`/blogs/${response.body.id}`);
    expect(responseGet.body).toEqual(response.body);
  });

  //Delete /blogs/:id 204
  it("should return 204 for successful delete", async () => {
    const blog = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const response = await blogsTestManager.createBlog(blog, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const responseDelete = await request(app)
      .delete(`/blogs/${response.body.id}`)
      .set("Authorization", "Basic YWRtaW46cXdlcnR5");
    expect(responseDelete.statusCode).toBe(204);

    // now test that the blog was deleted
    const responseGet = await request(app).get(`/blogs/${response.body.id}`);
    expect(responseGet.statusCode).toBe(404);
  });
  //Delete /blogs/:id 404
  it("should return 404 for unsuccessful delete", async () => {
    const blog = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const response = await blogsTestManager.createBlog(blog, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const responseDelete = await request(app)
      .delete(`/blogs/123`)
      .set("Authorization", "Basic YWRtaW46cXdlcnR5");
    expect(responseDelete.statusCode).toBe(404);

    // now test that the blog was not deleted
    const responseGet = await request(app).get(`/blogs/${response.body.id}`);
    expect(responseGet.body).toEqual(response.body);
  });
  //Delete /blogs/:id 401
  it("should return 401 for unauthorized delete", async () => {
    const blog = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const response = await blogsTestManager.createBlog(blog, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const responseDeleteUnauthorized = await request(app).delete(
      `/blogs/${response.body.id}`
    );

    expect(responseDeleteUnauthorized.statusCode).toBe(401);

    // now test that the blog was not deleted
    const responseGet = await request(app).get(`/blogs/${response.body.id}`);
    expect(responseGet.body).toEqual(response.body);
  });

  //get blogs 200
  it("should return 200 for successful get all blogs", async () => {
    const blog1 = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const blog2 = {
      name: "Blog 2",
      description: "Description 2",
      websiteUrl: "https://www.blog2.com",
    };

    await blogsTestManager.createBlog(blog1, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    await blogsTestManager.createBlog(blog2, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const response = await request(app).get("/blogs");
    expect(response.body).toContainEqual(expect.objectContaining(blog1));
    expect(response.body).toContainEqual(expect.objectContaining(blog2));
  });
});
