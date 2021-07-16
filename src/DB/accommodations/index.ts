import mongoose from "mongoose";
import bcrypt from "bcrypt"
import {User} from "../../types/interfaces"

const AccommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    host:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    }
  },
  {
    timestamps: true,
  }
);
const DestinationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    unique: true,
  },
});



const UserSchema = new mongoose.Schema (
  {
    name:{
      type:String,
      required:true,
    },
    email: {
      type:String ,
      required : true 
    } ,
    password : {
      type: String , 
      required : true 
    } ,
    role : {
      type : String , required : true , enum : ["host","guest"]
    }
  }
)

UserSchema.pre("save", async function (next) {
  console.log(this)
  const newUser:any = this 
  const plainText = newUser.password
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainText,10)
    console.log(newUser.password)
  }
  next()
})

UserSchema.statics.checkCredentials = async function (name, plainText) {
  const user = await this.findOne({ name })
  if (user) {
      const hashedPassword = user.password
      const isMatch = await bcrypt.compare(plainText, hashedPassword)
      if (isMatch) return user
      else return null
  } else {
      return null
  }
}
UserSchema.methods.toJSON = function () {
  const user = this
  const { name,email,role }:any = user.toObject()
  return { name,  email, role }
}

DestinationSchema.methods.toJSON = function () {
   const {location}:any = this.toObject()
  return location 
}



export const DestinationModel = mongoose.model(
  "Destination",
  DestinationSchema
);

export  const AccommodationModel = mongoose.model("accommodation", AccommodationSchema);

export const UserModel:any = mongoose.model(
  "User",
  UserSchema
);

