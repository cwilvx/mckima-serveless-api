import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
var cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

interface Item {
  name: string;
  price: number;
  description: string;
  image: string;
  count: number;
  ingredients: string[];
  optional_ingredients: string[];
  selected_ingredients: string[];
  available: boolean;
}

interface OrderItem extends Item {
  session_id: string;
  status: string;
  eta: string;
  meals: Item[];
}

const mealSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: Number,
  ingredients: Array,
  optional_ingredients: Array,
  available: Boolean,
});

const OrderItemSchema = new mongoose.Schema({
  session_id: String,
  meals: Array,
  delivered: Boolean,
  table_number: Number,
  time: String,
});

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

const calcPrice = (name: string, multiplier = 5) => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const map = [];

  for (let index = 0; index < name.length; index++) {
    const element = name[index].toLowerCase();
    map.push(letters.indexOf(element) + 1);
  }

  return (
    Math.round(map.reduce((prev, curr) => prev + curr, 0) / 5) * multiplier
  );
};

const ingredients = [
  {
    name: "Tuna poke with fresh vegetables",
    ingredients: [
      "tuna",
      "cucumber",
      "carrots",
      "red onion",
      "avocado",
      "sesame seeds",
      "rice",
      "soy sauce",
      "lime juice",
      "sriracha",
    ],
    optional_ingredients: [
      "radish",
      "scallions",
      "edamame",
      "wasabi",
      "pickled ginger",
    ],
  },
  {
    name: "Pizza with a lot of cheese",
    ingredients: [
      "pizza dough",
      "marinara sauce",
      "mozzarella cheese",
      "parmesan cheese",
      "basil leaves",
      "olive oil",
    ],
    optional_ingredients: [
      "pepperoni",
      "sausage",
      "mushrooms",
      "onions",
      "bell peppers",
      "jalapenos",
      "pineapple",
    ],
  },
  {
    name: "Fried salmon with sweet soy sauce in a Korean restaurant",
    ingredients: [
      "salmon fillets",
      "cornstarch",
      "soy sauce",
      "brown sugar",
      "garlic",
      "ginger",
      "rice vinegar",
      "green onions",
      "sesame seeds",
      "vegetable oil",
    ],
    optional_ingredients: ["chili flakes", "red pepper", "bok choy"],
  },
  {
    name: "Grilled salmon cubes with vegetables",
    ingredients: [
      "salmon fillets",
      "zucchini",
      "yellow squash",
      "red onion",
      "red bell pepper",
      "asparagus",
      "olive oil",
      "lemon juice",
      "garlic",
      "dill",
      "salt",
      "pepper",
    ],
    optional_ingredients: ["cherry tomatoes", "mushrooms", "eggplant"],
  },
  {
    name: "Healthy smoked salmon sandwich",
    ingredients: [
      "whole grain bread",
      "smoked salmon",
      "cucumber",
      "red onion",
      "tomato",
      "avocado",
      "cream cheese",
      "lemon juice",
      "dill",
    ],
    optional_ingredients: ["lettuce", "spinach", "sprouts"],
  },
  {
    name: "Orange juice drink with mint",
    ingredients: ["freshly squeezed orange juice", "mint leaves", "ice cubes"],
    optional_ingredients: ["lemon juice", "honey", "sparkling water"],
  },
  {
    name: "Czech lager beer from the tap",
    ingredients: ["Czech lager beer"],
    optional_ingredients: ["lime wedge"],
  },
  {
    name: "Healthy vegetarian salad with egg",
    ingredients: [
      "Mixed greens",
      "Cherry tomatoes",
      "Cucumber",
      "Red onion",
      "Boiled egg",
      "Avocado",
      "Sunflower seeds",
      "Balsamic vinaigrette",
    ],
    optional_ingredients: [
      "Grilled chicken",
      "Feta cheese",
      "Croutons",
      "Grilled vegetables",
    ],
  },
  {
    name: "Dreamy flatwhite coffee with perfect latte art",
    ingredients: [
      "Espresso",
      "Whole milk",
      "Cocoa powder",
      "Vanilla syrup",
      "Latte art",
    ],
    optional_ingredients: [
      "Almond milk",
      "Soy milk",
      "Caramel syrup",
      "Whipped cream",
    ],
  },
];

