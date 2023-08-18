import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import request from "supertest";

const api = "http://localhost:3001";
const prisma = new PrismaClient();

xdescribe("Province", () => {
  afterAll(async () => {
    await prisma.user.deleteMany();
  })
  it("should return a status 200 and array of users", async () => {
    const response = await request(api).post("/").send({
      query: "{ provinces: allProvinces{ name }}",
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.provincs)).toBe(true);
  });

  it("should return props name of each province", async () => {
    const response = await request(api)
      .post("/")
      .send({
        query: `{ 
        provinces: allProvinces { 
          name 
        }
      }`,
      });

    expect(response.status).toBe(200);
    expect(
      response.body.data.provinces.every((u: Prisma.ProvinceCreateInput) =>
        u.hasOwnProperty("name")
      )
    ).toBe(true);
  });

  it("shuld be create province and return province", async () => {
    const data = {
      name: faker.person.firstName()
    }

    const response = await request(api)
      .post("/")
      .send({
        query: `
        mutation ($data: ForCreateProvince) {
          province: createProvince(data: $data) {
            id
            name
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
    expect(response.body.data.province).not.toBeNull();
    expect(Object.keys(response.body.data.province)).toEqual([
      "id",
      "name",
      "createdAt",
      "updatedAt",
    ]);
    const province = await prisma.province.findUnique({
      where: {
        name: data.name
      }
    })

    expect(JSON.stringify(response.body.data.province)).toEqual(JSON.stringify(province))
  });

  it('should be find province if using only name', async () => {
    const province = await prisma.province.create({
      data: {
        name: faker.location.city()
      }
    })
    const response = await request(api).post('/').send({
      query: `
        query ($name: String) {
          province: getProvinceByName(name: $name) {
            id
            name
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        name: province.name
      }
    })

    expect(response.status).toBe(200);
    expect(Object.keys(response.body.data.province)).toEqual([
      "id",
      "name",
      "createdAt",
      "updatedAt"
    ]);
    expect(JSON.stringify(response.body.data.province)).toEqual(JSON.stringify(province))
  })

  it('should be update user if using only id', async () => {
    const { name } = await prisma.province.create({
      data: {
        name: faker.location.city(),
      }
    })

    const newName = faker.location.city();
    const response = await request(api).post('/').send({
      query: `
        mutation ($data: ForUpdateUserByUsername) {
          result: updateUserByUsername(data: $data) {
            updated
            user {
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
        }
      `,
      variables: {
        data: {
          name,
          data: {
            name: newName
          }
        }
      }
    })
    expect(response.status).toBe(200);
    expect(response.body.data.result.updated).toBe(true)
    expect(Object.keys(response.body.data.result.province)).toEqual([
      "id",
      "name",
      "createdAt",
      "updatedAt"
    ]);
    expect(response.body.data.result.province.name).toBe(newName)
  })

  it('should be update pprovince if using only id', async () => {
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
