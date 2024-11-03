// import { Server, IncomingMessage, ServerResponse } from "http";
import request from "supertest";
import { Genre } from "../../src/models/genre";
import { app, server } from "../../src/index";

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
    

  })
});
