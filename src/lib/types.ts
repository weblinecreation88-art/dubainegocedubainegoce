

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
  type: 'simple' | 'variable' | 'original' | 'oriental' | 'prestige';
  gender: 'homme' | 'femme' | 'mixte';
  family: string;
  intensity?: 'Légère' | 'Moyenne' | 'Forte' | string;
  longevity?: 'Courte' | 'Moyenne' | 'Longue durée' | string;
  occasion?: string[];
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
  inspiredBy?: string;
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
    // 'completed' est conserve pour les commandes deja enregistrees : il vaut
    // 'paid' (paiement encaisse, colis non encore expedie).
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped' | 'delivered';
    orderItems: OrderItem[];
    stripeSessionId?: string;
    shippingMethod?: ShippingMethod['id'];
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    shippingCost?: number;
    shippingAddress?: {
        line1?: string;
        line2?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
    // Suivi d'expedition
    trackingNumber?: string;
    carrier?: 'colissimo' | 'mondial-relay';
    shippedAt?: string;
    deliveredAt?: string;
    pickupPoint?: {
        id: string;
        name: string;
        address?: string;
        postalCode?: string;
        city?: string;
    };
}

export type ShippingMethod = {
  id: 'mondial-relay' | 'colissimo';
  name: string;
  description: string;
  cost: number;
  icon: LucideIcon;
};
