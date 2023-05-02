export interface Item {
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

export interface OrderItem extends Item {
  session_id: string;
  status: string;
  eta: string;
  meals: Item[];
}
