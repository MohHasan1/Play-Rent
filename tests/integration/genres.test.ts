// import { Server, IncomingMessage, ServerResponse } from "http";
import request from "supertest";
import { Genre } from "../../src/models/genre";
import { app, server } from "../../src/index";
import { User } from "../../src/models/user";

describe("/api/genres", () => {
  afterEach(async () => {
    // close the server
    server.close();
    // remove all the genre docs:
    await Genre.deleteMany({});
  });

  


  describe("GET /", () => {
    it("should return all genres", async () => {
      // populate the genre collection
      await Genre.collection.insertMany([
        { genre: "genre1" },
        { genre: "genre2" },
      ]);

      // send an http res - like browser or or how u use postman
      const res = await request(app).get("/api/genres");

      // assert (verify)
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g: any) => g.genre === "genre1")).toBeTruthy();
      expect(res.body.some((g: any) => g.genre === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      // Populate with one genre
      const genre = new Genre({ genre: "genre1" });
      await genre.save();

      // call endPoint:
      const res = await request(app).get("/api/genres/" + genre._id);
      // console.log("/api/genres/"+genre._id); // changes object to string

      // assertion
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(undefined);
      expect(res.body).toHaveProperty("genre", genre.genre);
    });

    it("should return 404 if invalid ID is passed", async () => {
      // Populate with one genre - we don't need any data to test this

      // call end point: - this does not make it to teh db so we will have to write another code
      const res = await request(app).get("/api/genres/" + "1");

      // assertion
      expect(res.status).toBe(404);
      expect(res.body.length).toBe(undefined);
    });
  });

  describe("POST /", () => {
    let token: string;
    let genre = { genre: "genre1" };

    const exec = async () => {
      return await request(app)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send(genre);
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it("should return a 401 if client is not login", async () => {
      token = "";
      const res = await exec();

      //assertion
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      // Generate token
      // const token = new User().generateAuthToken();
      // Send request
      // const res = await request(app)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send(genre);

      // Define invalid genre
      genre.genre = "12"; // Length < 3

      // Send request
      const res = await exec();

      // Check response status
      expect(res.status).toBe(400);
    });

    it("should return 400 in genre is more than 20 characters", async () => {
      // token
      // const token = new User().generateAuthToken();

      genre.genre = new Array(22).join("g");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre in mongodb if its valid", async () => {
      // const genre = { genre: "genre1" };
      // const res = await request(app)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send(genre);

      genre = { genre: "genre1" };

      const res = await exec();
      const genreFromDB = await Genre.findOne(genre);
      // const genreFromDB = (await Genre.find({ genre: genreName }))[0];

      expect(res.status).toBe(201);
      expect(genreFromDB).not.toBeNull();
      expect(genreFromDB).toHaveProperty("genre", "genre1");
    });

    it("should return the genre its valid", async () => {
      // const token = new User().generateAuthToken();
      // const genre = { genre: "genre1" };
      // const res = await request(app)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send(genre);

      genre = { genre: "genre1" };

      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("genre", "genre1");
      expect(res.body).toHaveProperty("_id");
    });
  });
});
