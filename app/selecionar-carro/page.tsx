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
    // Salva os dados do carro no localStorage
    localStorage.setItem("projeto_marca", carro.marca);
    localStorage.setItem("projeto_modelo", carro.modelo);
    if (carro.ano) localStorage.setItem("projeto_ano", carro.ano);
    localStorage.setItem("projeto_link3d", carro.link3d);

    // Se o carro tiver um 'slug' definido, vai para a rota limpa [modelo]
    if (carro.slug) {
      router.push(`/monte-seu-carro/${carro.slug}`);
    } else {
      // Se não tiver slug (carros antigos), continua usando a URL padrão antiga
      router.push(`/monte-seu-carro?view3d=${encodeURIComponent(carro.link3d)}`);
    }
  };

  const carros = [
    { 
      id: 1, 
      imagens: ["/mbw1.png", "/bmw2.png", "/bmw3.png"],
      marca: "BMW", 
      modelo: "M3 G80",
      slug: "bmw", 
      link3d: "https://sketchfab.com/models/bb30c32dc0624ca89bd865aed5214ca3" 
    },
    {
      id: 2,
      imagens: ["/lamburguini1.png", "/lamburguini2.png","/lamburguini3.png"],
      marca: "Lamborghini",
      modelo: "Aventador",
      slug: "lamborghini",
      link3d: "https://sketchfab.com/3d-models/lamborghini-aventador-svj-twin-turbo-mansory-7110e6d471184c53a838f7015493d2c9"
    },
    {
      id: 3,
      imagens: ["/mercedes11.png", "/mercedes22.png", "/mercedes33.png"],
      marca: "Mercedes",
      modelo: "S65 AMG Coupe",
      slug: "mercedes",
      link3d: "https://sketchfab.com/3d-models/2015-mercedes-benz-s65-amg-coupe-a9a2e24df28049ce83e9c35cc1a2b3fa"
    },
    {
      id: 4,
      imagens: ["/alfa1.png", "/alfa2.png", "/alfa3.png"],
      marca: "Alfa Romeo",
      modelo: "155 Q4",
      slug: "alfa",
      link3d: "https://sketchfab.com/3d-models/1992-alfa-romeo-155-q4-9be37de2d57d4c93bd472637a42b9db3"
    },
    {
      id: 5,
      imagens: ["/BgGaragem.jpg", "/infiniti2.png", "/infiniti3.png"],
      marca: "Infiniti",
      modelo: "QX80",
      slug: "infiniti",
      link3d: "https://sketchfab.com/3d-models/2021-infiniti-qx80-ed9cdb2c7fc04459bd51e316b7928fb5"
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