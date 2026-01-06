export interface Cliente {
  id: string;
  nomeEmpresa: string;
  cnpj: string;
  segmento: 'restaurante' | 'hotel' | 'ambos';
  endereco: string;
  responsavel: {
    nome: string;
    cargo: string;
    email: string;
    telefone: string;
  };
  operacao: {
    refeicoesDia: number;
    tipoServico: 'buffet' | 'alacarte' | 'misto';
  };
  dataCadastro: string;
}

export interface Diagnostico {
  id: string;
  clienteId: string;
  modeloOperacao: string;
  volumeResiduosKgDia: number;
  formaDescarte: string;
  custoColeta: number;
  pontosCriticos: string[];
  estimativaDesperdicio: number;
  estimativaCusto: number;
  dataRealizacao: string;
}

export interface ChecklistItem {
  id: string;
  descricao: string;
  concluido: boolean;
}

export interface ChecklistMensal {
  id: string;
  clienteId: string;
  mes: number;
  titulo: string;
  meta: string;
  itens: ChecklistItem[];
  observacoes: string;
  dataConclusao?: string;
}

export interface Indicador {
  id: string;
  clienteId: string;
  mes: number;
  ano: number;
  gResiduoPorRefeicao: number;
  kgDesviados: number;
  economiaFinanceira: number;
  co2Evitado: number;
  dataRegistro: string;
}

export interface Relatorio {
  id: string;
  clienteId: string;
  periodo: string;
  mes: number;
  checklistItens: ChecklistItem[];
  indicadores: Indicador;
  comentariosConsultor: string;
  dataGeracao: string;
}
