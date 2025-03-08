
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CoffeeShopForm from "@/components/CoffeeShopForm";
import CoffeeShopList from "@/components/CoffeeShopList";
import { getCoffeeShops } from "@/lib/coffeeShops";
import { CoffeeShop } from "@/types";
import { Coffee } from "lucide-react";

const Index = () => {
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadCoffeeShops = () => {
    setIsLoading(true);
    try {
      const shops = getCoffeeShops();
      setCoffeeShops(shops);
    } catch (error) {
      console.error("Error loading coffee shops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Simulate a small delay to show the loading animation
    const timer = setTimeout(() => {
      loadCoffeeShops();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <section className="mb-12 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary mb-4">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Coffee Shop Manager</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Effortlessly manage your coffee shops. Add new locations and maintain a comprehensive catalog of your coffee ventures.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <CoffeeShopForm onSuccess={loadCoffeeShops} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Coffee Shops</h2>
            <div className="text-sm text-muted-foreground">
              {coffeeShops.length} {coffeeShops.length === 1 ? 'shop' : 'shops'} listed
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <p className="mt-4 text-muted-foreground">Loading coffee shops...</p>
              </div>
            </div>
          ) : (
            <CoffeeShopList shops={coffeeShops} onDelete={loadCoffeeShops} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
