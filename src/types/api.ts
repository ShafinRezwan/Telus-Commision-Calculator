import axios from "axios";
import type { Order } from "./types";

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get<Order[]>("https://your-api-url.com/orders");
  return response.data;
};