const meals = [
  {
    name: "Tuna poke with fresh vegetables",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2022/11/tuna-poke-with-fresh-vegetables-768x1024.jpg",
    description:
      "Who needs boring old salads when you can have this fresh and raw tuna dish? Packed with veggies and served with a tangy sauce, it's the perfect choice for anyone looking for a light and healthy meal. And let's be real, who doesn't want to feel like a health goddess/god?",
  },
  {
    name: "Pizza with a lot of cheese",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2019/01/pizza-463x617.jpg",
    description:
      "This cheesy pizza is like a warm hug in food form. Loaded with gooey mozzarella and other delicious toppings, it's the ultimate comfort food. Just be prepared for a cheese-induced food coma afterwards.",
  },
  {
    name: "Fried salmon with sweet soy sauce",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2021/01/fried-salmon-with-sweet-soy-sauce-in-a-korean-restaurant-600x400.jpg",
    description:
      "This Korean-style fried salmon is so crispy and juicy, it'll make your taste buds sing. And the sweet soy sauce? It's like a delicious symphony of flavors in your mouth. Trust us, you'll want to savor every last bite.",
  },
  {
    name: "Grilled salmon cubes with vegetables",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2018/06/salmon-600x400.jpg",
    description:
      "Who says healthy food has to be boring? This grilled salmon dish is bursting with flavor, thanks to perfectly cooked salmon cubes and a colorful mix of veggies. It's the perfect choice for anyone looking for a light and nutritious meal that doesn't skimp on taste.",
  },
  {
    name: "Healthy smoked salmon sandwich",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2019/02/healthy-smoked-salmon-sandwich-1024x683.jpg",
    description:
      "Our smoked salmon sandwich is like the superhero of lunch options. With the power of protein and the might of healthy fats, you'll be ready to take on anything. Just be warned: you might get so strong, you'll accidentally rip off the restaurant door when you leave.",
  },
  {
    name: "Orange juice drink with mint",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2016/05/orange-juice-drink-with-mint-1-600x400.jpg",
    description:
      "This refreshing drink is like a summer day in a glass. The sweet orange juice and fresh mint leaves are a match made in heaven, and it's the perfect thirst-quencher on a hot day. Just be warned: you might want to sip it by the pool while wearing a giant sun hat.",
  },
  {
    name: "Czech lager beer from the tap",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2019/06/czech-lager-beer-from-the-tap-1024x680.jpg",
    description:
      "This classic Czech lager beer is like a time machine to the heart of Europe. Brewed to perfection and served fresh from the tap, it's the perfect choice for beer lovers looking for a traditional and authentic brew. Prost!",
  },
  {
    name: "Healthy vegetarian salad with egg",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2019/01/healthy-vegetarian-salad-with-egg-1024x683.jpg",
    description:
      "Who says salads have to be boring? This colorful dish is packed with fresh veggies and protein-rich eggs, making it a great choice for a healthy and filling meal. And with all those flavors and textures, you won't even realize you're eating something that's good for you.",
  },
  {
    name: "Dreamy flatwhite coffee with perfect latte art",
    image:
      "https://www.foodiesfeed.com/wp-content/uploads/2019/01/dreamy-flatwhite-coffee-with-perfect-latte-art-1-1024x683.jpg",
    description:
      "This flatwhite coffee is like a dream come true for coffee lovers. Expertly crafted with perfect latte art on top, it's a dreamy and indulgent treat that'll satisfy even the most discerning caffeine snob. Trust us, you won't want to go back to regular coffee after this.",
  },
].map((f, index) => ({
  ...f,
  price: calcPrice(f.name),
  available: true,
  ingredients: ingredients[index].ingredients,
  optional_ingredients: ingredients[index].optional_ingredients,
})) as Item[];

console.log(JSON.stringify(meals[0]));

mongoose.connect(
  `mongodb+srv://dummy:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.davqwlu.mongodb.net/?retryWrites=true&w=majority`
);

const Meal = mongoose.model("Child", mealSchema);

app.get("/api", (req, res) => {
  res.send({
    routes: [
      {
        route: "/api/vaccines",
        description: "Get all vaccines",
        methods: ["GET"],
      },
      {
        route: "/api/child",
        description: "Add a single child",
        methods: ["POST"],
      },
      {
        route: "/api/child/:id",
        description: "Get a single child by id",
        methods: ["GET"],
      },
      {
        route: "/api/children",
        description: "Get all children",
        methods: ["GET"],
      },
    ],
  });
});

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

// get a single order by session_id property
app.get("/api/orders/:session_id", async (req, res) => {
  const order = await OrderItem.findOne({ session_id: req.params.session_id });
  res.send({ order });
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
