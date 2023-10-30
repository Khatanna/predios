import { expressMiddleware } from "@apollo/server/express4";
import request from "supertest";
import { graphqlContext } from "../../utilities";
import { app, server } from "../index";

describe("Type User:", () => {
  it("Debe iniciar sesión y retornar el accessToken", async () => {
    await server.start();
    app.use("/", expressMiddleware(server, { context: graphqlContext }));
    const response = await request(app)
      .post("/")
      .set("operation", "login")
      .send({
        query: `mutation Login($username: String, $password: String) {
      login(username: $username, password: $password) {
        accessToken
      }
    }`,
        variables: {
          username: "carlos.chambi",
          password: "Inra12345",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.login).toBeDefined();
    expect(typeof response.body.data.login.accessToken).toBe("string");
  });
});
