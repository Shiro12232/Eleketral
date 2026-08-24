'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Palette, Sliders, ShoppingCart, 
  Car, RefreshCw, ChevronLeft, 
  ChevronRight, Settings, Droplets
} from "lucide-react";

// Cores
const colorMap: Record<string, [number, number, number]> = {
  preto: [0.05, 0.05, 0.05],
  branco: [0.9, 0.9, 0.9],
  prata: [0.7, 0.7, 0.7],
  chumbo: [0.25, 0.25, 0.28],
  vermelho: [0.85, 0.0, 0.0],
  amarelo: [0.95, 0.8, 0.0],
  laranja: [0.9, 0.35, 0.0],
  azul: [0.0, 0.3, 0.85],
  roxo: [0.5, 0.0, 0.6],
  verde: [0.0, 0.5, 0.2],
  vinho: [0.45, 0.05, 0.1],
  caramelo: [0.6, 0.3, 0.1],
};

function ConteudoMonteSeuCarro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view3dUrl = searchParams.get("view3d");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sketchfabApi, setSketchfabApi] = useState<any>(null);
  
  const [paintMaterials, setPaintMaterials] = useState<any[]>([]); 
  const [gridMaterials, setGridMaterials] = useState<any[]>([]); 
  const [glassNodeIds, setGlassNodeIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  
  const [selectedColor, setSelectedColor] = useState("vermelho");
  const [selectedGridColor, setSelectedGridColor] = useState("preto");
  
  const [glassType, setGlassType] = useState("transparente");
  const [currentId, setCurrentId] = useState("");
  
  // INICIA FECHADA (false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Estado para controlar o aviso temporário de 3 segundos
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Pega os dados da url
  useEffect(() => {
    const savedMarca = localStorage.getItem("projeto_marca");
    let activeLink = view3dUrl || localStorage.getItem("projeto_link3d");

    if (!savedMarca && !activeLink) {
      router.replace("/selecionar-carro");
      return;
    }

    if (savedMarca) setMarca(savedMarca);
    setModelo(localStorage.getItem("projeto_modelo") || "");
    setSelectedColor(localStorage.getItem("projeto_cor") || "vermelho");

    if (activeLink) {
      try {
        activeLink = decodeURIComponent(activeLink);
      } catch (e) {}

      if (view3dUrl) {
        localStorage.setItem("projeto_link3d", activeLink);
      }

      const match = activeLink.match(/-([a-f0-9]{32})$/) || activeLink.match(/([a-f0-9]{32})/);
      setCurrentId(match ? match[1] : activeLink.split("/").pop() || "");
    }

    const script = document.createElement("script");
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    script.async = true;
    script.onload = () => setIsReady(true);
    document.body.appendChild(script);

    return () => { 
      if (script.parentNode) script.parentNode.removeChild(script); 
    };
  }, [view3dUrl, router]);

  
  useEffect(() => {
    if (isReady && currentId && iframeRef.current && (window as any).Sketchfab) {
      const client = new (window as any).Sketchfab(iframeRef.current);
      
      client.init(currentId, {
        success: (api: any) => {
          api.start();
          api.addEventListener('viewerready', () => {
            setSketchfabApi(api);
            
            api.setEnvironment({
              shadowEnabled: true,
              lightIntensity: 1.2,
              exposure: 1.0
            }, () => {});

            // Separa os materiais de pintura e da grade
            api.getMaterialList((err: any, materials: any[]) => {
              if (!err && materials) {
                const pinturas: any[] = [];
                const grades: any[] = [];

                materials.forEach(m => {
                  const n = m.name.toLowerCase();
                  
                  // Pula vidro, farol e logo pra nao bugar
                  if (n.includes("glass") || n.includes("window") || n.includes("vidro") || 
                      n.includes("windshield") || n.includes("headlight") || n.includes("taillight") || 
                      n.includes("lamp") || n.includes("plate") || n.includes("logo") || n.includes("emblem")) {
                    return;
                  }

                  // Tenta achar a grade por vários nomes possíveis
                  if (
                    n.includes("grill") || 
                    n.includes("grid") || 
                    n.includes("mesh") || 
                    n.includes("grelha") || 
                    n.includes("radiator") || 
                    n.includes("bumper_black") ||
                    n.includes("black_plastic") ||
                    n.includes("plastic") ||
                    n.includes("vent") ||
                    n.includes("air_intake") ||
                    n.includes("net") ||
                    n.includes("mat_237_14")
                  ) {
                    grades.push(m);
                  } else {
                    pinturas.push(m);
                  }
                });

                if (grades.length === 0 && materials.length > 1) {
                  materials.forEach((m, idx) => {
                    const n = m.name.toLowerCase();
                    if (idx > 0 && (n.includes("black") || n.includes("dark") || n.includes("chrome") || idx === 2)) {
                      grades.push(m);
                    }
                  });
                }

                if (pinturas.length === 0 && materials.length > 0) {
                  materials.forEach((m, idx) => {
                    if (idx === 0) pinturas.push(m);
                  });
                }

                setPaintMaterials(pinturas);
                setGridMaterials(grades);
              }
            });

            // Pega os ids dos vidros pra sumir ou aparecer depois
            api.getNodeMap((err: any, nodes: Record<string, any>) => {
              if (!err && nodes) {
                const glassIds: number[] = [];
                Object.values(nodes).forEach((node: any) => {
                  if (node.type === 'MatrixTransform' && node.name) {
                    const nameLower = node.name.toLowerCase();
                    if (nameLower.includes("glass") || nameLower.includes("window") || nameLower.includes("vidro") || nameLower.includes("windshield")) {
                      glassIds.push(node.instanceID);
                    }
                  }
                });
                setGlassNodeIds(glassIds);
              }
            });

          });
        },
        error: () => console.error('Deu ruim no sketchfab'),
        autostart: 1, transparent: 1, ui_controls: 0, ui_infos: 0, ui_watermark: 0, ui_theme: "dark"
      });
    }
  }, [isReady, currentId]);

  // Troca a cor da lata do carro
  useEffect(() => {
    if (sketchfabApi && paintMaterials.length > 0) {
      const novaCor = colorMap[selectedColor] || colorMap.vermelho;
      paintMaterials.forEach((mat: any) => {
        if (mat.channels && mat.channels.AlbedoPBR) {
          mat.channels.AlbedoPBR.color = novaCor;
          sketchfabApi.setMaterial(mat, () => {});
        }
      });
    }
    
    if (marca) {
      localStorage.setItem("projeto_marca", marca);
      localStorage.setItem("projeto_modelo", modelo);
      localStorage.setItem("projeto_cor", selectedColor);
    }
  }, [selectedColor, sketchfabApi, paintMaterials, marca, modelo]);

  // Mexe na cor da grade
  useEffect(() => {
    if (sketchfabApi && gridMaterials.length > 0) {
      const novaCorGrid = colorMap[selectedGridColor] || colorMap.preto;
      gridMaterials.forEach((mat: any) => {
        if (mat.channels && mat.channels.AlbedoPBR) {
          mat.channels.AlbedoPBR.color = novaCorGrid;
          mat.channels.AlbedoPBR.enable = true;
          mat.channels.AlbedoPBR.texture = false;
          sketchfabApi.setMaterial(mat, () => {
            if (typeof sketchfabApi.updateMaterial === "function") sketchfabApi.updateMaterial(mat);
          });
        }
      });
    }
  }, [selectedGridColor, sketchfabApi, gridMaterials]);

  // Liga/desliga o vidro
  useEffect(() => {
    if (sketchfabApi && glassNodeIds.length > 0) {
      glassNodeIds.forEach((nodeId) => {
        if (glassType === "transparente") sketchfabApi.hide(nodeId);
        else sketchfabApi.show(nodeId);
      });
    }
  }, [glassType, sketchfabApi, glassNodeIds]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center text-purple-400 font-semibold">
        Carregando 3D...
      </div>
    );
  }

  const carColors = [
    { id: 'vermelho', bg: 'bg-red-600' },
    { id: 'amarelo', bg: 'bg-yellow-400' },
    { id: 'laranja', bg: 'bg-orange-500' },
    { id: 'azul', bg: 'bg-blue-600' },
    { id: 'roxo', bg: 'bg-purple-600' },
    { id: 'verde', bg: 'bg-emerald-600' },
    { id: 'vinho', bg: 'bg-rose-900' },
    { id: 'branco', bg: 'bg-gray-100' },
    { id: 'prata', bg: 'bg-gray-300' },
    { id: 'chumbo', bg: 'bg-zinc-600' },
    { id: 'preto', bg: 'bg-gray-950 border border-white/20' },
  ];

  return (
    <section className="relative w-full h-screen bg-[#0b0b0f] text-white flex flex-col justify-between overflow-hidden">
      
      {/* Onde fica o 3D rodando */}
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-transparent overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/fundogaragem.png')" }} />
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        
        <div className="w-full h-full relative z-20 flex items-center justify-center overflow-hidden">
          <iframe 
            ref={iframeRef} 
            title="Visualizador 3D" 
            className="w-full h-full border-0 pointer-events-auto bg-transparent transition-all duration-300" 
            allow="autoplay; fullscreen; vr" 
          />
        </div>
      </div>

      {/* Botão para abrir/fechar a sidebar com o aviso temporário */}
      <div className="absolute top-1/2 -translate-y-1/2 z-40 flex items-center">
        <div className="relative">
          <button 
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setShowAlert(false);
            }}
            className={`bg-[#12121a]/95 hover:bg-purple-600 backdrop-blur-md border border-white/10 text-white p-3 rounded-r-2xl transition-all duration-300 shadow-2xl cursor-pointer flex items-center justify-center ${
              isSidebarOpen ? 'translate-x-[420px] md:translate-x-[450px]' : 'translate-x-0'
            }`}
          >
            {isSidebarOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </button>

          {/* Aviso animado nos primeiros 3 segundos */}
          {!isSidebarOpen && showAlert && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap animate-bounce border border-purple-400/40 pointer-events-none z-50 flex items-center gap-1.5">
              <span>Clique para abrir o configurador!</span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar de customização */}
      <div className={`absolute top-0 left-0 h-full w-full sm:w-[420px] md:w-[450px] bg-[#0b0b0f]/90 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between z-30 transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div className="flex flex-col gap-6 pt-16 md:pt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase flex items-center gap-2">
              <Settings size={18} /> Configurador
            </h2>
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
              Início
            </Link>
          </div>

          {/* Card com info do carro */}
          <div className="bg-[#12121a] p-4 rounded-2xl border border-white/10 flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-gray-300 uppercase flex items-center gap-2">
                <Car size={16} /> Veículo Selecionado
              </span>
              <Link href="/selecionar-carro" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <RefreshCw size={12} /> Trocar Carro
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1b1b26] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Marca</span>
                <span className="text-xs font-bold text-white">{marca || "Carregando..."}</span>
              </div>
              <div className="bg-[#1b1b26] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Modelo</span>
                <span className="text-xs font-bold text-purple-400 truncate block">{modelo || "Carregando..."}</span>
              </div>
            </div>
          </div>

          {/* Cores da pintura */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs text-gray-400 uppercase font-semibold">Pintura Externa</span>
            <div className="flex flex-wrap gap-2.5">
              {carColors.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedColor(c.id)} 
                  title={c.id.toUpperCase()}
                  className={`w-9 h-9 rounded-xl transition-all cursor-pointer ${c.bg} ${
                    selectedColor === c.id ? "ring-2 ring-purple-500 scale-110 shadow-lg" : "opacity-75 hover:opacity-100"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Cores da grade */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs text-gray-400 uppercase font-semibold flex items-center gap-1.5">
              <Sliders size={14} className="text-purple-400" /> Moldura da janelas
            </span>
            <div className="flex flex-wrap gap-2.5">
              {carColors.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedGridColor(c.id)} 
                  title={c.id.toUpperCase()}
                  className={`w-9 h-9 rounded-xl transition-all cursor-pointer ${c.bg} ${
                    selectedGridColor === c.id ? "ring-2 ring-purple-500 scale-110 shadow-lg" : "opacity-75 hover:opacity-100"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Vidro */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs text-gray-400 uppercase font-semibold flex items-center gap-1.5">
              <Droplets size={14} className="text-purple-400" /> Estilo dos Vidros
            </span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'transparente', label: 'Transparente' },
                { id: 'preto', label: 'Fumê / Preto' }
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setGlassType(v.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    glassType === v.id 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30' 
                      : 'bg-[#12121a] border-white/10 text-gray-300 hover:bg-[#1b1b26]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de salvar/carrinho */}
        <div className="bg-[#12121a] p-4 rounded-2xl border border-white/10 flex flex-col gap-4 shadow-xl mt-6">
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