

import type { LucideIcon } from "lucide-react";

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: Brand;
  type: 'simple' | 'variable' | 'dupe' | 'original';
  gender: 'homme' | 'femme' | 'mixte';
  family: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  shortDescription: string;
  longDescription: string;
  metaTitle: string;
  metaDescription: string;
  price: number;
  volumeMl: number;
  stock: number;
  isBestseller: boolean;
  isNew: boolean;
  tags: string[];
  images: string[];
  reviews: Review[];
  rating: number;
  faq?: FaqItem[];
  productType?: 'perfume' | 'cosmetic';
  options?: ProductOption[];
}

export interface FragranceFamily {
  id: string;
  name: string;
  imageUrl: string;
  imageHint: string;
}

export interface GenderCategory {
  id: string;
  name: 'homme' | 'femme' | 'mixte';
  displayName: string;
  imageUrl: string;
  imageHint: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    itemPrice: number;
    name: string;
    image: string;
}

export interface Order {
    id: string;
    userId: string;
    orderDate: string;
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    orderItems: OrderItem[];
    stripeSessionId?: string;
    shippingMethod?: ShippingMethod['id'];
}

export type ShippingMethod = {
  id: 'mondial-relay' | 'colissimo';
  name: string;
  description: string;
  cost: number;
  icon: LucideIcon;
};
