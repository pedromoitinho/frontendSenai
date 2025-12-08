import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Expense } from '../types/expense';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { BudgetAlert } from '../components/BudgetAlert';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { Logo } from '../components/Logo';
import { AiChatbot } from '../components/AiChatbot';
import { ExportPdfButton } from '../components/ExportPdfButton';
import '../styles/dashboard.css';

const Index = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState<string>('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('monthlyBudget');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedBudget) {
      setMonthlyBudget(parseFloat(savedBudget));
      setBudgetInput(savedBudget);
    }
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  // Save budget to localStorage
  useEffect(() => {
    if (monthlyBudget > 0) {
      localStorage.setItem('monthlyBudget', monthlyBudget.toString());
    }
  }, [monthlyBudget]);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este gasto?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const handleSetBudget = () => {
    const budget = parseFloat(budgetInput);
    if (isNaN(budget) || budget <= 0) {
      alert('Por favor, insira um valor válido!');
      return;
    }
    setMonthlyBudget(budget);
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = monthlyBudget - totalSpent;
  const percentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProgressColor = () => {
    if (percentage >= 100) return 'progress-danger';
    if (percentage >= 80) return 'progress-warning';
    return 'progress-success';
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <Logo size={50} showText={true} />
        </div>
        <div className="dashboard-actions">
          <ExportPdfButton expenses={expenses} monthlyBudget={monthlyBudget} />
          <button onClick={handleLogout} className="btn btn-primary logout-btn">
            🚪 Sair
          </button>
        </div>
      </header>

      <section className="budget-section">
        <div className="budget-input-group">
          <div className="input-group">
            <label className="input-label">Orçamento Mensal (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input-field"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Digite seu orçamento mensal"
            />
          </div>
          <button onClick={handleSetBudget} className="btn btn-primary">
            💾 Definir Orçamento
          </button>
        </div>
      </section>

      <BudgetAlert totalSpent={totalSpent} monthlyBudget={monthlyBudget} />

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Gasto</span>
            <span className="stat-card-icon">💸</span>
          </div>
          <div className="stat-card-value">{formatCurrency(totalSpent)}</div>
          {monthlyBudget > 0 && (
            <div className="stat-card-progress">
              <div
                className={`stat-card-progress-bar ${getProgressColor()}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Orçamento</span>
            <span className="stat-card-icon">🎯</span>
          </div>
          <div className="stat-card-value">
            {monthlyBudget > 0 ? formatCurrency(monthlyBudget) : 'Não definido'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Disponível</span>
            <span className="stat-card-icon">{remaining >= 0 ? '✅' : '❌'}</span>
          </div>
          <div className="stat-card-value" style={{ color: remaining >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {formatCurrency(remaining)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total de Gastos</span>
            <span className="stat-card-icon">📊</span>
          </div>
          <div className="stat-card-value">{expenses.length}</div>
        </div>
      </section>

      <section className="content-grid">
        <ExpenseForm onAddExpense={handleAddExpense} />
        <CategoryBreakdown expenses={expenses} />
      </section>

      <section>
        <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
      </section>

      {/* Chatbot com IA */}
      <AiChatbot expenses={expenses} monthlyBudget={monthlyBudget} />
    </div>
  );
};

export default Index;
