import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertTriangle, Calculator, FileDown, Plus, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Diagnostico as DiagnosticoType } from '../types';
import jsPDF from 'jspdf';

export default function Diagnostico() {
  const navigate = useNavigate();
  const { clienteAtual, addDiagnostico, diagnosticos } = useData();
  
  const [formData, setFormData] = useState({
    modeloOperacao: '',
    volumeResiduosKgDia: '',
    formaDescarte: '',
    custoColeta: '',
    pontosCriticos: [] as string[],
    novoPontoCritico: '',
  });

  const [resultados, setResultados] = useState({
    estimativaDesperdicio: 0,
    estimativaCusto: 0,
  });

  const [showResults, setShowResults] = useState(false);

  // Verificar se existe diagnóstico anterior
  useEffect(() => {
    if (clienteAtual) {
      const diagnosticoExistente = diagnosticos.find(d => d.clienteId === clienteAtual.id);
      if (diagnosticoExistente) {
        setFormData({
          modeloOperacao: diagnosticoExistente.modeloOperacao,
          volumeResiduosKgDia: diagnosticoExistente.volumeResiduosKgDia.toString(),
          formaDescarte: diagnosticoExistente.formaDescarte,
          custoColeta: diagnosticoExistente.custoColeta.toString(),
          pontosCriticos: diagnosticoExistente.pontosCriticos,
          novoPontoCritico: '',
        });
        setResultados({
          estimativaDesperdicio: diagnosticoExistente.estimativaDesperdicio,
          estimativaCusto: diagnosticoExistente.estimativaCusto,
        });
        setShowResults(true);
      }
    }
  }, [clienteAtual, diagnosticos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addPontoCritico = () => {
    if (formData.novoPontoCritico.trim()) {
      setFormData(prev => ({
        ...prev,
        pontosCriticos: [...prev.pontosCriticos, prev.novoPontoCritico.trim()],
        novoPontoCritico: '',
      }));
    }
  };

  const removePontoCritico = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pontosCriticos: prev.pontosCriticos.filter((_, i) => i !== index),
    }));
  };

  const calcularResultados = () => {
    const volumeDiario = parseFloat(formData.volumeResiduosKgDia) || 0;
    const custoColeta = parseFloat(formData.custoColeta) || 0;
    
    // Estimativas baseadas em médias do setor
    const estimativaDesperdicio = volumeDiario * 30; // kg/mês
    const custoMedioKg = 5; // R$ por kg de desperdício
    const estimativaCusto = estimativaDesperdicio * custoMedioKg + custoColeta;

    setResultados({
      estimativaDesperdicio,
      estimativaCusto,
    });
    setShowResults(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteAtual) {
      alert('Por favor, cadastre um cliente primeiro.');
      navigate('/cadastro');
      return;
    }

    calcularResultados();

    const novoDiagnostico: DiagnosticoType = {
      id: crypto.randomUUID(),
      clienteId: clienteAtual.id,
      modeloOperacao: formData.modeloOperacao,
      volumeResiduosKgDia: parseFloat(formData.volumeResiduosKgDia) || 0,
      formaDescarte: formData.formaDescarte,
      custoColeta: parseFloat(formData.custoColeta) || 0,
      pontosCriticos: formData.pontosCriticos,
      estimativaDesperdicio: resultados.estimativaDesperdicio,
      estimativaCusto: resultados.estimativaCusto,
      dataRealizacao: new Date().toISOString(),
    };

    addDiagnostico(novoDiagnostico);
  };

  const gerarPDF = () => {
    if (!clienteAtual) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(34, 139, 34);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Auri & Eco Consultoria', 20, 25);
    doc.setFontSize(12);
    doc.text('Diagnóstico Inicial', 20, 35);

    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Dados do Cliente
    doc.setFontSize(16);
    doc.text('Dados do Cliente', 20, 55);
    doc.setFontSize(11);
    doc.text(`Empresa: ${clienteAtual.nomeEmpresa}`, 20, 65);
    doc.text(`CNPJ: ${clienteAtual.cnpj}`, 20, 72);
    doc.text(`Responsável: ${clienteAtual.responsavel.nome}`, 20, 79);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 86);

    // Diagnóstico
    doc.setFontSize(16);
    doc.text('Diagnóstico', 20, 100);
    doc.setFontSize(11);
    doc.text(`Modelo de Operação: ${formData.modeloOperacao}`, 20, 110);
    doc.text(`Volume de Resíduos: ${formData.volumeResiduosKgDia} kg/dia`, 20, 117);
    doc.text(`Forma de Descarte: ${formData.formaDescarte}`, 20, 124);
    doc.text(`Custo de Coleta: R$ ${formData.custoColeta}/mês`, 20, 131);

    // Pontos Críticos
    doc.setFontSize(16);
    doc.text('Pontos Críticos de Desperdício', 20, 145);
    doc.setFontSize(11);
    formData.pontosCriticos.forEach((ponto, index) => {
      doc.text(`• ${ponto}`, 25, 155 + (index * 7));
    });

    // Resultados
    const yPos = 155 + (formData.pontosCriticos.length * 7) + 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 35, 'F');
    doc.setFontSize(16);
    doc.text('Resultados Estimados', 20, yPos + 5);
    doc.setFontSize(12);
    doc.setTextColor(34, 139, 34);
    doc.text(`Desperdício Estimado: ${resultados.estimativaDesperdicio.toFixed(0)} kg/mês`, 20, yPos + 15);
    doc.text(`Custo Desperdiçado: R$ ${resultados.estimativaCusto.toFixed(2)}/mês`, 20, yPos + 25);

    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(10);
    doc.text('Auri & Eco Consultoria - Redução de Resíduos Orgânicos', pageWidth / 2, 280, { align: 'center' });

    doc.save(`diagnostico_${clienteAtual.nomeEmpresa.replace(/\s+/g, '_')}.pdf`);
  };

  if (!clienteAtual) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-12">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum Cliente Selecionado</h2>
            <p className="text-gray-600 mb-6">Por favor, cadastre um cliente antes de realizar o diagnóstico.</p>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="section-title">Diagnóstico Inicial</h1>
          <p className="section-subtitle">
            Objetivo: criar a linha de base do cliente para acompanhamento.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-primary px-4 py-2 rounded-full text-sm">
            <span>Cliente: <strong>{clienteAtual.nomeEmpresa}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Informações da Operação</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo de Operação *
                </label>
                <select
                  name="modeloOperacao"
                  value={formData.modeloOperacao}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Selecione...</option>
                  <option value="cozinha_industrial">Cozinha Industrial</option>
                  <option value="restaurante_comercial">Restaurante Comercial</option>
                  <option value="hotel_restaurante">Hotel com Restaurante</option>
                  <option value="buffet_eventos">Buffet de Eventos</option>
                  <option value="fast_food">Fast Food</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volume Estimado de Resíduos (kg/dia) *
                </label>
                <input
                  type="number"
                  name="volumeResiduosKgDia"
                  value={formData.volumeResiduosKgDia}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="input-field"
                  placeholder="Ex: 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Descarte Atual *
                </label>
                <select
                  name="formaDescarte"
                  value={formData.formaDescarte}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Selecione...</option>
                  <option value="coleta_comum">Coleta Comum (Aterro)</option>
                  <option value="coleta_seletiva">Coleta Seletiva</option>
                  <option value="compostagem">Compostagem</option>
                  <option value="biodigestor">Biodigestor</option>
                  <option value="misto">Misto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custo de Coleta (R$/mês) *
                </label>
                <input
                  type="number"
                  name="custoColeta"
                  value={formData.custoColeta}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="Ex: 500.00"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Pontos Críticos de Desperdício</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="novoPontoCritico"
                  value={formData.novoPontoCritico}
                  onChange={handleChange}
                  className="input-field flex-1"
                  placeholder="Ex: Sobras do buffet no almoço"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPontoCritico())}
                />
                <button
                  type="button"
                  onClick={addPontoCritico}
                  className="btn-secondary flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </button>
              </div>

              {formData.pontosCriticos.length > 0 && (
                <ul className="space-y-2">
                  {formData.pontosCriticos.map((ponto, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                    >
                      <span className="text-gray-700">• {ponto}</span>
                      <button
                        type="button"
                        onClick={() => removePontoCritico(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Calculator className="h-5 w-5" />
            Calcular Estimativas
          </button>
        </form>

        {showResults && (
          <div className="mt-8 card bg-gradient-to-br from-green-50 to-green-100 border-2 border-primary">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-primary">Resultado Automático</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Estimativa de Desperdício</p>
                <p className="text-3xl font-bold text-primary">
                  {resultados.estimativaDesperdicio.toFixed(0)} kg/mês
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Estimativa de Custo Desperdiçado</p>
                <p className="text-3xl font-bold text-red-600">
                  R$ {resultados.estimativaCusto.toFixed(2)}/mês
                </p>
              </div>
            </div>

            <button
              onClick={gerarPDF}
              className="mt-6 btn-primary w-full flex items-center justify-center gap-2"
            >
              <FileDown className="h-5 w-5" />
              Gerar Relatório em PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
