import userDBs from '..//Model/users.json' assert {type: "json"}
import brcypt from 'bcrypt'
import fs from 'fs'
import { fileURLToPath } from 'url'
var promises = fs.promises
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UserState = {
    users: userDBs,
    setUser: function (data){this.users = data}
}
export const getUsers = (req, res) => {
    res.json({ users: userDBs });
}
export const CreateUser = async (req, res) => {
    const { user, pwd } = req.body;
    // check user , pwd is empty
    if (!user, !pwd) res.sendStatus(400).json({ "message": "user và mật khẩu không bỏ trống" })
    // check user exist
    const FoundUser = UserState.users.find(user => user.user === user)
    if (FoundUser) return res.sendStatus(400).json({ message: "Người dùng đã có trên hệ thống" });
    try {
        const hashPwd = await brcypt.hash(pwd, 10)
        const newuser = {user,roles: {user: 2001}, password: hashPwd}
        UserState.setUser([...UserState.users, newuser]);
       await promises.writeFile(
          path.join(__dirname, "..", "Model", "users.json"),
          JSON.stringify(UserState.users)
        );
        res.sendStatus(201).json({"message":"Đăng kí thành công "})
    }
    catch (err){
    res.status(500).json({"message": "Lỗi máy chủ"})
    }
};
export const UpdateUser = (req, res) => {};
export const DeleteUser = (req, res) => {};