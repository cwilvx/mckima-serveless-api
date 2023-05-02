import bodyParser from "body-parser";
import express from "express";
import { meals } from "../data/meals";

import { v4 as uuidv4 } from "uuid";

var cors = require("cors");
var cookieParser = require("cookie-parser");

import { OrderItem, Meal, AdminUser, AdminSession } from "../schemas";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "https://mckima-serveless-api.vercel.app",
    exposedHeaders: ["set-cookie"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/meals", async (req, res) => {
  const meals = await Meal.find();
  res.send({ meals });
});

app.get("/api/addmeals", (req, res) => {
  meals.forEach(async (meal) => {
    const mongoMeal = new Meal(meal);
    await mongoMeal.save();
  });

  res.send({ message: "done" });
});

app.get("/api/meals/:id", async (req, res) => {
  const meal = await Meal.findById(req.params.id);
  res.send({ meal });
});

app.post("/api/orders", async (req, res) => {
  // extract the order from the request body
  const data = { ...req.body, delivered: false };
  const order = new OrderItem(data);
  await order.save();

  res.send({ message: "order added" });
});

// get all orders by session_id
app.get("/api/orders/:session_id", async (req, res) => {
  const orders = await OrderItem.find({ session_id: req.params.session_id });
  res.send({ orders });
});

// get all orders
app.get("/api/orders", async (req, res) => {
  const orders = await OrderItem.find();
  res.send({ orders });
});

// remove all orders
app.delete("/api/orders", async (req, res) => {
  await OrderItem.deleteMany();
  res.send({ message: "all orders deleted" });
});

// mark an order as delivered by object id
app.put("/api/orders/deliver/:id", async (req, res) => {
  const order = await OrderItem.findById(req.params.id);
  order.delivered = !order.delivered;

  await order.save();
  res.send({ message: "order marked as delivered" });
});

// check if order is delivered by session id
app.get("/api/orders/delivered/:session_id", async (req, res) => {
  const status = await OrderItem.findOne({
    session_id: req.params.session_id,
  }).select("delivered");

  res.send({ status });
});

// delete an order by object id
app.delete("/api/orders/:id", async (req, res) => {
  await OrderItem.findByIdAndDelete(req.params.id);
  res.send({ message: "order deleted" });
});

// get all delivered orders
app.get("/api/orders/delivered", async (req, res) => {
  const orders = await OrderItem.find({ delivered: true });

  res.send({ orders });
});

// add a new meal
app.post("/api/meals", async (req, res) => {
  const meal_data = req.body;

  // split ingredients and optional_ingredients using ,

  const ingredients = meal_data.ingredients.split(",");
  let optional = [];

  if (meal_data.optional_ingredients != "") {
    optional = meal_data.optional_ingredients.split(",");
  }
  const meal = new Meal({
    ...meal_data,
    ingredients,
    optional_ingredients: optional,
    available: true,
  });

  await meal.save();

  res.send({ message: "meal added" });
});

// edit meal details
app.put("/api/meals/:id", async (req, res) => {
  const meal_data = req.body;

  // replace the previous meal with the new one using destructuring
  const meal = await Meal.findById(req.params.id);
  meal.name = meal_data.name;
  meal.description = meal_data.description;
  meal.price = meal_data.price;
  meal.image = meal_data.image;

  // split ingredients and optional_ingredients using ,
  meal.ingredients = meal_data.ingredients.split(",");
  if (meal_data.optional_ingredients != "") {
    meal.optional_ingredients = meal_data.optional_ingredients.split(",");
  }

  await meal.save();

  res.send({ message: "meal updated" });
});

// delete meal by id
app.delete("/api/meals/:id", async (req, res) => {
  await Meal.findByIdAndDelete(req.params.id);
  res.send({ message: "meal deleted" });
});

// mark meal as available or unavailable
app.put("/api/meals/available/:id", async (req, res) => {
  const meal = await Meal.findById(req.params.id);
  meal.available = !meal.available;
  await meal.save();

  res.send({ message: "meal availability updated" });
});

// delete all meals
app.delete("/api/meals", async (req, res) => {
  await Meal.deleteMany();
  res.send({ message: "all meals deleted" });
});

// admin login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // findone user with the username
  const user = await AdminUser.findOne({ username });

  if (!user) {
    return res.status(401).send({ message: "user not found" });
  }

  // check if the password is correct
  if (user.password_hash != password) {
    return res.status(406).send({ message: "incorrect password" });
  }

  // create a session
  const session = new AdminSession({
    user_id: user._id,
    session_key: uuidv4(),
  });

  await session.save();

  // send the session key as a cookie
  res.cookie("session_key", session.session_key, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.send({ message: "login successful" });
});

// validate admin session
app.get("/api/validate", async (req, res) => {
  const session = await AdminSession.findOne({
    session_key: req.cookies.session_key,
  });

  if (!session) {
    return res.status(401).send({ message: "invalid session" });
  }

  res.send({ message: "valid session" });
});

// admin logout
app.post("/api/logout", async (req, res) => {
  // delete the session
  await AdminSession.deleteOne({ session_key: req.cookies.session_key });

  // clear the cookie
  res.clearCookie("session_key");

  res.send({ message: "logout successful" });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on  http://localhost:${port}`);
});

// admin objectives
// - add new meals
// - edit existing meals
// - delete meals
// - add new ingredients
// - edit existing ingredients
// - delete ingredients

// view orders
// verify orders
// cancel orders
//
