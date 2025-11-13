import { Expense, CATEGORIES } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (expenses.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">📋 Gastos Recentes</h2>
        <div className="empty-state">
          <div className="empty-state-icon">💸</div>
          <p className="empty-state-text">Nenhum gasto registrado ainda</p>
        </div>
      </div>
    );
  }

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="card">
      <h2 className="card-title">📋 Gastos Recentes</h2>
      <div className="expense-list">
        {sortedExpenses.map((expense) => {
          const categoryInfo = CATEGORIES[expense.category];
          return (
            <div key={expense.id} className="expense-item">
              <div className="expense-item-left">
                <div className={`expense-category-icon ${categoryInfo.color}`}>
                  {categoryInfo.icon}
                </div>
                <div className="expense-info">
                  <div className="expense-description">{expense.description}</div>
                  <div className="expense-meta">
                    {categoryInfo.name} • {formatDate(expense.date)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                <button
                  className="expense-delete"
                  onClick={() => onDeleteExpense(expense.id)}
                  title="Excluir gasto"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
