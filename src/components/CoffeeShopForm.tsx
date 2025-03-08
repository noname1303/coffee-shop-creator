
import React, { useState } from "react";
import { PriceRange } from "@/types";
import { addCoffeeShop } from "@/lib/coffeeShops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, MapPin, DollarSign, Plus } from "lucide-react";

interface CoffeeShopFormProps {
  onSuccess: () => void;
}

const CoffeeShopForm: React.FC<CoffeeShopFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>(PriceRange.MODERATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation states
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setNameError("");
    setAddressError("");
    
    // Validate
    let isValid = true;
    
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }
    
    if (!address.trim()) {
      setAddressError("Address is required");
      isValid = false;
    }
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      addCoffeeShop({
        name: name.trim(),
        address: address.trim(),
        priceRange
      });
      
      // Clear form
      setName("");
      setAddress("");
      setPriceRange(PriceRange.MODERATE);
      onSuccess();
    } catch (error) {
      console.error("Error adding coffee shop:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Add New Coffee Shop</span>
          <Coffee className="h-5 w-5 text-primary" />
        </CardTitle>
        <CardDescription>
          Fill in the details to add a new coffee shop to your catalog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5" />
              Shop Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Minimal Brew"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`glass-input transition-all ${nameError ? 'border-destructive' : ''}`}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Address
            </Label>
            <Input
              id="address"
              placeholder="e.g. 123 Simplicity Ave, Design District"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`glass-input transition-all ${addressError ? 'border-destructive' : ''}`}
            />
            {addressError && <p className="text-xs text-destructive">{addressError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priceRange" className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              Price Range
            </Label>
            <Select
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as PriceRange)}
            >
              <SelectTrigger id="priceRange" className="glass-input">
                <SelectValue placeholder="Select a price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PriceRange.BUDGET}>$ (Budget)</SelectItem>
                <SelectItem value={PriceRange.MODERATE}>$$ (Moderate)</SelectItem>
                <SelectItem value={PriceRange.EXPENSIVE}>$$$ (Expensive)</SelectItem>
                <SelectItem value={PriceRange.PREMIUM}>$$$$ (Premium)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full group transition-all hover:shadow-md" 
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            {isSubmitting ? "Adding..." : "Add Coffee Shop"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CoffeeShopForm;
