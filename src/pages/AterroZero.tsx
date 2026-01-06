import { Award, TrendingDown, Recycle, BarChart3, Eye, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const criterios = [
  {
    icon: TrendingDown,
    titulo: 'Redução Comprovada',
    descricao: 'Demonstrar redução mensurável no volume de resíduos orgânicos gerados, com dados históricos e comparativos.',
  },
  {
    icon: Recycle,
    titulo: 'Valorização',
    descricao: 'Implementar compostagem ou biodigestão para transformar resíduos em recursos úteis como adubo ou energia.',
  },
  {
    icon: BarChart3,
    titulo: 'Monitoramento Contínuo',
    descricao: 'Manter sistema de pesagem e registro diário dos resíduos, com acompanhamento de indicadores-chave.',
  },
  {
    icon: Eye,
    titulo: 'Transparência de Dados',
    descricao: 'Disponibilizar relatórios periódicos com indicadores de desempenho ambiental e financeiro.',
  },
];

const beneficios = [
  'Diferencial competitivo no mercado',
  'Atração de clientes conscientes',
  'Redução de custos operacionais',
  'Contribuição para metas ESG',
  'Reconhecimento público da marca',
  'Compliance ambiental',
];

export default function AterroZero() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
                <Award className="h-5 w-5" />
                <span className="font-medium">Certificação Ambiental</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Aterro Zero Orgânico
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                O programa Aterro Zero Orgânico é uma certificação que reconhece estabelecimentos 
                comprometidos com a redução, valorização e monitoramento de resíduos orgânicos.
              </p>
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg"
              >
                Começar Jornada
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="h-24 w-24 text-white" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-green-400 text-primary-dark px-4 py-2 rounded-full font-bold">
                  Selo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que é */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="section-title">O que é Aterro Zero Orgânico?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              É uma abordagem sistemática para <strong>reduzir</strong>, <strong>valorizar</strong> e 
              <strong> monitorar</strong> resíduos orgânicos em estabelecimentos de alimentação. 
              O objetivo é desviar o máximo possível de resíduos do aterro sanitário, 
              transformando-os em recursos úteis através de compostagem ou biodigestão.
            </p>
          </div>
        </div>
      </section>

      {/* Critérios */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Critérios para Certificação</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Para obter o selo Aterro Zero Orgânico, o estabelecimento deve atender aos seguintes critérios:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {criterios.map((criterio, index) => {
              const Icon = criterio.icon;
              return (
                <div key={index} className="card flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{criterio.titulo}</h3>
                    <p className="text-gray-600">{criterio.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="section-title">Benefícios da Certificação</h2>
              <p className="text-lg text-gray-600 mb-8">
                Além de contribuir para um planeta mais sustentável, a certificação Aterro Zero Orgânico 
                traz benefícios tangíveis para o seu negócio:
              </p>
              <ul className="space-y-3">
                {beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Selo Aterro Zero</h3>
                  <p className="text-gray-600 mb-6">
                    Reconhecimento oficial de compromisso ambiental
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-3xl font-bold text-primary">+80%</p>
                      <p className="text-sm text-gray-600">Desvio de aterro</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-3xl font-bold text-primary">6</p>
                      <p className="text-sm text-gray-600">Meses de programa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 text-green-300 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para conquistar o selo?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Inicie sua jornada rumo ao Aterro Zero Orgânico com nossa consultoria especializada.
          </p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg"
          >
            Solicitar Diagnóstico
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
