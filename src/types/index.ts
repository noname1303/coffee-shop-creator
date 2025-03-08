
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
  imageUrl?: string;
  createdAt: Date;
}
