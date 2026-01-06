import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-8 w-8" />
              <span className="text-xl font-bold">Auri & Eco Consultoria</span>
            </div>
            <p className="text-green-100 text-sm">
              Consultoria especializada em redução de resíduos orgânicos para restaurantes e hotéis.
              Resultados mensuráveis e impacto ambiental real.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-green-100">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@aurieeco.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-green-100">
              <li><a href="/cadastro" className="hover:text-white transition-colors">Cadastro</a></li>
              <li><a href="/diagnostico" className="hover:text-white transition-colors">Diagnóstico</a></li>
              <li><a href="/checklist" className="hover:text-white transition-colors">Checklist Mensal</a></li>
              <li><a href="/aterro-zero" className="hover:text-white transition-colors">Aterro Zero Orgânico</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-600 mt-8 pt-8 text-center text-green-100 text-sm">
          <p>&copy; {new Date().getFullYear()} Auri & Eco Consultoria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
