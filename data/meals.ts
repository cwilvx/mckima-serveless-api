import { Item } from "../interfaces";
import { calcPrice } from "../utils";
import ingredients from "./ingredients";

export const meals = [
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
