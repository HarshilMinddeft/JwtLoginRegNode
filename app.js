import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/connectiondb.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// CORS POLICY
app.use(cors());

// Database connection
connectDB(DATABASE_URL);

app.get("/", async (req, res) => {
  const users = await user.find({});
  res.render("index.ejs", {
    title: "This is homepage",
    users: users,
  });
});

//json for making api
app.use(express.json());

//load routes
app.use("/api/user", userRoutes);

// app.post("/register", async (req, res) => {
// Check if req.body is defined and contains the expected properties
// if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
//   return res.status(400).send("Invalid request body");
// }

//   const { name, email, password, tc } = req.body;
//   const newUser = new user({ name, email, password, tc });
//   try {
//     const userSave = await newUser.save();
//     res.redirect("/");
//   } catch (error) {
//     console.error("Error saving user:", error);
//     res.status(500).send("Error saving user");
//   }
// });

// app.get("/register", (req, res) => {
//   res.render("register.ejs");
// });
app.listen(port, () => {
  console.log("server lisen at http://localhost:${port}");
});
