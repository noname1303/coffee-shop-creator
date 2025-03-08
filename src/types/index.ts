
export enum PriceRange {
  BUDGET = "$",
  MODERATE = "$$",
  EXPENSIVE = "$$$",
  PREMIUM = "$$$$"
}

export interface CoffeeShop {
  id: string;
  name: string;
  address: string;
  priceRange: PriceRange;
  createdAt: Date;
}
