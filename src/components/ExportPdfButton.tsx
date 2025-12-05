import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense, CATEGORIES } from '../types/expense';

interface ExportPdfButtonProps {
  expenses: Expense[];
  monthlyBudget: number;
}

export const ExportPdfButton = ({ expenses, monthlyBudget }: ExportPdfButtonProps) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = monthlyBudget - totalSpent;
    const percentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

    // Título
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('FinStress AI', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Relatório de Gastos', pageWidth / 2, 30, { align: 'center' });

    // Data de geração
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth / 2, 38, { align: 'center' });

    // Resumo financeiro
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo Financeiro', 14, 50);
    
    doc.setFontSize(10);
    const summaryY = 58;
    doc.text(`Orçamento Mensal: R$ ${monthlyBudget.toFixed(2)}`, 14, summaryY);
    doc.text(`Total Gasto: R$ ${totalSpent.toFixed(2)}`, 14, summaryY + 6);
    doc.text(`Saldo Disponível: R$ ${remaining.toFixed(2)}`, 14, summaryY + 12);
    doc.text(`Porcentagem Gasta: ${percentage.toFixed(1)}%`, 14, summaryY + 18);
    doc.text(`Total de Gastos: ${expenses.length}`, 14, summaryY + 24);

    // Alerta se ultrapassou o orçamento
    if (percentage >= 100) {
      doc.setTextColor(239, 68, 68);
      doc.setFontSize(11);
      doc.text('⚠️ ATENÇÃO: Orçamento ultrapassado!', 14, summaryY + 32);
    } else if (percentage >= 80) {
      doc.setTextColor(245, 158, 11);
      doc.text('⚠️ Cuidado: Você já gastou mais de 80% do orçamento!', 14, summaryY + 32);
    } else if (percentage >= 60) {
      doc.setTextColor(239, 68, 68);
      doc.text('⚠️ Alerta: Você já gastou mais de 60% do orçamento!', 14, summaryY + 32);
    }

    // Gastos por categoria
    const categoryBreakdown = expenses.reduce((acc, exp) => {
      const categoryName = CATEGORIES[exp.category].name;
      if (!acc[categoryName]) acc[categoryName] = 0;
      acc[categoryName] += exp.amount;
      return acc;
    }, {} as Record<string, number>);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('Gastos por Categoria', 14, 100);

    const categoryData = Object.entries(categoryBreakdown).map(([cat, val]) => [
      cat,
      `R$ ${val.toFixed(2)}`,
      `${((val / totalSpent) * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: 105,
      head: [['Categoria', 'Valor', 'Percentual']],
      body: categoryData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 9 },
    });

    // Lista detalhada de gastos
    const finalY = (doc as any).lastAutoTable.finalY || 140;
    doc.setFontSize(12);
    doc.text('Detalhamento de Gastos', 14, finalY + 15);

    const expenseData = expenses.map(exp => [
      new Date(exp.date).toLocaleDateString('pt-BR'),
      exp.description,
      CATEGORIES[exp.category].name,
      `R$ ${exp.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Data', 'Descrição', 'Categoria', 'Valor']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 70 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30, halign: 'right' }
      }
    });

    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Salvar PDF
    const fileName = `FinStress_Gastos_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  };

  return (
    <button
      onClick={generatePDF}
      className="btn btn-primary"
      disabled={expenses.length === 0}
      title={expenses.length === 0 ? 'Adicione gastos para gerar o relatório' : 'Exportar relatório em PDF'}
    >
      <FileDown className="w-5 h-5" />
      Exportar PDF
    </button>
  );
};
