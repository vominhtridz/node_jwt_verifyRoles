
import users from '../Model/users.json' assert {type: "json"}
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

export const Logout = async (req, res) => {
    const cookies = req.cookies
    console.log(cookies)
    if (!cookies?.jwt) res.sendStatus(401);
    const token = cookies.jwt
    const FoundUser = userDB.users.find((user) => user.accessToken === token)
    if (!FoundUser) {
        res.clearCookie('jwt',{httpOnly:true,maxAge: 24*60*60*1000})
        return res.sendStatus(403)
    }
    try {
        const otherUser = userDB.users.filter(user => user.accessToken !== token)
    const currentUser = { ...FoundUser, accessToken: '' }
    userDB.setUser([...otherUser,currentUser])
    promises.writeFile(path.join(__dirname, '..', 'Model', 'users.json'), JSON.stringify(userDB.users))
    res.clearCookie('jwt',{httpOnly:true,maxAge: 24*60*60*1000})
    res.status(200).json('logout Cuccess')
    }
    catch (err) {
        res.status(500).json({"message": err})
    }
}