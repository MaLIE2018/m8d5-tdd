import express from "express";
import { UserModel ,AccommodationModel} from "../DB/accommodations/index";
import { jwtAuthenticate ,JWTAuthMiddleware,hostOnly} from "../auth/auth";

const UsersRouter = express.Router()

UsersRouter.post("/register", async (req,res,next) => {
    try {
        const newUser =  new UserModel(req.body)
        const savedUser = await newUser.save()
        res.status(201).send(savedUser)

    } catch (error:any) {
        res.status(400).send(error.message)
    }
})

UsersRouter.post("/login" , async (req,res,next)=> {
    try {
        const {name,password} = req.body
        const user = await UserModel.checkCredentials(name,password)
        if (user) {
            const accessToken = await jwtAuthenticate(user)
            res.send({accessToken})
        } else {
            res.status(401).send("Wrong Credentials")
        }
    } catch (error:any) {
        res.status(500).send(error.message)
    }
})

UsersRouter.get("/me" ,JWTAuthMiddleware, async (req:any,res,next)=> {
    try {
        const user = req.user
        if(user) res.status(201).send(user)    
    } catch (error:any) {
       res.status(500).send(error.message)
        
    }
})

UsersRouter.get("/me/accommodation" ,hostOnly,JWTAuthMiddleware, async (req: any ,res,next)=> {

    try {
         const accommodations = await AccommodationModel.find({host:req.user._id}).populate(["location","host"])
         if (accommodations)  res.status(200).send(accommodations)
         else res.status(200).send("You have no accommodations Buddy.")
    } catch (error:any) {
        res.status(500).send(error.message)
    }
})


export default UsersRouter
