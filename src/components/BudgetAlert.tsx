interface BudgetAlertProps {
  totalSpent: number;
  monthlyBudget: number;
}

export const BudgetAlert = ({ totalSpent, monthlyBudget }: BudgetAlertProps) => {
  if (monthlyBudget === 0) return null;

  const percentage = (totalSpent / monthlyBudget) * 100;

  if (percentage >= 100) {
    return (
      <div className="alert alert-danger">
        <span className="alert-icon">🚨</span>
        <div>
          <strong>Limite ultrapassado!</strong> Você gastou{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(totalSpent - monthlyBudget)}{' '}
          acima do seu orçamento mensal.
        </div>
      </div>
    );
  }

  if (percentage >= 80) {
    return (
      <div className="alert alert-warning">
        <span className="alert-icon">⚠️</span>
        <div>
          <strong>Atenção!</strong> Você já gastou {percentage.toFixed(0)}% do seu orçamento mensal.
        </div>
      </div>
    );
  }

  if (percentage >= 60) {
    return (
      <div className="alert alert-danger">
        <span className="alert-icon">⚠️</span>
        <div>
          <strong>Alerta!</strong> Você já gastou {percentage.toFixed(0)}% do seu orçamento mensal. Cuidado com os gastos!
        </div>
      </div>
    );
  }

  return null;
};
