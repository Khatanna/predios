import { Prisma } from "@prisma/client";
import request from "supertest";

const api = 'http://localhost:3001';

describe("Users", () => {
  it("should return a status 200 and array of users", async () => {
    const response = await request(api).post('/').send({
      query: '{ allUsers{ name }}'
    })

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.allUsers)).toBe(true)
  });

  it('should return props name of each user', async () => {
    const response = await request(api).post('/').send({
      query: `{ 
        allUsers { 
          name 
        }
      }`
    })

    expect(response.status).toBe(200);
    expect(response.body.data.allUsers.every((u: Prisma.UserCreateInput) => u.hasOwnProperty('name'))).toBe(true)
  })

  it('should return prop firstLastName of each user', async () => {
    const response = await request(api).post('/').send({
      query: `{
        allUsers {
          firstLastName
        }
      }`
    })

    expect(response.status).toBe(200);
    expect(response.body.data.allUsers.every((u: Prisma.UserCreateInput) => u.hasOwnProperty('firstLastName'))).toBe(true)
  })

  it('should return prop secondLastName of each user', async () => {
    const response = await request(api).post('/').send({
      query: `{
        allUsers {
          secondLastName
        }
      }`
    })

    expect(response.status).toBe(200);
    expect(response.body.data.allUsers.every((u: Prisma.UserCreateInput) => u.hasOwnProperty('secondLastName'))).toBe(true)
  })

  it('should return prop username of each user', async () => {
    const response = await request(api).post('/').send({
      query: `{
        allUsers {
          username
        }
      }`
    })

    expect(response.status).toBe(200);
    expect(response.body.data.allUsers.every((u: Prisma.UserCreateInput) => u.hasOwnProperty('username'))).toBe(true)
  })

  it('should return prop password of each user', async () => {
    const response = await request(api).post('/').send({
      query: `{
        allUsers {
          password
        }
      }`
    })

    expect(response.status).toBe(200);
    expect(response.body.data.allUsers.every((u: Prisma.UserCreateInput) => u.hasOwnProperty('password'))).toBe(true)
  })
});
