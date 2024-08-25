import express from 'express'
const app = express()
import cors from 'cors'
import dotenv from 'dotenv'
import users from './Routes/users.js'
import { AuthLogin } from './Controllers/authLogin.js'
import RefreshToken from './Routes/RefreshToken.js'
import cookieParser from 'cookie-parser'
import { Logout } from './Controllers/Logout.js'
dotenv.config()
app.use(cors())
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.post("/login", AuthLogin);
app.post("/logout", Logout);
app.use("/refresh", RefreshToken);
app.use('/user',users);
const Port = process.env.port || 1000
app.listen(Port, () => {
    console.log(`App listening in Port ${Port}`)
});
