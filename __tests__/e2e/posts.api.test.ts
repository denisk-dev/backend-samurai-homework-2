import request from "supertest";
import { app } from "../../src/index";
import { postsTestManager } from "../utils/posts-manager";
import { blogsTestManager } from "../utils/blogs-manager";

describe("Posts", () => {
  beforeEach(() => {
    //clear all data before running tests
    return request(app).delete("/testing/all-data");
  });
  //POST /posts 201
  it("should create a new post and return 201 status", async () => {
    //create a blog first
    const blogData = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const blogResponse = await blogsTestManager.createBlog(blogData, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const data = {
      title: "Post 1",
      shortDescription: "Description 1",
      content: "Content 1",
      blogId: blogResponse.body.id,
    };

    const response = await postsTestManager.createPost(data, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    expect(response.body.title).toBe(data.title);
    expect(response.body.shortDescription).toBe(data.shortDescription);
    expect(response.body.content).toBe(data.content);
    expect(response.body.blogId).toBe(data.blogId);
    expect(response.body.blogName).toBe(blogData.name);
  });

  //POST /posts 401
  it("should return 401 status for unauthorized request", async () => {
    const newPost = {
      title: "Post 1",
      shortDescription: "Description 1",
      content: "Content 1",
      blogId: "123",
    };

    await postsTestManager.createPost(newPost, {
      expectedStatusCode: 401,
    });
    // now test that the post was not created
    const responseGet = await request(app).get("/posts");
    expect(responseGet.body).not.toContainEqual(
      expect.objectContaining(newPost)
    );
  });

  //POST /posts 400
  it("should return 400 status for incorrect body", async () => {
    const data = {
      title: "Post 1sdgfsdfgsdfgfsdgsdfgsfdgfdsg",
      blogId: "111",
    };

    const response = await postsTestManager.createPost(data, {
      expectedStatusCode: 400,
      isAuthorized: true,
    });

    expect(response.body).toEqual({
      errorsMessages: [
        { message: "Title must not exceed 30 characters", field: "title" },
        { message: "Short description is required", field: "shortDescription" },
        { message: "Content is required", field: "content" },
        {
          field: "blogId",
          message: "Invalid value",
        },
      ],
    });
  });

  //DELETE /posts/:id 200
  it("should delete a post and return 200 status", async () => {
    //create a blog first
    const blogData = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const blogResponse = await blogsTestManager.createBlog(blogData, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const data = {
      title: "Post 1",
      shortDescription: "Description 1",
      content: "Content 1",
      blogId: blogResponse.body.id,
    };

    const postResponse = await postsTestManager.createPost(data, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const response = await request(app)
      .delete(`/posts/${postResponse.body.id}`)
      .set("Authorization", "Basic YWRtaW46cXdlcnR5");

    expect(response.statusCode).toBe(204);

    // now test that the post was deleted
    const responseGet = await request(app).get(
      `/posts/${postResponse.body.id}`
    );
    expect(responseGet.statusCode).toBe(404);
  });
  //DELETE /posts/:id 404
  it("should return 404 for unsuccessful delete", async () => {
    const response = await request(app)
      .delete(`/posts/123`)
      .set("Authorization", "Basic YWRtaW46cXdlcnR5");
    expect(response.statusCode).toBe(404);
  });
  //DELETE /posts/:id 401
  it("should return 401 for unauthorized delete", async () => {
    //create a blog first
    const blogData = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const blogResponse = await blogsTestManager.createBlog(blogData, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const data = {
      title: "Post 1",
      shortDescription: "Description 1",
      content: "Content 1",
      blogId: blogResponse.body.id,
    };

    const postResponse = await postsTestManager.createPost(data, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const response = await request(app).delete(
      `/posts/${postResponse.body.id}`
    );

    expect(response.statusCode).toBe(401);

    // now test that the post was deleted
    const responseGet = await request(app).get(
      `/posts/${postResponse.body.id}`
    );

    expect(responseGet.body).toEqual(postResponse.body);
  });
  //PUT /posts/:id 204
  it("should update a post and return 204 status", async () => {
    //create a blog first
    const blogData = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const blogResponse = await blogsTestManager.createBlog(blogData, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const data = {
      title: "Post 1",
      shortDescription: "Description 1",
      content: "Content 1",
      blogId: blogResponse.body.id,
    };

    const postResponse = await postsTestManager.createPost(data, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const updatedData = {
      title: "Post 1 updated",
      shortDescription: "Description 1 updated",
      content: "Content 1 updated",
      blogId: blogResponse.body.id,
    };

    const response = await postsTestManager.updatePost(
      updatedData,
      postResponse.body.id,
      {
        expectedStatusCode: 204,
        isAuthorized: true,
      }
    );

    expect(response.statusCode).toBe(204);

    // now test that the post was updated
    const responseGet = await request(app).get(
      `/posts/${postResponse.body.id}`
    );

    expect(responseGet.body.title).toBe(updatedData.title);
    expect(responseGet.body.shortDescription).toBe(
      updatedData.shortDescription
    );
    expect(responseGet.body.content).toBe(updatedData.content);
    expect(responseGet.body.blogId).toBe(updatedData.blogId);
    expect(responseGet.body.blogName).toBe(blogData.name);
  });

  //PUT /posts/:id 404
  it("should return 404 for unsuccessful update", async () => {
    //create a blog first
    const blogData = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const blogResponse = await blogsTestManager.createBlog(blogData, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const data = {
      title: "Post 1",
      shortDescription: "Description 1",
      content: "Content 1",
      blogId: blogResponse.body.id,
    };

    const postResponse = await postsTestManager.createPost(data, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    //update the post with an invalid id
    const updatedData = {
      title: "Post 1 updated",
      shortDescription: "Description 1 updated",
      content: "Content 1 updated",
      blogId: blogResponse.body.id,
    };

    await postsTestManager.updatePost(updatedData, "123", {
      expectedStatusCode: 404,
      isAuthorized: true,
    });
  });

  //PUT /posts/:id 401
  it("should return 401 for unauthorized update", async () => {
    //create a blog first
    const blogData = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const blogResponse = await blogsTestManager.createBlog(blogData, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const data = {
      title: "Post 1",
      shortDescription: "Description 1",
      content: "Content 1",
      blogId: blogResponse.body.id,
    };

    const postResponse = await postsTestManager.createPost(data, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const updatedData = {
      title: "Post 1 updated",
      shortDescription: "Description 1 updated",
      content: "Content 1 updated",
      blogId: blogResponse.body.id,
    };

    const response = await postsTestManager.updatePost(
      updatedData,
      postResponse.body.id,
      {
        expectedStatusCode: 401,
      }
    );

    expect(response.statusCode).toBe(401);

    // now test that the post was not updated
    const responseGet = await request(app).get(
      `/posts/${postResponse.body.id}`
    );

    expect(responseGet.body).toEqual(postResponse.body);
  });

  it("should return 3 posts", async () => {
    const blogData = {
      name: "Blog 1",
      description: "Description 1",
      websiteUrl: "https://www.blog1.com",
    };

    const blogResponse = await blogsTestManager.createBlog(blogData, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const data1 = {
      title: "Post 1",
      shortDescription: "Description 1",
      content: "Content 1",
      blogId: blogResponse.body.id,
    };

    const data2 = {
      title: "Post 2",
      shortDescription: "Description 2",
      content: "Content 2",
      blogId: blogResponse.body.id,
    };

    const data3 = {
      title: "Post 3",
      shortDescription: "Description 3",
      content: "Content 3",
      blogId: blogResponse.body.id,
    };

    await postsTestManager.createPost(data1, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    await postsTestManager.createPost(data2, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    await postsTestManager.createPost(data3, {
      expectedStatusCode: 201,
      isAuthorized: true,
    });

    const response = await request(app).get("/posts");

    expect(response.body.length).toBe(3);
  });
});
