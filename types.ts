export interface Ingredient {
  name: string;
  amount: string;
  category?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  calories: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  gutBenefits: string; // Explanation of why this is good for the gut
  imageKeyword?: string; // For picsum
}

export interface UserProfile {
  name: string;
  restrictions: string[]; // e.g., 'Gluten-Free', 'Low FODMAP'
  intolerances: string[]; // e.g., 'Dairy', 'Garlic'
  goals: string[]; // e.g., 'Reduce bloating', 'Increase fiber'
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  category: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  RECIPES = 'RECIPES',
  MEAL_PLAN = 'MEAL_PLAN',
  SHOPPING_LIST = 'SHOPPING_LIST',
  RESEARCH = 'RESEARCH',
  SETTINGS = 'SETTINGS',
  JOURNAL = 'JOURNAL'
}

export interface MealPlanDay {
  day: string;
  breakfast?: Recipe | null;
  lunch?: Recipe | null;
  dinner?: Recipe | null;
}

export interface JournalEntry {
  id: string;
  date: string;
  recipeId: string;
  recipeTitle: string;
  rating: 'Great' | 'Good' | 'Fair' | 'Poor';
  symptoms: string[];
  notes?: string;
}