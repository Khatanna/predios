import { Prisma } from "@prisma/client";
import request from "supertest";

const api = "http://localhost:3001";

describe("Users", () => {
  it("should return a status 200 and array of users", async () => {
    const response = await request(api).post("/").send({
      query: "{ allUsers{ name }}",
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.allUsers)).toBe(true);
  });

  it("should return props name of each user", async () => {
    const response = await request(api)
      .post("/")
      .send({
        query: `{ 
        allUsers { 
          name 
        }
      }`,
      });

    expect(response.status).toBe(200);
    expect(
      response.body.data.allUsers.every((u: Prisma.UserCreateInput) =>
        u.hasOwnProperty("name")
      )
    ).toBe(true);
  });

  it("should return prop firstLastName of each user", async () => {
    const response = await request(api)
      .post("/")
      .send({
        query: `{
        allUsers {
          firstLastName
        }
      }`,
      });

    expect(response.status).toBe(200);
    expect(
      response.body.data.allUsers.every((u: Prisma.UserCreateInput) =>
        u.hasOwnProperty("firstLastName")
      )
    ).toBe(true);
  });

  it("should return prop secondLastName of each user", async () => {
    const response = await request(api)
      .post("/")
      .send({
        query: `{
        allUsers {
          secondLastName
        }
      }`,
      });

    expect(response.status).toBe(200);
    expect(
      response.body.data.allUsers.every((u: Prisma.UserCreateInput) =>
        u.hasOwnProperty("secondLastName")
      )
    ).toBe(true);
  });

  it("should return prop username of each user", async () => {
    const response = await request(api)
      .post("/")
      .send({
        query: `{
        allUsers {
          username
        }
      }`,
      });

    expect(response.status).toBe(200);
    expect(
      response.body.data.allUsers.every((u: Prisma.UserCreateInput) =>
        u.hasOwnProperty("username")
      )
    ).toBe(true);
  });

  it("should return prop password of each user", async () => {
    const response = await request(api)
      .post("/")
      .send({
        query: `{
        allUsers {
          password
        }
      }`,
      });

    expect(response.status).toBe(200);
    expect(
      response.body.data.allUsers.every((u: Prisma.UserCreateInput) =>
        u.hasOwnProperty("password")
      )
    ).toBe(true);
  });

  it("shuld be create user and return user", async () => {
    const mockUser: Prisma.UserCreateInput = {
      name: "Carlos",
      firstLastName: "Chambi",
      secondLastName: "Valencia",
      username: "khatanna",
      password: "71264652",
    };

    const response = await request(api)
      .post("/")
      .send({
        query: `
        mutation ($data: ForCreateUser){
          user: createUser(data: $data) {
            name
            firstLastName
            secondLastName
            username
            password
          }
        }
      `,
        variables: {
          data: mockUser,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.user).not.toBeNull();
    expect(Object.keys(response.body.data.user)).toEqual([
      "name",
      "firstLastName",
      "secondLastName",
      "username",
      "password",
    ]);
  });
});
