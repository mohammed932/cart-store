const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./controllers/user");
const cartRouter = require("./controllers/cart");
const productRouter = require("./controllers/product");
const createUserRouter = require("./controllers/create_user");
const auth = require("./middleware/auth");
const validation = require("./middleware/ajv");
mongoose.connect(
  "mongodb+srv://mohammed932:adam111mokh@cluster0-ztaeh.mongodb.net/cart-store?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connected to database"));
app.use(express.json());
app.listen(5000, () => console.log("server started"));
app.use(validation);

app.use("/api/create_user", createUserRouter);
app.use(auth);
app.use("/api/users", userRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
// app.use((req,res,next)=>console.log("Hello"))
