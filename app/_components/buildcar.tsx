import Link from "next/link";
import { Car, Settings, ShoppingCart, ArrowRight } from "lucide-react";

export function Buildcar() {
  // o layout do passo a passo
  const steps = [
    {
      stepNumber: "01",
      icon: <Car className="w-6 h-6 text-purple-400" />,
      title: "Escolha seu carro",
      description: "Selecione a marca e modelo do seu veículo.",
    },
    {
      stepNumber: "02",
      icon: <Settings className="w-6 h-6 text-purple-400" />,
      title: "Personalize",
      description: "Altere a cor do seu carro do seu jeito.",
    },
    {
      stepNumber: "03",
      icon: <ShoppingCart className="w-6 h-6 text-purple-400" />,
      title: "Compre as peças",
      description: "Catálogo variado de opções para o seu carro.",
    },
  ];

  return (
    <section className="relative w-full py-24 bg-[#0b0b0f] text-white overflow-hidden border-t border-gray-900">
      
      {/* luz roxa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r
       from-purple-700/15 to-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="container px-4 mx-auto relative z-10">
        
        {/* Primeiro texto */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-purple-400 text-xs md:text-sm font-semibold tracking-widest uppercase mb-3 block">
            Fácil, rápido e intuitivo
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Monte seu carro em 3 passos
          </h2>
        </div>

        {/* Background */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-[#121218]/80 backdrop-blur-md border border-gray-800/80 rounded-2xl p-8 flex flex-col 
              justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 group shadow-xl"
            >
              <div>
                {/* numero e o icone*/}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-gray-700 group-hover:text-purple-400/50 transition-colors">
                    {item.stepNumber}
                  </span>
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                    {item.icon}
                  </div>
                </div>

                {/* Título e descrição */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Botão de ação para começar */}
        <div className="text-center">
          <Link
            href="/selecionar-carro"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 
            rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            COMEÇAR AGORA
            <ArrowRight className="w-5 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}