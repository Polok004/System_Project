import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
//import postRoute from "./routes/post.route.js";


const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's origin
  credentials: true,               // Allows cookies and authentication headers
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
//app.use("/api/users", userRoute);
//app.use("/api/posts", postRoute);

app.listen(8800, () => {
    console.log("Server is running!");
  });