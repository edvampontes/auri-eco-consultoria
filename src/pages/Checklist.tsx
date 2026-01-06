import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, AlertTriangle, Save, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { ChecklistMensal, ChecklistItem } from '../types';

const checklistsTemplate = [
  {
    mes: 1,
    titulo: 'Mês 1 — Medir e Entender',
    meta: 'Reduzir 10%',
    itens: [
      'Separação por tipo de resíduo',
      'Pesagem diária',
      'Definição de meta (g/refeição)',
      'Treinamento rápido',
    ],
  },
  {
    mes: 2,
    titulo: 'Mês 2 — Compras e Armazenamento',
    meta: '–10% a –15% por vencimento',
    itens: [
      'Revisão de fornecedores',
      'Frequência de compras',
      'FIFO e validade',
      'Ajustes de câmara fria',
    ],
  },
  {
    mes: 3,
    titulo: 'Mês 3 — Produção e Cozinha',
    meta: '–15% no preparo',
    itens: [
      'Fichas técnicas',
      'Porcionamento',
      'Aproveitamento integral',
    ],
  },
  {
    mes: 4,
    titulo: 'Mês 4 — Serviço e Buffet',
    meta: '–20% a –40%',
    itens: [
      'Redesenho do buffet',
      'Pratos menores',
      'Reposição fracionada',
      'Comunicação com cliente',
    ],
  },
  {
    mes: 5,
    titulo: 'Mês 5 — Destinação e Aterro Zero',
    meta: '+80% desvio de aterro',
    itens: [
      'Compostagem local/terceirizada',
      'Redução da coleta comum',
      'Registro de CO₂ evitado',
    ],
  },
  {
    mes: 6,
    titulo: 'Mês 6 — Consolidação e Certificação',
    meta: 'Selo Aterro Zero Orgânico',
    itens: [
      'Consolidação de indicadores',
      'Relatório final',
      'Plano contínuo',
      'Selo Aterro Zero Orgânico',
    ],
  },
];

export default function Checklist() {
  const navigate = useNavigate();
  const { clienteAtual, checklists, addChecklist, updateChecklist } = useData();
  const [expandedMonth, setExpandedMonth] = useState<number | null>(1);
  const [localChecklists, setLocalChecklists] = useState<ChecklistMensal[]>([]);
  const [observacoes, setObservacoes] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (clienteAtual) {
      const clienteChecklists = checklists.filter(c => c.clienteId === clienteAtual.id);
      
      if (clienteChecklists.length === 0) {
        // Criar checklists iniciais
        const novosChecklists = checklistsTemplate.map(template => ({
          id: crypto.randomUUID(),
          clienteId: clienteAtual.id,
          mes: template.mes,
          titulo: template.titulo,
          meta: template.meta,
          itens: template.itens.map(descricao => ({
            id: crypto.randomUUID(),
            descricao,
            concluido: false,
          })),
          observacoes: '',
        }));
        setLocalChecklists(novosChecklists);
      } else {
        setLocalChecklists(clienteChecklists);
        const obs: { [key: number]: string } = {};
        clienteChecklists.forEach(c => {
          obs[c.mes] = c.observacoes;
        });
        setObservacoes(obs);
      }
    }
  }, [clienteAtual, checklists]);

  const toggleItem = (mes: number, itemId: string) => {
    setLocalChecklists(prev =>
      prev.map(checklist => {
        if (checklist.mes === mes) {
          return {
            ...checklist,
            itens: checklist.itens.map(item =>
              item.id === itemId ? { ...item, concluido: !item.concluido } : item
            ),
          };
        }
        return checklist;
      })
    );
  };

  const handleObservacaoChange = (mes: number, value: string) => {
    setObservacoes(prev => ({ ...prev, [mes]: value }));
  };

  const salvarChecklist = (mes: number) => {
    const checklist = localChecklists.find(c => c.mes === mes);
    if (!checklist) return;

    const checklistAtualizado = {
      ...checklist,
      observacoes: observacoes[mes] || '',
      dataConclusao: checklist.itens.every(i => i.concluido) ? new Date().toISOString() : undefined,
    };

    const existente = checklists.find(c => c.clienteId === clienteAtual?.id && c.mes === mes);
    if (existente) {
      updateChecklist(checklistAtualizado);
    } else {
      addChecklist(checklistAtualizado);
    }

    alert('Checklist salvo com sucesso!');
  };

  const calcularProgresso = (itens: ChecklistItem[]) => {
    const concluidos = itens.filter(i => i.concluido).length;
    return Math.round((concluidos / itens.length) * 100);
  };

  if (!clienteAtual) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-12">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum Cliente Selecionado</h2>
            <p className="text-gray-600 mb-6">Por favor, cadastre um cliente antes de acessar o checklist.</p>
            <button onClick={() => navigate('/cadastro')} className="btn-primary">
              Ir para Cadastro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="section-title">Checklist Mensal Progressivo</h1>
          <p className="section-subtitle">
            Acompanhamento de 6 meses com metas claras e histórico completo.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-primary px-4 py-2 rounded-full text-sm">
            <span>Cliente: <strong>{clienteAtual.nomeEmpresa}</strong></span>
          </div>
        </div>

        <div className="space-y-4">
          {localChecklists.map((checklist) => {
            const progresso = calcularProgresso(checklist.itens);
            const isExpanded = expandedMonth === checklist.mes;
            const isCompleto = progresso === 100;

            return (
              <div
                key={checklist.mes}
                className={`card ${isCompleto ? 'border-2 border-green-500' : ''}`}
              >
                <button
                  onClick={() => setExpandedMonth(isExpanded ? null : checklist.mes)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        isCompleto
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {checklist.mes}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{checklist.titulo}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Target className="h-4 w-4" />
                        <span>Meta: {checklist.meta}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{progresso}%</div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progresso}%` }}
                        />
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-3">
                      {checklist.itens.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={item.concluido}
                            onChange={() => toggleItem(checklist.mes, item.id)}
                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                          />
                          <span
                            className={`flex-1 ${
                              item.concluido ? 'text-gray-400 line-through' : 'text-gray-700'
                            }`}
                          >
                            {item.descricao}
                          </span>
                          {item.concluido && (
                            <CheckSquare className="h-5 w-5 text-green-500" />
                          )}
                        </label>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observações do Consultor
                      </label>
                      <textarea
                        value={observacoes[checklist.mes] || ''}
                        onChange={(e) => handleObservacaoChange(checklist.mes, e.target.value)}
                        rows={3}
                        className="input-field"
                        placeholder="Adicione observações sobre este mês..."
                      />
                    </div>

                    <button
                      onClick={() => salvarChecklist(checklist.mes)}
                      className="mt-4 btn-primary flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar Checklist
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg text-center">
          <p className="text-primary font-medium">
            Cada checklist salva automaticamente, mantém histórico e permite continuidade mês a mês.
          </p>
        </div>
      </div>
    </div>
  );
}
