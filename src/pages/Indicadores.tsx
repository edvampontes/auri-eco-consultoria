import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { BarChart3, AlertTriangle, Plus, Save, TrendingDown, DollarSign, Leaf } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Indicador } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Indicadores() {
  const navigate = useNavigate();
  const { clienteAtual, indicadores, addIndicador } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    gResiduoPorRefeicao: '',
    kgDesviados: '',
    economiaFinanceira: '',
    co2Evitado: '',
  });

  const clienteIndicadores = indicadores
    .filter(i => i.clienteId === clienteAtual?.id)
    .sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      return a.mes - b.mes;
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteAtual) return;

    const novoIndicador: Indicador = {
      id: crypto.randomUUID(),
      clienteId: clienteAtual.id,
      mes: parseInt(formData.mes.toString()),
      ano: parseInt(formData.ano.toString()),
      gResiduoPorRefeicao: parseFloat(formData.gResiduoPorRefeicao) || 0,
      kgDesviados: parseFloat(formData.kgDesviados) || 0,
      economiaFinanceira: parseFloat(formData.economiaFinanceira) || 0,
      co2Evitado: parseFloat(formData.co2Evitado) || 0,
      dataRegistro: new Date().toISOString(),
    };

    addIndicador(novoIndicador);
    setShowForm(false);
    setFormData({
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      gResiduoPorRefeicao: '',
      kgDesviados: '',
      economiaFinanceira: '',
      co2Evitado: '',
    });
  };

  // Dados para os gráficos
  const labels = clienteIndicadores.map(i => `${meses[i.mes - 1]}/${i.ano}`);
  
  const residuoData = {
    labels,
    datasets: [
      {
        label: 'g de resíduo por refeição',
        data: clienteIndicadores.map(i => i.gResiduoPorRefeicao),
        borderColor: 'rgb(34, 139, 34)',
        backgroundColor: 'rgba(34, 139, 34, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const kgDesviadosData = {
    labels,
    datasets: [
      {
        label: 'kg desviados do aterro',
        data: clienteIndicadores.map(i => i.kgDesviados),
        backgroundColor: 'rgba(34, 139, 34, 0.8)',
      },
    ],
  };

  const economiaData = {
    labels,
    datasets: [
      {
        label: 'Economia (R$)',
        data: clienteIndicadores.map(i => i.economiaFinanceira),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Totais
  const totalKgDesviados = clienteIndicadores.reduce((acc, i) => acc + i.kgDesviados, 0);
  const totalEconomia = clienteIndicadores.reduce((acc, i) => acc + i.economiaFinanceira, 0);
  const totalCO2 = clienteIndicadores.reduce((acc, i) => acc + i.co2Evitado, 0);
  const mediaResiduo = clienteIndicadores.length > 0
    ? clienteIndicadores.reduce((acc, i) => acc + i.gResiduoPorRefeicao, 0) / clienteIndicadores.length
    : 0;

  if (!clienteAtual) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-12">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum Cliente Selecionado</h2>
            <p className="text-gray-600 mb-6">Por favor, cadastre um cliente antes de acessar os indicadores.</p>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="section-title">Indicadores</h1>
          <p className="section-subtitle">
            Acompanhe a evolução dos resultados com gráficos e comparações mensais.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-primary px-4 py-2 rounded-full text-sm">
            <span>Cliente: <strong>{clienteAtual.nomeEmpresa}</strong></span>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Média g/refeição</p>
            <p className="text-2xl font-bold text-green-600">{mediaResiduo.toFixed(1)}g</p>
          </div>
          <div className="card text-center">
            <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">kg Desviados</p>
            <p className="text-2xl font-bold text-green-600">{totalKgDesviados.toFixed(0)}kg</p>
          </div>
          <div className="card text-center">
            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Economia Total</p>
            <p className="text-2xl font-bold text-blue-600">R$ {totalEconomia.toFixed(2)}</p>
          </div>
          <div className="card text-center">
            <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">CO₂ Evitado</p>
            <p className="text-2xl font-bold text-green-600">{totalCO2.toFixed(1)}kg</p>
          </div>
        </div>

        {/* Botão Adicionar */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Registrar Indicadores
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Novos Indicadores</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                <select
                  name="mes"
                  value={formData.mes}
                  onChange={handleChange}
                  className="input-field"
                >
                  {meses.map((mes, index) => (
                    <option key={index} value={index + 1}>{mes}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <input
                  type="number"
                  name="ano"
                  value={formData.ano}
                  onChange={handleChange}
                  className="input-field"
                  min="2020"
                  max="2030"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">g de resíduo/refeição</label>
                <input
                  type="number"
                  name="gResiduoPorRefeicao"
                  value={formData.gResiduoPorRefeicao}
                  onChange={handleChange}
                  className="input-field"
                  step="0.1"
                  placeholder="Ex: 45.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">kg desviados do aterro</label>
                <input
                  type="number"
                  name="kgDesviados"
                  value={formData.kgDesviados}
                  onChange={handleChange}
                  className="input-field"
                  step="0.1"
                  placeholder="Ex: 150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Economia (R$)</label>
                <input
                  type="number"
                  name="economiaFinanceira"
                  value={formData.economiaFinanceira}
                  onChange={handleChange}
                  className="input-field"
                  step="0.01"
                  placeholder="Ex: 1500.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CO₂ evitado (kg)</label>
                <input
                  type="number"
                  name="co2Evitado"
                  value={formData.co2Evitado}
                  onChange={handleChange}
                  className="input-field"
                  step="0.1"
                  placeholder="Ex: 75"
                />
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Indicadores
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gráficos */}
        {clienteIndicadores.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <BarChart3 className="h-5 w-5 inline mr-2 text-primary" />
                Resíduo por Refeição (g)
              </h3>
              <Line data={residuoData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <BarChart3 className="h-5 w-5 inline mr-2 text-primary" />
                kg Desviados do Aterro
              </h3>
              <Bar data={kgDesviadosData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            <div className="card lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <BarChart3 className="h-5 w-5 inline mr-2 text-blue-600" />
                Economia Financeira (R$)
              </h3>
              <Line data={economiaData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum indicador registrado</h3>
            <p className="text-gray-600">Clique em "Registrar Indicadores" para começar a acompanhar os resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
