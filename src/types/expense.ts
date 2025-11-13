export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
}

export type Category = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'other';

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  food: { name: 'Alimentação', icon: '🍔', color: 'cat-food' },
  transport: { name: 'Transporte', icon: '🚗', color: 'cat-transport' },
  shopping: { name: 'Compras', icon: '🛍️', color: 'cat-shopping' },
  bills: { name: 'Contas', icon: '📄', color: 'cat-bills' },
  entertainment: { name: 'Lazer', icon: '🎮', color: 'cat-entertainment' },
  health: { name: 'Saúde', icon: '💊', color: 'cat-health' },
  education: { name: 'Educação', icon: '📚', color: 'cat-education' },
  other: { name: 'Outros', icon: '📦', color: 'cat-other' }
};
