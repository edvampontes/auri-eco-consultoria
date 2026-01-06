import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Briefcase, Save, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Cliente } from '../types';

export default function Cadastro() {
  const navigate = useNavigate();
  const { addCliente, setClienteAtual } = useData();
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    segmento: 'restaurante' as 'restaurante' | 'hotel' | 'ambos',
    endereco: '',
    responsavelNome: '',
    responsavelCargo: '',
    responsavelEmail: '',
    responsavelTelefone: '',
    refeicoesDia: '',
    tipoServico: 'buffet' as 'buffet' | 'alacarte' | 'misto',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoCliente: Cliente = {
      id: crypto.randomUUID(),
      nomeEmpresa: formData.nomeEmpresa,
      cnpj: formData.cnpj,
      segmento: formData.segmento,
      endereco: formData.endereco,
      responsavel: {
        nome: formData.responsavelNome,
        cargo: formData.responsavelCargo,
        email: formData.responsavelEmail,
        telefone: formData.responsavelTelefone,
      },
      operacao: {
        refeicoesDia: parseInt(formData.refeicoesDia) || 0,
        tipoServico: formData.tipoServico,
      },
      dataCadastro: new Date().toISOString(),
    };

    addCliente(novoCliente);
    setClienteAtual(novoCliente);
    setSaved(true);
    
    setTimeout(() => {
      navigate('/diagnostico');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="section-title">Cadastro do Cliente</h1>
          <p className="section-subtitle">
            Os dados são salvos automaticamente e reutilizados em todos os formulários e relatórios.
          </p>
        </div>

        {saved ? (
          <div className="card text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado!</h2>
            <p className="text-gray-600">Redirecionando para o diagnóstico inicial...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados da Empresa */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">Dados da Empresa</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    name="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Ex: Restaurante Sabor & Arte"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segmento *
                  </label>
                  <select
                    name="segmento"
                    value={formData.segmento}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="restaurante">Restaurante</option>
                    <option value="hotel">Hotel</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço da Unidade *
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Rua, número, bairro, cidade - UF"
                  />
                </div>
              </div>
            </div>

            {/* Responsável */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">Responsável</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="responsavelNome"
                    value={formData.responsavelNome}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo *
                  </label>
                  <input
                    type="text"
                    name="responsavelCargo"
                    value={formData.responsavelCargo}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Ex: Gerente de Operações"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="responsavelEmail"
                    value={formData.responsavelEmail}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="email@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="responsavelTelefone"
                    value={formData.responsavelTelefone}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Operação */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">Operação</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refeições por Dia *
                  </label>
                  <input
                    type="number"
                    name="refeicoesDia"
                    value={formData.refeicoesDia}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-field"
                    placeholder="Ex: 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Serviço *
                  </label>
                  <select
                    name="tipoServico"
                    value={formData.tipoServico}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="buffet">Buffet</option>
                    <option value="alacarte">À la carte</option>
                    <option value="misto">Misto</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Save className="h-5 w-5" />
              Salvar e Continuar para Diagnóstico
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
