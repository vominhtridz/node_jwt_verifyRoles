import jwt from 'jsonwebtoken'
import users from '../Model/users.json' assert {type: "json"}
const userDB = {
    users: users,
    setUser:function(data){this.users = data}
}
export const RefreshToken = (req, res) => {
    const cookies = req.cookies
    console.log(req.body)
    console.log(cookies)

    if (!cookies?.jwt) res.sendStatus(401)
    const refreshToken = cookies.jwt
    const FoundUser = userDB.users.find((user) => user.refreshToken == refreshToken)
    if (!FoundUser) res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || FoundUser.user !== decoded.user)
          return res.sendStatus(403);
        const accessToken = jwt.sign(   
          { user: FoundUser.user },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.json({accessToken});
    });
}