import request from "supertest";
import { app } from "../../src/index";

//LIST OF TODOS
//TODO tests need to be isolated from each other
//create that testManager to make the code more readbable and maintainable(maybe)

describe("Blogs", () => {
  beforeAll(() => {
    //clear all data before running tests
    return request(app).delete("/testing/all-data");
  });

  afterAll(() => {
    //clear all data after running tests
    return request(app).delete("/testing/all-data");
  });
  //POST /blogs
  it("should create a new blog and return 201 status", async () => {
    const newBlog = {
      name: "Test Blog 1",
      description: "This is a test blog 1",
      websiteUrl: "https://test1.com",
    };
    const response = await request(app)
      .post("/blogs")
      .set("Authorization", "Basic YWRtaW46cXdlcnR5")
      .send(newBlog);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newBlog.name);
    expect(response.body.description).toBe(newBlog.description);
    expect(response.body.websiteUrl).toBe(newBlog.websiteUrl);
  });
  //POST /blogs
  it("should return 401 status for unauthorized request", async () => {
    const newBlog = {
      name: "Test Blog 2",
      description: "This is a test blog 2",
      websiteUrl: "https://test2.com",
    };

    const response = await request(app).post("/blogs").send(newBlog);

    expect(response.statusCode).toBe(401);

    //now test that the blog was not created
    const responseGet = await request(app).get("/blogs");
    expect(responseGet.body).not.toContainEqual(
      expect.objectContaining(newBlog)
    );
  });
  //POST /blogs
  it("should return 400 status for incorrect body", async () => {
    const incorrectBlog = {
      websiteUrl: "llll",
    };

    const response = await request(app)
      .post("/blogs")
      .set("Authorization", "Basic YWRtaW46cXdlcnR5")
      .send(incorrectBlog);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      errorMessages: [
        { message: "Name is required", field: "name" },
        { message: "Description is required", field: "description" },
        { message: "Website URL must be a valid URL", field: "websiteUrl" },
      ],
    });
    //now test that the blog was not created
    const responseGet = await request(app).get("/blogs");
    expect(responseGet.body).not.toContainEqual(
      expect.objectContaining(incorrectBlog)
    );
  });
});
