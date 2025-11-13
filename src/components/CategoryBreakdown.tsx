import { Expense, CATEGORIES, Category } from '../types/expense';

interface CategoryBreakdownProps {
  expenses: Expense[];
}

export const CategoryBreakdown = ({ expenses }: CategoryBreakdownProps) => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<Category, number>);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const categoriesWithExpenses = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category: category as Category,
      total
    }))
    .sort((a, b) => b.total - a.total);

  if (categoriesWithExpenses.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">📊 Gastos por Categoria</h2>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p className="empty-state-text">Adicione gastos para ver o resumo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">📊 Gastos por Categoria</h2>
      <div className="category-grid">
        {categoriesWithExpenses.map(({ category, total }) => {
          const categoryInfo = CATEGORIES[category];
          return (
            <div key={category} className="category-item">
              <div className="category-item-icon">{categoryInfo.icon}</div>
              <div className="category-item-name">{categoryInfo.name}</div>
              <div className="category-item-amount">{formatCurrency(total)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
