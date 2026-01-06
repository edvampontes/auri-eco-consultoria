import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  Eye,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { useData } from '../context/DataContext';
import jsPDF from 'jspdf';

export default function Consultor() {
  const navigate = useNavigate();
  const { clientes, diagnosticos, checklists, indicadores, setClienteAtual } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  const getClienteStatus = (clienteId: string) => {
    const clienteChecklists = checklists.filter(c => c.clienteId === clienteId);
    if (clienteChecklists.length === 0) return { mes: 0, label: 'Não iniciado' };
    
    const checklistsConcluidos = clienteChecklists.filter(c => 
      c.itens.every(i => i.concluido)
    ).length;
    
    return { 
      mes: checklistsConcluidos, 
      label: checklistsConcluidos === 6 ? 'Concluído' : `Mês ${checklistsConcluidos + 1}` 
    };
  };

  const getClienteDiagnostico = (clienteId: string) => {
    return diagnosticos.find(d => d.clienteId === clienteId);
  };

  const getClienteIndicadores = (clienteId: string) => {
    return indicadores.filter(i => i.clienteId === clienteId);
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.cnpj.includes(searchTerm);
    
    if (filterStatus === 'todos') return matchesSearch;
    
    const status = getClienteStatus(cliente.id);
    if (filterStatus === 'nao_iniciado') return matchesSearch && status.mes === 0;
    if (filterStatus === 'em_andamento') return matchesSearch && status.mes > 0 && status.mes < 6;
    if (filterStatus === 'concluido') return matchesSearch && status.mes === 6;
    
    return matchesSearch;
  });

  const handleSelectCliente = (cliente: typeof clientes[0]) => {
    setClienteAtual(cliente);
  };

  const gerarRelatorioCompleto = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    const diagnostico = getClienteDiagnostico(clienteId);
    const clienteIndicadores = getClienteIndicadores(clienteId);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(34, 139, 34);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Auri & Eco Consultoria', 20, 25);
    doc.setFontSize(12);
    doc.text('Relatório Completo do Cliente', 20, 35);

    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Dados do Cliente
    doc.setFontSize(16);
    doc.text('Dados do Cliente', 20, 55);
    doc.setFontSize(11);
    doc.text(`Empresa: ${cliente.nomeEmpresa}`, 20, 65);
    doc.text(`CNPJ: ${cliente.cnpj}`, 20, 72);
    doc.text(`Segmento: ${cliente.segmento}`, 20, 79);
    doc.text(`Responsável: ${cliente.responsavel.nome}`, 20, 86);
    doc.text(`Contato: ${cliente.responsavel.email} | ${cliente.responsavel.telefone}`, 20, 93);

    // Diagnóstico
    if (diagnostico) {
      doc.setFontSize(16);
      doc.text('Diagnóstico Inicial', 20, 110);
      doc.setFontSize(11);
      doc.text(`Volume de Resíduos: ${diagnostico.volumeResiduosKgDia} kg/dia`, 20, 120);
      doc.text(`Forma de Descarte: ${diagnostico.formaDescarte}`, 20, 127);
      doc.text(`Custo de Coleta: R$ ${diagnostico.custoColeta}/mês`, 20, 134);
    }

    // Indicadores
    if (clienteIndicadores.length > 0) {
      const totalKg = clienteIndicadores.reduce((acc, i) => acc + i.kgDesviados, 0);
      const totalEconomia = clienteIndicadores.reduce((acc, i) => acc + i.economiaFinanceira, 0);
      const totalCO2 = clienteIndicadores.reduce((acc, i) => acc + i.co2Evitado, 0);

      doc.setFontSize(16);
      doc.text('Resultados Acumulados', 20, 155);
      doc.setFontSize(11);
      doc.setTextColor(34, 139, 34);
      doc.text(`kg Desviados do Aterro: ${totalKg.toFixed(0)} kg`, 20, 165);
      doc.text(`Economia Total: R$ ${totalEconomia.toFixed(2)}`, 20, 172);
      doc.text(`CO₂ Evitado: ${totalCO2.toFixed(1)} kg`, 20, 179);
    }

    // Status do Checklist
    const status = getClienteStatus(clienteId);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Status do Programa', 20, 200);
    doc.setFontSize(11);
    doc.text(`Progresso: ${status.label}`, 20, 210);
    doc.text(`Meses Concluídos: ${status.mes}/6`, 20, 217);

    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 280);
    doc.text('Auri & Eco Consultoria - Redução de Resíduos Orgânicos', pageWidth / 2, 287, { align: 'center' });

    doc.save(`relatorio_${cliente.nomeEmpresa.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="section-title">Área do Consultor</h1>
          <p className="section-subtitle">
            Gerencie todos os clientes, acompanhe o progresso e gere relatórios.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total de Clientes</p>
            <p className="text-3xl font-bold text-primary">{clientes.length}</p>
          </div>
          <div className="card text-center">
            <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Em Andamento</p>
            <p className="text-3xl font-bold text-blue-600">
              {clientes.filter(c => {
                const s = getClienteStatus(c.id);
                return s.mes > 0 && s.mes < 6;
              }).length}
            </p>
          </div>
          <div className="card text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Concluídos</p>
            <p className="text-3xl font-bold text-green-600">
              {clientes.filter(c => getClienteStatus(c.id).mes === 6).length}
            </p>
          </div>
          <div className="card text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Relatórios Gerados</p>
            <p className="text-3xl font-bold text-purple-600">{diagnosticos.length}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="todos">Todos os Status</option>
                <option value="nao_iniciado">Não Iniciado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        {filteredClientes.length > 0 ? (
          <div className="space-y-4">
            {filteredClientes.map((cliente) => {
              const status = getClienteStatus(cliente.id);
              
              return (
                <div key={cliente.id} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{cliente.nomeEmpresa}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status.mes === 0 ? 'bg-gray-100 text-gray-600' :
                          status.mes === 6 ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">CNPJ:</span> {cliente.cnpj}
                        </div>
                        <div>
                          <span className="font-medium">Segmento:</span> {cliente.segmento}
                        </div>
                        <div>
                          <span className="font-medium">Responsável:</span> {cliente.responsavel.nome}
                        </div>
                        <div>
                          <span className="font-medium">Cadastro:</span> {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      {/* Progresso */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progresso do Programa</span>
                          <span className="font-medium">{Math.round((status.mes / 6) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(status.mes / 6) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          handleSelectCliente(cliente);
                          navigate('/diagnostico');
                        }}
                        className="btn-secondary text-sm flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Diagnóstico
                      </button>
                      <button
                        onClick={() => {
                          handleSelectCliente(cliente);
                          navigate('/checklist');
                        }}
                        className="btn-secondary text-sm flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" />
                        Checklist
                      </button>
                      <button
                        onClick={() => {
                          handleSelectCliente(cliente);
                          navigate('/indicadores');
                        }}
                        className="btn-secondary text-sm flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        Indicadores
                      </button>
                      <button
                        onClick={() => gerarRelatorioCompleto(cliente.id)}
                        className="btn-primary text-sm flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Relatório PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {clientes.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {clientes.length === 0 
                ? 'Cadastre o primeiro cliente para começar.'
                : 'Tente ajustar os filtros de busca.'}
            </p>
            {clientes.length === 0 && (
              <button onClick={() => navigate('/cadastro')} className="btn-primary">
                Cadastrar Cliente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
