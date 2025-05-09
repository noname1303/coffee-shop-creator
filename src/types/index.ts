
export enum PriceRange {
  BUDGET = "$",
  MODERATE = "$$",
  EXPENSIVE = "$$$",
  PREMIUM = "$$$$"
}

export interface CoffeeShopStyle {
  id: string;
  name: string;
}

export interface CoffeeShop {
  id: string;
  name: string;
  address: string;
  priceRange: PriceRange;
  styleId?: string;
  styleName?: string;
  styles?: CoffeeShopStyle[]; // Multiple styles as an array
  imageUrl?: string;
  imageUrls?: string[]; // Added array of image URLs for multiple images
  createdAt: Date;
}
