import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Cliente, Diagnostico, ChecklistMensal, Indicador } from '../types';

interface DataContextType {
  clientes: Cliente[];
  diagnosticos: Diagnostico[];
  checklists: ChecklistMensal[];
  indicadores: Indicador[];
  clienteAtual: Cliente | null;
  setClienteAtual: (cliente: Cliente | null) => void;
  addCliente: (cliente: Cliente) => void;
  updateCliente: (cliente: Cliente) => void;
  addDiagnostico: (diagnostico: Diagnostico) => void;
  addChecklist: (checklist: ChecklistMensal) => void;
  updateChecklist: (checklist: ChecklistMensal) => void;
  addIndicador: (indicador: Indicador) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  clientes: 'auri_clientes',
  diagnosticos: 'auri_diagnosticos',
  checklists: 'auri_checklists',
  indicadores: 'auri_indicadores',
  clienteAtual: 'auri_cliente_atual',
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.clientes);
    return saved ? JSON.parse(saved) : [];
  });

  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.diagnosticos);
    return saved ? JSON.parse(saved) : [];
  });

  const [checklists, setChecklists] = useState<ChecklistMensal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.checklists);
    return saved ? JSON.parse(saved) : [];
  });

  const [indicadores, setIndicadores] = useState<Indicador[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.indicadores);
    return saved ? JSON.parse(saved) : [];
  });

  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.clienteAtual);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.clientes, JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.diagnosticos, JSON.stringify(diagnosticos));
  }, [diagnosticos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.checklists, JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.indicadores, JSON.stringify(indicadores));
  }, [indicadores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.clienteAtual, JSON.stringify(clienteAtual));
  }, [clienteAtual]);

  const addCliente = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente]);
  };

  const updateCliente = (cliente: Cliente) => {
    setClientes(prev => prev.map(c => c.id === cliente.id ? cliente : c));
  };

  const addDiagnostico = (diagnostico: Diagnostico) => {
    setDiagnosticos(prev => [...prev, diagnostico]);
  };

  const addChecklist = (checklist: ChecklistMensal) => {
    setChecklists(prev => [...prev, checklist]);
  };

  const updateChecklist = (checklist: ChecklistMensal) => {
    setChecklists(prev => prev.map(c => c.id === checklist.id ? checklist : c));
  };

  const addIndicador = (indicador: Indicador) => {
    setIndicadores(prev => [...prev, indicador]);
  };

  return (
    <DataContext.Provider value={{
      clientes,
      diagnosticos,
      checklists,
      indicadores,
      clienteAtual,
      setClienteAtual,
      addCliente,
      updateCliente,
      addDiagnostico,
      addChecklist,
      updateChecklist,
      addIndicador,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
