import jwt from 'jsonwebtoken'

export const VerifyJWT = (req, res, next) => {
    const bearHeader = req.headers.authorization || req.headers.Authorization;
    console.log(bearHeader);
    if (!bearHeader?.startsWith('Bearer ')) res.sendStatus(401)
    const token = bearHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) res.sendStatus(403) // invalid token
        req.user = data.userInfor.user
        req.roles = data.userInfor.roles
        next()
    })
}