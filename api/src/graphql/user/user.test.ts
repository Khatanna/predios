import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import request from "supertest";

const api = "http://localhost:3001";
const prisma = new PrismaClient();

describe("Users", () => {
  afterAll(async () => {
    await prisma.user.deleteMany();
  })
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
    const data = {
      name: faker.person.firstName(),
      firstLastName: faker.person.lastName(),
      secondLastName: faker.person.lastName(),
      username: faker.internet.userName(),
      password: faker.internet.password()
    }

    const response = await request(api)
      .post("/")
      .send({
        query: `
        mutation ($data: ForCreateUser) {
          user: createUser(data: $data) {
            id
            name
            firstLastName
            secondLastName
            username
            password
            createdAt
            updatedAt
          }
        }
      `,
        variables: {
          data,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.user).not.toBeNull();
    expect(Object.keys(response.body.data.user)).toEqual([
      "id",
      "name",
      "firstLastName",
      "secondLastName",
      "username",
      "password",
      "createdAt",
      "updatedAt",
    ]);
    const user = await prisma.user.findUnique({
      where: {
        username: data.username
      }
    })

    expect(JSON.stringify(response.body.data.user)).toEqual(JSON.stringify(user))
  });

  it('should be find user if using only username', async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        firstLastName: faker.person.lastName(),
        secondLastName: faker.person.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      }
    })
    const response = await request(api).post('/').send({
      query: `
        query ($username: String) {
          user: getUserByUsername(username: $username) {
            id
            name
            firstLastName
            secondLastName
            username
            password
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        username: user.username
      }
    })

    expect(response.status).toBe(200);
    expect(Object.keys(response.body.data.user)).toEqual([
      "id",
      "name",
      "firstLastName",
      "secondLastName",
      "username",
      "password",
      "createdAt",
      "updatedAt"
    ]);
    expect(JSON.stringify(response.body.data.user)).toEqual(JSON.stringify(user))
  })

  it('should be update user if using only username', async () => {
    const { username } = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        firstLastName: faker.person.lastName(),
        secondLastName: faker.person.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      }
    })
    const response = await request(api).post('/').send({
      query: `
        mutation ($data: ForUpdateUserByUsername) {
          result: updateUserByUsername(data: $data) {
            updated
            user {
              name
              firstLastName
              secondLastName
              username
              password
              createdAt
              updatedAt
            }
          }
        }
      `,
      variables: {
        data: {
          username,
          data: {
            name: 'Charlie'
          }
        }
      }
    })
    expect(response.status).toBe(200);
    expect(response.body.data.result.updated).toBe(true)
    expect(Object.keys(response.body.data.result.user)).toEqual([
      "name",
      "firstLastName",
      "secondLastName",
      "username",
      "password",
      "createdAt",
      "updatedAt"
    ]);
    expect(response.body.data.result.user.name).toBe('Charlie')
  })

  it('should be update user if using only id', async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        firstLastName: faker.person.lastName(),
        secondLastName: faker.person.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      }
    })
    const response = await request(api).post('/').send({
      query: `
        mutation ($data: ForUpdateUserById) {
          result: updateUserById(data: $data) {
            updated
            user {
              name
              firstLastName
              secondLastName
              username
              password
              createdAt
              updatedAt
            }
          }
        }
      `,
      variables: {
        data: {
          id: user?.id,
          data: {
            name: 'charlie_chetado'
          }
        }
      }
    })

    expect(response.status).toBe(200);
    expect(response.body.data.result.updated).toBe(true)
    expect(Object.keys(response.body.data.result.user)).toEqual([
      "name",
      "firstLastName",
      "secondLastName",
      "username",
      "password",
      "createdAt",
      "updatedAt"
    ]);
    expect(response.body.data.result.user.name).toBe('charlie_chetado')
  })

  it('should be delete user if using only username', async () => {
    const { username } = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        firstLastName: faker.person.lastName(),
        secondLastName: faker.person.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      }
    })

    const response = await request(api).post('/').send({
      query: `
      mutation ($username: String) {
        result: deleteUserByUsername(username: $username) {
          deleted
          user {
            name
            firstLastName
            secondLastName
            username
            password
            createdAt
            updatedAt
          }
        }
      }
      `,
      variables: {
        username
      }
    })

    expect(response.status).toBe(200);
    expect(response.body.data.result.deleted).toBe(true);
    expect(Object.keys(response.body.data.result.user)).toEqual([
      "name",
      "firstLastName",
      "secondLastName",
      "username",
      "password",
      "createdAt",
      "updatedAt"
    ]);
  })

  it('should be delete user if using only id', async () => {
    const { id } = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        firstLastName: faker.person.lastName(),
        secondLastName: faker.person.lastName(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      }
    })

    const response = await request(api).post('/').send({
      query: `
      mutation ($id: ID) {
        result: deleteUserById(id: $id) {
          deleted
          user {
            name
            firstLastName
            secondLastName
            username
            password
            createdAt
            updatedAt
          }
        }
      }
      `,
      variables: {
        id
      }
    })

    expect(response.status).toBe(200);
    expect(response.body.data.result.deleted).toBe(true);
    expect(Object.keys(response.body.data.result.user)).toEqual([
      "name",
      "firstLastName",
      "secondLastName",
      "username",
      "password",
      "createdAt",
      "updatedAt"
    ]);
  });
});
