const request = require("supertest");
const app = require("./app");
const { ObjectId, MongoClient } = require("mongodb")


describe("POST /addData", () => {
  it("should create a new user and return 200 status", async () => {
    const userData = { name: "John", age: 30, email: "john@example.com" };

    const response = await request(app)
      .post("/addData")
      .send(userData);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Data added successfully" });
  });
});




describe("PUT /updateBy/:id", () => {
    it("should update a document and return 200 status", async () => {
      const id = new ObjectId("64c89db369471ea4a3504fd7") // Replace with a valid ObjectId string
      const userData = { name: "Updated Name", age: 35, email: "updated@example.com" };

      // Make a mock PUT request to the /updateBy/:id endpoint with the user data
      const response = await request(app) // Wrap the app object with supertest()
        .put(`/updateBy/${id}`)
        .send(userData);

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Document updated successfully" });
    });

    it("should handle document not found and return 404 status", async () => {
      const id = new ObjectId("64c89d1b5b280cf6aa92aa98") // Replace with an invalid ObjectId string
      const userData = { name: "Updated Name", age: 35, email: "updated@example.com" };

      // Make a mock PUT request to the /updateBy/:id endpoint with the user data
      const response = await request(app) // Wrap the app object with supertest()
        .put(`/updateBy/${id}`)
        .send(userData);

      // Assert the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Document not found" });
    });

    it("should handle errors and return 500 status", async () => {
      const id = "validObjectId"; // Replace with a valid ObjectId string
      const userData = { name: "Updated Name", age: 35, email: "updated@example.com" };

      // Mock the collection updateOne method to throw an error
      jest.spyOn(MongoClient, "connect").mockRejectedValueOnce(new Error("Database error"));

      // Make a mock PUT request to the /updateBy/:id endpoint with the user data
      const response = await request(app) // Wrap the app object with supertest()
        .put(`/updateBy/${id}`)
        .send(userData);

      // Assert the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to update document" });
    });
  });



// jest.mock("mongodb");

describe("GET /viewData", () => {
    let mockClient;
    let mockCollection;

    beforeAll(() => {
      mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn(() => [
          { name: "John Doe", age: 30, email: "john.doe@example.com" },
          { name: "Jane Smith", age: 25, email: "jane.smith@example.com" },
        ]),
      };

      mockClient = {
        db: jest.fn().mockReturnThis(),
        collection: jest.fn().mockReturnValue(mockCollection),
      };

      // Mock the MongoClient.connect method to return the mockClient instance
      jest.spyOn(MongoClient, "connect").mockResolvedValue(mockClient);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should get data from MongoDB and return 200 status", async () => {
      const response = await request(app).get("/viewData");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { name: "John Doe", age: 30, email: "john.doe@example.com" },
        { name: "Jane Smith", age: 25, email: "jane.smith@example.com" },
      ]);
    });

    it("should handle errors and return 500 status", async () => {
      // Mock the collection find method to throw an error
      jest.spyOn(MongoClient, "connect").mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app).get("/viewData");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to get data" });
    });
  });
