import express from "express";
import { RefreshToken } from "../Controllers/RefreshToken.js";
const Router = express.Router(); // Note the parentheses here
// Define routes
Router.get("/", RefreshToken);
export default Router 
