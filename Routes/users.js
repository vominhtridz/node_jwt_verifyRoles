import express from "express";
const Router = express.Router(); // Note the parentheses here
import {
  getUsers,
  CreateUser,
  UpdateUser,
  DeleteUser,
} from "../Controllers/UserControllers.js";
import { VerifyJWT } from "../Middleware/verifyJwt.js";
import { VerifyRoles } from "../Middleware/verifyRoles.js";
import {List_roles} from '..//config/list_roles.js'
// Define routes
Router.route("/")
  .get(VerifyJWT, VerifyRoles(List_roles.Admin, List_roles.User), getUsers) // Secure this route with JWT
  .post(CreateUser); // Create a new user
// Routes for updating and deleting would generally be on a specific user ID
Router.route("/:id")
  .put(VerifyJWT, UpdateUser) // Secure this route with JWT
  .delete(VerifyJWT, DeleteUser); // Secure this route with JWT

export default Router;
