export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  in_stock: boolean;
  image: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CityAnalytics {
  city: string;
  country: string;
  visitors: number;
  orders: number;
  revenue: number;
  coordinates: [number, number];
}

export interface ProductSales {
  productId: string;
  productName: string;
  category: string;
  totalSold: number;
  revenue: number;
  rank: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface Order {
  id: string;
  order_id: string;
  tracking_code: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_city: string;
  total: number;
  status: string;
  created_at: string;
  notes?: string;
}

export interface ProductForm {
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export interface CategoryForm {
  name: string;
  description: string;
}