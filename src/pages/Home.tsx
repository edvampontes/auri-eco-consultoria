import { Link } from 'react-router-dom';
import { 
  TrendingDown, 
  DollarSign, 
  Star, 
  ClipboardCheck, 
  Settings, 
  Calendar, 
  FileText,
  ArrowRight,
  Leaf,
  Recycle,
  Target
} from 'lucide-react';

const resultados = [
  {
    icon: TrendingDown,
    valor: '–30% a –50%',
    descricao: 'de resíduos em até 6 meses',
    color: 'text-green-600',
  },
  {
    icon: DollarSign,
    valor: '–10% a –20%',
    descricao: 'no custo de insumos',
    color: 'text-blue-600',
  },
  {
    icon: Star,
    valor: '+12%',
    descricao: 'de avaliações positivas dos clientes',
    color: 'text-yellow-600',
  },
];

const etapas = [
  {
    icon: ClipboardCheck,
    titulo: 'Diagnóstico Inicial Presencial',
    descricao: 'Mapeamos desperdícios, custos e oportunidades.',
    numero: '01',
  },
  {
    icon: Settings,
    titulo: 'Implantação de Processos',
    descricao: 'Medição, compras, produção e serviço.',
    numero: '02',
  },
  {
    icon: Calendar,
    titulo: 'Acompanhamento Mensal',
    descricao: 'Checklist progressivo com metas claras.',
    numero: '03',
  },
  {
    icon: FileText,
    titulo: 'Relatórios e Certificação',
    descricao: 'Indicadores, PDFs e Aterro Zero Orgânico.',
    numero: '04',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-6 w-6" />
              <span className="text-green-200 font-medium">Para restaurantes e hotéis</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Reduzimos em até <span className="text-green-300">50%</span> o desperdício de resíduos orgânicos
            </h1>
            
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Consultoria prática, mensurável e contínua para restaurantes e hotéis, 
              com resultados financeiros e ambientais comprováveis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Solicitar Diagnóstico Inicial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/aterro-zero"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300"
              >
                Conheça o Aterro Zero
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados Esperados */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Resultados Esperados</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Nossos clientes alcançam resultados mensuráveis em até 6 meses de consultoria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resultados.map((resultado, index) => {
              const Icon = resultado.icon;
              return (
                <div
                  key={index}
                  className="card text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 ${resultado.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className={`text-4xl font-bold ${resultado.color} mb-2`}>
                    {resultado.valor}
                  </div>
                  <p className="text-gray-600">{resultado.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Como Funciona</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Um processo estruturado de 6 meses para transformar sua operação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {etapas.map((etapa, index) => {
              const Icon = etapa.icon;
              return (
                <div key={index} className="relative">
                  <div className="card h-full">
                    <div className="text-6xl font-bold text-gray-100 absolute top-4 right-4">
                      {etapa.numero}
                    </div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {etapa.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {etapa.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-primary px-6 py-3 rounded-full">
              <Recycle className="h-5 w-5" />
              <span className="font-medium">
                Não é treinamento pontual. É acompanhamento contínuo com metas e histórico.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="h-16 w-16 text-green-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para reduzir o desperdício?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Comece agora com um diagnóstico inicial gratuito e descubra o potencial de economia da sua operação.
          </p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg"
          >
            Começar Agora
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
