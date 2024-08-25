import jwt from 'jsonwebtoken'
import users from '../Model/users.json' assert {type: "json"}
import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'
const promises = fs.promises
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const userDB = {
    users: users,
    setUser:function(data){this.users = data}
}
export const AuthLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)return res.status(400).json({ message: "Email và Mật Khẩu không bỏ trống !" });
  // Find user
  const FoundUser = userDB.users.find(u => u.user === user);
  if (!FoundUser)return res.status(400).json({ message: "không có tài khoản này" });

  try {
    const isCorrect = await bcrypt.compare(pwd, FoundUser.password);
    if (isCorrect) {
      const roles = Object.values(FoundUser.roles)
      const accessToken = jwt.sign(
        { userInfor: { user: FoundUser.user, roles: roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { user: FoundUser.user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const otherUser = userDB.users.filter(u => u.user !== user);
      const currentUser = { ...FoundUser, refreshToken };
      userDB.setUser([...otherUser, currentUser]);
      await promises.writeFile(path.join(__dirname, '..', 'Model', 'users.json'), JSON.stringify(userDB.users));
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ accessToken });
    }
    else {
      return res.status(400).json({ message: "user hoặc mật khẩu không đúng" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};