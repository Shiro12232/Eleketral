"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SelecionarCarroPage() {
  const router = useRouter();

  const selecionarCarro = (carro: any) => {
    // Salva os dados do carro escolhido no localStorage
    localStorage.setItem("projeto_marca", carro.marca);
    localStorage.setItem("projeto_modelo", carro.modelo);
    localStorage.setItem("projeto_ano", carro.ano);
    localStorage.setItem("projeto_link3d", carro.link3d);

    // Redireciona para o configurador passando o link 3D via URL
    router.push(`/monte-seu-carro?view3d=${encodeURIComponent(carro.link3d)}`);
  };

  const carros = [
    { 
      id: 1, 
      marca: "BMW", 
      modelo: "M3 G80", 
       
      link3d: "https://sketchfab.com/models/bb30c32dc0624ca89bd865aed5214ca3" 
    },
    { 
      id: 2, 
      marca: "Nissan", 
      modelo: "GT-R R35", 
       
      link3d: "https://sketchfab.com/models/573056b723514d179ac9dec418f0a944" 
    },
    { 
      id: 3, 
      marca: "Audi", 
      modelo: "e-tron GT", 
       
      link3d: "https://sketchfab.com/models/e35726151c9e4a169c005d54509715fa" 
    },
    { 
      id: 4, 
      marca: "Lamborghini", 
      modelo: "Huracán", 
       
      link3d: "https://sketchfab.com/models/fb394828f73144d188283a213e4b7713" 
    }
  ];

  return (
    <section className="min-h-screen bg-[#0b0b0f] text-white py-24 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4">Qual carro você quer personalizar?</h1>
        <p className="text-gray-400 mb-12">Selecione um veículo abaixo para iniciar.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {carros.map((carro) => (
            <button 
              key={carro.id} 
              onClick={() => selecionarCarro(carro)}
              className="bg-[#12121a] p-8 border border-white/10 hover:border-purple-500 hover:scale-105 transition-all rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <span className="text-xs text-purple-400 font-semibold tracking-widest uppercase">{carro.marca}</span>
              <span className="text-xl font-bold">{carro.modelo}</span>
              <span className="text-xs text-gray-500">Ano {carro.ano}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}