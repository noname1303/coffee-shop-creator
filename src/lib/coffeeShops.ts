
import { CoffeeShop, PriceRange } from "@/types";
import { toast } from "sonner";

// Demo data for initial load
const initialCoffeeShops: CoffeeShop[] = [
  {
    id: "1",
    name: "Minimal Brew",
    address: "123 Simplicity Ave, Design District",
    priceRange: PriceRange.MODERATE,
    styleId: "1",
    styleName: "Modern",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2940&auto=format&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559305616-3f99cd43e353?q=80&w=2940&auto=format&fit=crop"
    ],
    createdAt: new Date("2023-01-15")
  },
  {
    id: "2",
    name: "Essence Café",
    address: "456 Elegance St, Artisan Quarter",
    priceRange: PriceRange.EXPENSIVE,
    styleId: "4",
    styleName: "Cozy",
    imageUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=2071&auto=format&fit=crop",
    imageUrls: [
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1978&auto=format&fit=crop"
    ],
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

// When Supabase is connected, we'll add:
// 1. Functions to upload multiple images to S3/Supabase storage
// 2. Functions to save/retrieve coffee shop data from Supabase
// 3. Functions to manage coffee shop styles
