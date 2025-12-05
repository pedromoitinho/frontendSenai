import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, RotateCcw } from 'lucide-react';
import { Expense, CATEGORIES } from '../types/expense';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AiChatbotProps {
  expenses?: Expense[];
  monthlyBudget?: number;
}

export const AiChatbot = ({ expenses = [], monthlyBudget = 0 }: AiChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou o assistente de IA da FinStress. Como posso ajudar você com suas finanças hoje?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_AI_API_KEY;
      const apiUrl = import.meta.env.VITE_AI_API_URL;

      if (!apiKey) {
        throw new Error('API Key não configurada. Configure a variável VITE_AI_API_KEY no arquivo .env');
      }

      // Preparar contexto financeiro
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const remaining = monthlyBudget - totalSpent;
      const percentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
      
      // Agrupar gastos por categoria
      const categoryBreakdown = expenses.reduce((acc, exp) => {
        const categoryName = CATEGORIES[exp.category].name;
        if (!acc[categoryName]) acc[categoryName] = 0;
        acc[categoryName] += exp.amount;
        return acc;
      }, {} as Record<string, number>);

      // Lista detalhada de gastos
      const expensesList = expenses.map(exp => 
        `  • ${exp.description} - ${CATEGORIES[exp.category].name} - R$ ${exp.amount.toFixed(2)} (${new Date(exp.date).toLocaleDateString('pt-BR')})`
      ).join('\n');

      const financialContext = `
CONTEXTO FINANCEIRO DO USUÁRIO:
- Orçamento mensal: R$ ${monthlyBudget.toFixed(2)}
- Total gasto: R$ ${totalSpent.toFixed(2)}
- Saldo disponível: R$ ${remaining.toFixed(2)}
- Porcentagem gasta: ${percentage.toFixed(1)}%
- Número de gastos registrados: ${expenses.length}
- Gastos por categoria: ${Object.entries(categoryBreakdown).map(([cat, val]) => `${cat}: R$ ${val.toFixed(2)}`).join(', ')}

LISTA DETALHADA DE TODOS OS GASTOS:
${expensesList || '  Nenhum gasto registrado ainda.'}
`;

      const systemPrompt = 'Você é um assistente financeiro especializado EXCLUSIVAMENTE em economia e finanças pessoais. Suas responsabilidades são: ajudar com orçamento, controle de gastos, investimentos, economia, planejamento financeiro e educação financeira. REGRAS IMPORTANTES: 1) APENAS responda perguntas relacionadas a economia, finanças, dinheiro e gestão financeira. 2) Se a pergunta NÃO for sobre economia/finanças, responda educadamente: "Desculpe, sou especializado apenas em questões financeiras e econômicas. Como posso ajudar você com suas finanças?" 3) Seja amigável, didático e forneça conselhos práticos. 4) Use exemplos em reais (R$) quando apropriado. 5) Você tem acesso aos dados financeiros reais do usuário e pode fazer análises específicas baseadas neles.' + (expenses.length > 0 ? financialContext : '');


      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: 'user', content: inputMessage },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao comunicar com a API');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([{
      id: '1',
      content: 'Olá! Sou o assistente de IA da FinStress. Como posso ajudar você com suas finanças hoje?',
      role: 'assistant',
      timestamp: new Date(),
    }]);
  };

  return (
    <>
      {/* Botão Flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 z-50"
          aria-label="Abrir chat com IA"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Janela do Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Assistente FinStress</h3>
                <p className="text-white/80 text-xs">Sempre online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetConversation}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                aria-label="Resetar conversa"
                title="Resetar conversa"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                aria-label="Fechar chat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg p-3 shadow-sm border border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensagem"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
