"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Componente individual para cada card de carro para controlar o slideshow individualmente
function CarCard({ carro, selecionarCarro }: { carro: any; selecionarCarro: (c: any) => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Efeito para trocar a imagem a cada 1.5 segundos quando o mouse estiver em cima
  React.useEffect(() => {
    let interval: any;
    if (isHovered && carro.imagens && carro.imagens.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carro.imagens.length);
      }, 1500); // 1.5 segundos por foto
    } else {
      setCurrentImageIndex(0); // Volta para a primeira foto quando tira o mouse
    }
    return () => clearInterval(interval);
  }, [isHovered, carro.imagens]);

  return (
    <button 
      onClick={() => selecionarCarro(carro)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#12121a] p-5 border border-white/10 hover:border-purple-500 hover:scale-105 transition-all rounded-2xl flex flex-col items-center justify-between gap-4 cursor-pointer shadow-xl text-center group"
    >
      {carro.imagens && carro.imagens.length > 0 && (
        <div className="w-full h-40 bg-zinc-900 rounded-xl overflow-hidden relative border border-white/5">
          <img 
            src={carro.imagens[currentImageIndex]} 
            alt={carro.modelo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
      )}

      <div className="flex flex-col items-center gap-1 w-full">
        <span className="text-xs text-purple-400 font-semibold tracking-widest uppercase">{carro.marca}</span>
        <span className="text-xl font-bold">{carro.modelo}</span>
      </div>
    </button>
  );
}

export default function SelecionarCarroPage() {
  const router = useRouter();

  const selecionarCarro = (carro: any) => {
    // Salva os dados do carro 
    localStorage.setItem("projeto_marca", carro.marca);
    localStorage.setItem("projeto_modelo", carro.modelo);
    localStorage.setItem("projeto_ano", carro.ano);
    localStorage.setItem("projeto_link3d", carro.link3d);

    // Redireciona para o configurador passando o link 3D 
    router.push(`/monte-seu-carro?view3d=${encodeURIComponent(carro.link3d)}`);
  };

  const carros = [
    { 
      id: 1, 
      imagens: ["/bmww1.jpg", "/bmw2.png", "/bmw3.png"],
      marca: "BMW", 
      modelo: "M3 G80", 
        
      link3d: "https://sketchfab.com/models/bb30c32dc0624ca89bd865aed5214ca3" 
    },
    { 
      id: 2, 
      imagens: ["/Nissan1.png", "/Nissan2.png", "/Nissan3.png" ], 
      marca: "Nissan", 
      modelo: "Mak Nissan S15 Silvia ", 
        
      link3d: "https://sketchfab.com/3d-models/2018-garage-mak-nissan-s15-silvia-reggie-mah-76c47541645348969a1a85ae53e92e5c" 
    },
    { 
      id: 3, 
      imagens: ["/etron1.png", "/etron2.png","/etron3.png"], 
      marca: "Audi", 
      modelo: "e-tron GT", 
        
      link3d: "https://sketchfab.com/models/e35726151c9e4a169c005d54509715fa" 
    },
    {
      id: 4,
      imagens: ["/bugatti.jpg", "/logan.jpg"],
      marca: "Bugatti",
      modelo: "Chiron Golden Era",
      link3d: "https://sketchfab.com/3d-models/bugatti-chiron-golden-era-fe14b2d41c3e409192d16be61a44c216"
    },
    {
      id: 5,
      imagens: ["/logan.jpg", "/aerofolio.jpg"],
      marca: "Logan",
      modelo: "Dacia",
      link3d: "https://sketchfab.com/3d-models/dacia-logan-22d04d5ff4e7439e826c86d8a2931fa1"
    },
    
  ];

  return (
    <section className="min-h-screen bg-[#0b0b0f] text-white py-24 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4">Qual carro você quer personalizar?</h1>
        <p className="text-gray-400 mb-12">Selecione um veículo abaixo para iniciar.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {carros.map((carro) => (
            <CarCard key={carro.id} carro={carro} selecionarCarro={selecionarCarro} />
          ))}
        </div>
      </div>
    </section>
  );
}