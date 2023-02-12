import jwt from 'jsonwebtoken'

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    //const token = req.headers.authorization.split(' ')[1]
    console.log("token " + token)
    console.log("JWT_SECRET " + process.env.JWT_SECRET)
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.userId = decoded.id
            console.log("req.userId " + req.userId + " " + decoded.id)

            next()
        } catch (error) {
            return res.json({
                message: 'Нет доступа. ' + token + " " + error
            })
        }
    } else {
        return res.json({
            message: 'Нет доступа. ' + token
        })
    }
}