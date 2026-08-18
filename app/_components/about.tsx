'use client'

import Image from "next/image";
import Link from "next/link";
import { Check, Phone, MapPin } from "lucide-react";
import Redcar from "@/public/carPurple.jpg";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { InstagramLogoIcon } from "@phosphor-icons/react";
export function About() {
  return (
    <section className="relative w-full py-24 bg-[#0b0b0f] text-white overflow-hidden"    >
      
     
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
      from-purple-600/40 to-blue-600/40 blur-[130px] rounded-full pointer-events-none " />

      <div className="container px-4 mx-auto relative z-10">


           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
        
          <div className="relative w-full h-[300px] lg:h-[400px] overflow-hidden group">
 
 
            <Image
              src="/carPurple.jpg"
              alt="Sobre a Eleketral Auto Peças"
              fill
              quality={100}
              className="object-cover transition-transform duration-500 group-hover:scale-150"
              priority
 
 />
            <div className="absolute inset-0 
             from-[#0b0b0f] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0  from-[#0b0b0f]/60 via-transparent to-[#0b0b0f]/60" 
            />


          </div>

        
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            
              SOBRE A ELEKETRAL
            </h2>

            <p className="text-gray-400 text-base leading-relaxed">
              Especialistas em performance e estética automotiva. Oferecemos peças e acessórios exclusivos para quem busca personalizar e potencializar seu carro
               com estilo, segurança e o melhor desempenho.
            </p>

          
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300 font-medium">

                <span className="p-1 rounded-full bg-purple-900/50 text-purple-400 border border-purple-500/30">
                  
                  <Check className="w-4 h-4" />
                </span>
                Trabalhamos com as melhores peças
              </li>
              <li className="flex items-center gap-3 text-gray-300 font-medium">
                
                <span className="p-1 rounded-full bg-purple-900/50 text-purple-400 border border-purple-500/30">
                
                
                  <Check className="w-4 h-4" />
                
            </span>
                Equipe de confiaça
              </li>
              <li className="flex items-center gap-3 text-gray-300 font-medium">
                <span className="p-1 rounded-full bg-purple-900/50 text-purple-400 border border-purple-500/30">
                  <Check className="w-4 h-4" />
                </span>
                Oficina de qualidade
              </li>
            </ul>

            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="https://wa.me/5511976578"
                target="_blank"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-900/30"
              >
                <InstagramLogoIcon className="w-4 h-4" />
                Contato via Instagram
              </Link>

              <Link
                href="#localizacao"
                className="bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
              >
                <MapPin className="w-4 h-4 text-purple-400" />
                Endereço da loja
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}