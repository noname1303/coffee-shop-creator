
import React from "react";
import { CoffeeShop } from "@/types";
import { deleteCoffeeShop } from "@/lib/coffeeShops";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, MapPin, DollarSign, Trash2, Store, PaintBucket } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CoffeeShopListProps {
  shops: CoffeeShop[];
  onDelete: () => void;
}

const CoffeeShopList: React.FC<CoffeeShopListProps> = ({ shops, onDelete }) => {
  if (shops.length === 0) {
    return (
      <div className="py-12 text-center animate-fade-in">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Coffee className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No coffee shops yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Add your first coffee shop using the form above to see it listed here.
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const handleDelete = (id: string) => {
    deleteCoffeeShop(id);
    onDelete();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {shops.map((shop, index) => (
        <Card 
          key={shop.id} 
          className="glass-card animate-slide-up overflow-hidden hover:shadow-md transition-all"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {shop.imageUrl && (
            <div className="h-36 overflow-hidden">
              <img 
                src={shop.imageUrl} 
                alt={shop.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
          )}
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                {shop.priceRange}
              </Badge>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Coffee Shop</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove "{shop.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(shop.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <CardTitle className="line-clamp-2">{shop.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5" />
              <span>Added on {formatDate(shop.createdAt)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">{shop.address}</p>
            </div>
            {shop.styleName && (
              <div className="flex items-start gap-2 text-sm mt-2">
                <PaintBucket className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">Style: {shop.styleName}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              <span>
                {shop.priceRange === "$" && "Budget friendly"}
                {shop.priceRange === "$$" && "Moderately priced"}
                {shop.priceRange === "$$$" && "High-end"}
                {shop.priceRange === "$$$$" && "Premium experience"}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CoffeeShopList;
