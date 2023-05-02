import mongoose from "mongoose";

mongoose.connect(
  `mongodb+srv://dummy:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.davqwlu.mongodb.net/meals?retryWrites=true&w=majority`
);

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

const AdminUserSchema = new mongoose.Schema({
  username: String,
  password_hash: String, //sha256
});

const AdminSessionSchema = new mongoose.Schema({
  user_id: String,
  session_key: String,
});

export const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
export const Meal = mongoose.model("Meal", mealSchema);
export const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
export const AdminSession = mongoose.model("AdminSession", AdminSessionSchema);

// 🔒 function to add defaut admin user 🔒

// function addDefaultAdminUser() {
//   const adminUser = new AdminUser({
//     username: "admin",
//     password_hash: "<sha256 hash of password>",
//   });

//   adminUser.save();
// }

// addDefaultAdminUser();
