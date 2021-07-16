import jwt from "jsonwebtoken"
import { UserModel } from "../DB/accommodations"
import {User} from "../types/interfaces"


const generateJWT = (payload:any) =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 week" }, (err, token) => {
            if (err) reject(err)

            resolve(token)
        })
    )

    export const jwtAuthenticate = async (user:User) => {
        const accessToken = await generateJWT({ _id: user._id, role: user.role })
        // i add role so i can check it later when i will receive the token from the FE
        return accessToken
    }

    export const verifyToken = (token:any) =>
    new Promise((resolve, reject) =>
        jwt.verify(token, process.env.JWT_SECRET, (err:any, decodedToken:any) => {
            // decoded === payload
            if (err) reject(err)

            resolve(decodedToken)
        })
    )


    export const JWTAuthMiddleware = async (req:any, res:any, next:any) => {
        // 1. Check if Authorization header is received, if it is not --> trigger an error (401)
        if (!req.headers.authorization) {
            res.status(401).send("Please provide token in the authorization header!")
        } else {
            try {
                // 2. Extract the token from authorization header (Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGVkNWI4N2M0MjM1YTFkZWNhOGY3YzIiLCJpYXQiOjE2MjYyNTI3NTcsImV4cCI6MTYyNjg1NzU1N30.VA7M1z2LRAilFGLt1grvEIdv1VI2WUwpGWo_N0yzodg)
                const token = req.headers.authorization.replace("Bearer ", "")
    
                // 3. Verify the token (decode it)
    
                const content:any = await verifyToken(token)
    
                // 4. Find user in db and attach him/her to the request object
    
                const user = await UserModel.findById(content._id)
    
                if (user) {
                    req.user = user
                    next()
                } else {
                   res.status(404).send("User not found!")
                }
            } catch (error) {
               res.status(401).send("Token not valid!")
            }
        }
    }


    export const hostOnly = async (req:any, res:any, next:any) => {
        const token = req.headers.authorization.replace("Bearer ", "")
        const content:any = await verifyToken(token)
        if (content.role === "host") { // if role is "host" we can proceed to the request handler
            next()
        } else { // we trigger a 403 error
            res.status(403).send("You are unauthorized for this Route Buddy :/ ")
        }
    }