//code don't work. i'm sorry(

// //const { describe, it, expect, jest } = require("@jest/globals");
// const loginController = require("..//..//controllers/index");
// const UserModel = require("..//..//models/index");

// describe("Login Controller", () => {
//   it("should log in a user", async () => {
//     const userMock = {
//       email: "test@example.com",
//       subscription: "pro",
//     };

//     const findOneSpy = jest.spyOn(UserModel, "findOne");
//     findOneSpy.mockResolvedValue(userMock);

//     const req = {
//       body: { email: "test@example.com", password: "testpassword" },
//     };

//     const res = {
//       status: jest.fn(() => res),
//       json: jest.fn(),
//     };

//     await loginController.logInUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       token: expect.any(String),
//       user: {
//         email: userMock.email,
//         subscription: userMock.subscription,
//       },
//     });
//   });

//   it("should handle login failure", async () => {
//     const findOneSpy = jest.spyOn(UserModel, "findOne");
//     findOneSpy.mockResolvedValue(null);

//     const req = {
//       body: { email: "nonexistent@example.com", password: "testpassword" },
//     };

//     const res = {
//       status: jest.fn(() => res),
//       json: jest.fn(),
//     };

//     await loginController.logInUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "Invalid email or password",
//     });
//   });
// });
