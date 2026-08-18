import { Wrench, Gauge, Cpu, Clock, Phone,  CircleCheckBig, Tag  } from "lucide-react";
import Link from "next/link";

export function Services() {
  const servicesList = [
    {
      icon: <Wrench className="w-6 h-6 text-purple-400" />,
      title: "Instalação de Peças",
      description: "Serviço de montagem e instalação profissional de acessórios e componentes automotivos com total segurança e precisão.",
      duration: "1h a 3h",
    },
    {
      icon: <Tag className="w-6 h-6 text-purple-400" />,
      title: "Customização Estética",
      description: "Melhore o visual e a performance do seu veículo com envelopamento, aerofólios e acessórios esportivos exclusivos.",
      duration: "2h a 5h",
    },
    {
      icon: <CircleCheckBig className="w-6 h-6 text-purple-400" />,
      title: "Revisão e Diagnóstico",
      description: "Análise completa do estado das peças e componentes do seu carro para garantir viagens seguras e alto desempenho.",
      duration: "1h",
    },
  ];

  return (
    <section className="relative w-full py-16 bg-[#0b0b0f] text-white">
      <div className="container px-4 mx-auto">
        
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          Serviços
        </h2>

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="bg-[#121218] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:border-purple-500/60 shadow-xl"
            >
              <div>
               
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>

                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              
              <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{service.duration}</span>
                </div>

                <Link
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  className="flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Entrar em contato
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}