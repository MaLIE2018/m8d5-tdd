import express from "express";
import cors from "cors";
import accommodationRouter from "./services/accommodation";
import UsersRouter from "./services/user";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/accommodation", accommodationRouter);
app.use("/users",UsersRouter)


// service/route files ==> index == export route into this file

export default app;
