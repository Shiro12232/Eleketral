"use client";

// Imports da galera
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Palette, 
  Disc, 
  Sliders, 
  SunMedium, 
  ShoppingCart,
  Bookmark,
  Share2,
  Car,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Settings
} from "lucide-react";

function ConteudoMonteSeuCarro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view3dUrl = searchParams.get("view3d");

  const [isReady, setIsReady] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [selectedColor, setSelectedColor] = useState("azul");
  const [rodas, setRodas] = useState("padrao");
  const [sketchfabEmbed, setSketchfabEmbed] = useState("");
  const [currentId, setCurrentId] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Carros chatos que vêm com aquela base cinza feia no 3D
  const modelsWithFloor = [
    "e35726151c9e4a169c005d54509715fa", // <<-- joga os IDs novos aqui depois
  ];

  useEffect(() => {
    const savedMarca = localStorage.getItem("projeto_marca");
    const savedLink = localStorage.getItem("projeto_link3d");

    if (!savedMarca && !view3dUrl && !savedLink) {
      router.replace("/selecionar-carro");
      return;
    }

    if (savedMarca) setMarca(savedMarca);
    setModelo(localStorage.getItem("projeto_modelo") || "");
    const corSalva = localStorage.getItem("projeto_cor") || "azul";
    setSelectedColor(corSalva);

    const activeLink = view3dUrl || savedLink;
    if (activeLink) {
      if (view3dUrl) localStorage.setItem("projeto_link3d", view3dUrl);
      const match = activeLink.match(/-([a-f0-9]{32})$/);
      const id = match ? match[1] : activeLink.split("/").pop();
      
      if (id) setCurrentId(id);

      // Monta o link do embed tirando a poluição visual do sketchfab
      setSketchfabEmbed(`https://sketchfab.com/models/${id}/embed?autostart=1&transparent=1&ui_controls=0&ui_infos=0&ui_watermark=0&ui_theme=dark&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0`);
    }

    setIsReady(true);

    // Some com o aviso de clique depois de 3 segundinhos
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [view3dUrl, router]);

  useEffect(() => {
    if (marca) {
      localStorage.setItem("projeto_marca", marca);
      localStorage.setItem("projeto_modelo", modelo);
      localStorage.setItem("projeto_cor", selectedColor);
    }
  }, [marca, modelo, selectedColor]);

  // Checa se precisa dar o zoom/corte pra sumir o chão
  const needsCrop = modelsWithFloor.includes(currentId);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center text-purple-400 font-semibold">
        Carregando as paradas...
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen bg-[#0b0b0f] text-white flex flex-col justify-between overflow-hidden">
      
      {/* PALCO 3D */}
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-transparent overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/fundogaragem.png')" }} />
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

        {sketchfabEmbed ? (
          <iframe 
            title="Visualizador 3D" 
            src={sketchfabEmbed} 
            className={`w-full border-0 relative z-20 pointer-events-auto bg-transparent mix-blend-screen md:mix-blend-normal transition-all duration-300 ${
              needsCrop ? 'h-[120%] mt-[-10%]' : 'h-full'
            }`} 
            allow="autoplay; fullscreen; vr" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 relative z-20">
            Carregando o 3D...
          </div>
        )}
      </div>

      {/* Botões do canto superior direito */}
      <div className="absolute top-6 right-6 flex gap-3 z-30">
        <button className="flex items-center gap-2 bg-[#12121a]/80 hover:bg-[#12121a] backdrop-blur-md text-xs md:text-sm font-medium px-4 py-2.5 rounded-xl border border-white/10 transition-all shadow-lg cursor-pointer">
          <Bookmark size={16} /> SALVAR PROJETO
        </button>
        <button className="flex items-center gap-2 bg-[#12121a]/80 hover:bg-[#12121a] backdrop-blur-md text-xs md:text-sm font-medium px-4 py-2.5 rounded-xl border border-white/10 transition-all shadow-lg cursor-pointer">
          <Share2 size={16} /> COMPARTILHAR
        </button>
      </div>

      {/* Seta pra abrir o menu lateral + aviso piscando */}
      <div className="absolute top-1/2 -translate-y-1/2 z-40 flex items-center">
        <button 
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
            setShowAlert(false);
          }}
          className={`bg-[#12121a]/90 hover:bg-purple-600 backdrop-blur-md border border-white/10 text-white p-3 rounded-r-2xl transition-all duration-300 shadow-2xl cursor-pointer flex items-center justify-center ${
            isSidebarOpen ? 'translate-x-[420px] md:translate-x-[450px]' : 'translate-x-0'
          }`}
        >
          {isSidebarOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>

        {showAlert && !isSidebarOpen && (
          <div className="ml-3 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg animate-pulse whitespace-nowrap border border-purple-400 pointer-events-none">
            Clique aqui para personalizar!
          </div>
        )}
      </div>

      {/* PAINEL DE CONTROLE (Gaveta lateral) */}
      <div className={`absolute top-0 left-0 h-full w-full sm:w-[420px] md:w-[450px] bg-[#0b0b0f]/90 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between z-30 transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div className="flex flex-col gap-6 pt-16 md:pt-4">
          
          {/* Header do painel */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase flex items-center gap-2">
              <Settings size={18} /> Configurador
            </h2>
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
              Início
            </Link>
          </div>

          {/* Info do carro atual */}
          <div className="bg-[#12121a] p-4 rounded-2xl border border-white/10 flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-gray-300 uppercase flex items-center gap-2">
                <Car size={16} /> Veículo
              </span>
              <Link href="/selecionar-carro" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <RefreshCw size={12} /> Trocar
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1b1b26] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Marca</span>
                <span className="text-xs font-bold text-white">{marca || "N/D"}</span>
              </div>
              <div className="bg-[#1b1b26] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Modelo</span>
                <span className="text-xs font-bold text-purple-400 truncate block">{modelo || "N/D"}</span>
              </div>
            </div>
          </div>

          {/* Opções de customização */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-3 overflow-x-auto pb-2 border-b border-white/10 text-xs font-semibold text-gray-400">
              <button className="text-purple-400 border-b-2 border-purple-500 pb-2 flex items-center gap-1.5 shrink-0">
                <Palette size={14} /> COR
              </button>
              <button className="hover:text-white pb-2 flex items-center gap-1.5 shrink-0">
                <Disc size={14} /> RODAS
              </button>
              <button className="hover:text-white pb-2 flex items-center gap-1.5 shrink-0">
                <Sliders size={14} /> SUSPENSÃO
              </button>
              <button className="hover:text-white pb-2 flex items-center gap-1.5 shrink-0">
                <SunMedium size={14} /> FARÓIS
              </button>
            </div>

            {/* Cores */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs text-gray-400 uppercase font-semibold">Pintura</span>
              <div className="flex flex-wrap gap-3">
                {['azul', 'branco', 'vermelho', 'preto', 'cinza'].map((c) => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedColor(c)} 
                    className={`w-9 h-9 rounded-xl transition-all cursor-pointer ${
                      selectedColor === c ? "ring-2 ring-purple-500 scale-110 shadow-lg" : "opacity-75 hover:opacity-100"
                    } ${
                      c === 'azul' ? 'bg-blue-600' : 
                      c === 'branco' ? 'bg-gray-100' : 
                      c === 'vermelho' ? 'bg-red-600' : 
                      c === 'preto' ? 'bg-gray-900 border border-white/20' : 'bg-gray-500'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Rodas */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs text-gray-400 uppercase font-semibold">Rodas ({rodas})</span>
              <div className="flex gap-2">
                {['padrao', 'esportiva', 'luxo'].map((r) => (
                  <button 
                    key={r} 
                    onClick={() => setRodas(r)} 
                    className={`px-3 py-2 rounded-lg text-xs border cursor-pointer transition-all ${
                      rodas === r 
                        ? "bg-purple-600 border-purple-500 text-white font-bold shadow-md" 
                        : "bg-[#1b1b26] border-white/10 text-gray-300 hover:border-purple-500"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Rodapé do painel com botão de compra */}
        <div className="bg-[#12121a] p-4 rounded-2xl border border-white/10 flex flex-col gap-4 shadow-xl mt-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Total</span>
              <span className="text-xl font-extrabold text-purple-400">R$ ?</span>
            </div>
          </div>

          <Link 
            href="#" 
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-600/40 text-sm"
          >
            <ShoppingCart size={18} /> Adicionar ao Carrinho
          </Link>
        </div>

      </div>

    </section>
  );
}

export default function MonteSeuCarroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center">Carregando...</div>}>
      <ConteudoMonteSeuCarro />
    </Suspense>
  );
}