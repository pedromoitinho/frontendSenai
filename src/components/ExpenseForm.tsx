import { useState } from 'react';
import { Expense, Category, CATEGORIES } from '../types/expense';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Por favor, insira um valor válido!');
      return;
    }

    onAddExpense({
      description,
      amount: numAmount,
      category,
      date
    });

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="card">
      <h2 className="card-title">➕ Adicionar Gasto</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label">Descrição</label>
            <input
              type="text"
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço no restaurante"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Categoria</label>
            <select
              className="select-field"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Data</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
          💾 Adicionar Gasto
        </button>
      </form>
    </div>
  );
};
