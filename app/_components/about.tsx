'use client'

import Image from "next/image";
import Link from "next/link";
import { Check, MapPin } from "lucide-react";
import { InstagramLogoIcon } from "@phosphor-icons/react";

export function About() {
  return (
    <section className="relative w-full py-24 bg-[#0b0b0f] text-white overflow-hidden">
      
      {/* Luz de fundo  */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 from-purple-600/40
       to-blue-600/40 blur-[130px] rounded-full pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Lado esquerdo da foto com zoom*/}
          <div className="relative w-full h-[300px] lg:h-[400px] rounded-2xl overflow-hidden group shadow-2xl border border-black/10">
            <Image
              src="/carPurple.jpg"
              alt="Sobre a Eleketral Auto Peças"
              fill
              quality={100}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
            
            
          </div>

          {/* Lado direito com os textos */}
          <div className="flex flex-col gap-6">
            <span className="text-purple-400 text-xs md:text-sm font-semibold tracking-widest uppercase block">
              QUEM SOMOS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              SOBRE A ELEKETRAL
            </h2>

            <p className="text-gray-400 text-base leading-relaxed">
              Trabalhamos com protótipos 3D para você personalizar seu carro da forma que quiser, além do catálogo de peças para turbinar o seu veículo.
            </p>

            {/* os certificados */}
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
                Equipe de confiança
              </li>
              <li className="flex items-center gap-3 text-gray-300 font-medium">
                <span className="p-1 rounded-full bg-purple-900/50 text-purple-400 border border-purple-500/30">
                  <Check className="w-4 h-4" />
                </span>
                Oficina de qualidade
              </li>
            </ul>

            {/* botao do insta  */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl 
                flex items-center gap-2 transition-all shadow-lg shadow-purple-900/30 cursor-pointer"
              >
                <InstagramLogoIcon className="w-4 h-4" />
                Contato via Instagram
              </Link>

             
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}