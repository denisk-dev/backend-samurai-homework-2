import request from "supertest";
import { app } from "../../src/index";
import { Blog } from "../../src/repositories/blogs-repo";

export const blogsTestManager = {
  async createBlog(
    data: {
      name?: Blog["name"];
      description?: Blog["description"];
      websiteUrl?: Blog["websiteUrl"];
    },
    {
      expectedStatusCode,
      isAuthorized = false,
    }: { expectedStatusCode: number; isAuthorized?: boolean }
  ) {
    const requestObject = request(app).post("/blogs");

    if (isAuthorized) {
      requestObject.set("Authorization", "Basic YWRtaW46cXdlcnR5");
    }

    const response = await requestObject.send(data);

    expect(response.statusCode).toBe(expectedStatusCode);

    if (response.statusCode === 200 || response.statusCode === 201) {
      expect(response.body.name).toBe(data.name);
      expect(response.body.description).toBe(data.description);
      expect(response.body.websiteUrl).toBe(data.websiteUrl);
    }

    return response;
  },
  async updateBlog(
    data: {
      name?: Blog["name"];
      description?: Blog["description"];
      websiteUrl?: Blog["websiteUrl"];
    },
    id: string,
    {
      expectedStatusCode,
      isAuthorized = false,
    }: { expectedStatusCode: number; isAuthorized?: boolean }
  ) {
    const requestObject = request(app).put(`/blogs/${id}`);

    if (isAuthorized) {
      requestObject.set("Authorization", "Basic YWRtaW46cXdlcnR5");
    }

    const response = await requestObject.send(data);

    expect(response.statusCode).toBe(expectedStatusCode);

    return response;
  },
};
