import { GraphQLResponse } from "@apollo/server";
import { server } from "./graphql";

describe("Users", () => {
  it("should return a array of users", async () => {
    const response = await server.executeOperation({
      query: "{ allUsers { name } }",
    });
    console.log(response.body);
    expect(response.body).toHaveProperty("singleResult");
    expect(response.body.kind).toBe("single");
    // expect()

    // expect(response.body?.singleResult.errors).toBeUndefined();
  });
});
