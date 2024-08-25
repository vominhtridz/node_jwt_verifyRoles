export const VerifyRoles = (...allowRoles) => {
    return (req, res, next) => {
       if (!req?.roles) res.sendStatus(401);
        const ArrRoles = [...allowRoles];
        console.log(ArrRoles);
        console.log(req.roles);
        const result = req.roles
          .map((role) => ArrRoles.includes(role))
          .find((val) => val === true);
        if (!result) res.sendStatus(401)
        next()
    }
}