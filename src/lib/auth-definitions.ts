import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  referralCode: z.string().max(12).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const ProfileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

export const AddressSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  address_1: z.string().min(1, "Address is required"),
  address_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
});

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export interface SessionPayload {
  customerId: number;
  email: string;
  firstName: string;
  expiresAt: Date;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  billing: WooAddress;
  shipping: WooAddress;
  avatar_url: string;
  date_created: string;
}

export interface WooAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface WooOrder {
  id: number;
  status: string;
  currency: string;
  total: string;
  date_created: string;
  billing: WooAddress;
  shipping: WooAddress;
  line_items: WooLineItem[];
  shipping_total: string;
  payment_method_title: string;
}

export interface WooLineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  subtotal: string;
  total: string;
  price: number;
  image: { id: number; src: string };
}
