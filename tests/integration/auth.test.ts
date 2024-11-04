import request from "supertest";
import { app, server } from "../../src/index";
import { User } from "../../src/models/user";
import { Genre } from "../../src/models/genre";

describe("auth middleware", () => {
  let token: string;
  const exec = () => {
    return request(app)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ genre: "genre-auth" });
  };

  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 400 if invalid token is provided", async () => {
    token = "an invalid token";
    // if we use null or undefined, they will be converted to string

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    // if we use null or undefined, they will be converted to string

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 200 if token is valid", async () => {
    // token = "";
    // if we use null or undefined, they will be converted to string

    const res = await exec();

    expect(res.status).toBe(201);
  });
});
