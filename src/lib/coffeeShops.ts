
import { CoffeeShop, PriceRange } from "@/types";
import { toast } from "sonner";

// Demo data for initial load
const initialCoffeeShops: CoffeeShop[] = [
  {
    id: "1",
    name: "Minimal Brew",
    address: "123 Simplicity Ave, Design District",
    priceRange: PriceRange.MODERATE,
    createdAt: new Date("2023-01-15")
  },
  {
    id: "2",
    name: "Essence Café",
    address: "456 Elegance St, Artisan Quarter",
    priceRange: PriceRange.EXPENSIVE,
    createdAt: new Date("2023-02-20")
  }
];

// Simulate localStorage persistence
const STORAGE_KEY = "coffee-shops";

// Get shops from localStorage or use initial data
export const getCoffeeShops = (): CoffeeShop[] => {
  if (typeof window === "undefined") return initialCoffeeShops;
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  
  if (!storedData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCoffeeShops));
    return initialCoffeeShops;
  }
  
  try {
    // Parse the data and convert string dates back to Date objects
    return JSON.parse(storedData, (key, value) => {
      if (key === "createdAt") return new Date(value);
      return value;
    });
  } catch (error) {
    console.error("Error parsing coffee shops data:", error);
    return initialCoffeeShops;
  }
};

// Add a new coffee shop
export const addCoffeeShop = (shop: Omit<CoffeeShop, "id" | "createdAt">): CoffeeShop => {
  const shops = getCoffeeShops();
  
  const newShop: CoffeeShop = {
    ...shop,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date()
  };
  
  const updatedShops = [newShop, ...shops];
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShops));
    toast.success("Coffee shop added successfully");
    return newShop;
  } catch (error) {
    console.error("Error saving coffee shop:", error);
    toast.error("Failed to add coffee shop");
    throw new Error("Failed to add coffee shop");
  }
};

// Delete a coffee shop
export const deleteCoffeeShop = (id: string): void => {
  const shops = getCoffeeShops();
  const updatedShops = shops.filter(shop => shop.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShops));
    toast.success("Coffee shop removed");
  } catch (error) {
    console.error("Error deleting coffee shop:", error);
    toast.error("Failed to remove coffee shop");
    throw new Error("Failed to delete coffee shop");
  }
};
