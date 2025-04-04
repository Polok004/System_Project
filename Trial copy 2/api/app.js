import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import agentRoute from "./routes/agent.route.js";
import homeRoute from "./routes/home.route.js";
import blogRoute from "./routes/blog.route.js";
import passport from "./passport-config.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's origin
  credentials: true,               // Allows cookies and authentication headers
}));

app.use(express.json());
app.use(cookieParser());


//app.use(passport.initialize());


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/agents", agentRoute);
app.use("/api/home", homeRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);


app.listen(8800, () => {
    console.log("Server is running!");
  });