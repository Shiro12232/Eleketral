'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Palette, ShoppingCart, 
  Car, RefreshCw, ChevronLeft, 
  ChevronRight, Sliders, Droplets, Armchair, 
  Disc, Shield, Zap, Check
} from "lucide-react";

// Seletor de cores customizado com visual refinado
function ColorPickerCustom({ 
  selectedColorHex, 
  onChangeColor,
  preco
}: { 
  selectedColorHex: string, 
  onChangeColor: (hex: string) => void,
  preco: number
}) {
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(100);
  const [light, setLight] = useState(50);

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return "#" + [f(0), f(8), f(4)]
      .map(x => Math.round(255 * x).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  };

  const atualizaCor = (h: number, s: number, l: number) => {
    const hex = hslToHex(h, s, l);
    onChangeColor(hex);
  };

  return (
    <div className="flex flex-col gap-3.5 bg-[#16181d] p-4 rounded-2xl border border-white/[0.08] shadow-xl">
      {/* Área de Saturação / Luminosidade */}
      <div 
        className="relative w-full h-36 rounded-xl cursor-crosshair overflow-hidden shadow-inner border border-white/5"
        style={{
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
        }}
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const move = (event: MouseEvent) => {
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            x = Math.max(0, Math.min(x, rect.width));
            y = Math.max(0, Math.min(y, rect.height));
            
            const novaSat = (x / rect.width) * 100;
            const novaLuz = 50 - ((y / rect.height) * 50);
            
            setSat(novaSat);
            setLight(novaLuz);
            atualizaCor(hue, novaSat, novaLuz);
          };
          move(e.nativeEvent);
          const soltou = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", soltou);
          };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", soltou);
        }}
      />

      {/* Barra de Matiz (Hue) */}
      <div 
        className="relative w-full h-4 rounded-lg cursor-pointer border border-white/10"
        style={{
          background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
        }}
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const move = (event: MouseEvent) => {
            let x = event.clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const novoHue = (x / rect.width) * 360;
            
            setHue(novoHue);
            atualizaCor(novoHue, sat, light);
          };
          move(e.nativeEvent);
          const soltou = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", soltou);
          };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", soltou);
        }}
      />

      {/* Rodapé do seletor */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: selectedColorHex }} />
          <span className="text-gray-400 font-mono tracking-wider">{selectedColorHex}</span>
        </div>
        <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
          + R$ {preco.toLocaleString('pt-BR')}
        </span>
      </div>
    </div>
  );
}

const precos = {
  carroceria: 4500,
  rodas: 1800,
  interior: 2200,
  pecaPequena: 900
};

function ConteudoMonteSeuCarro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view3dUrl = searchParams.get("view3d");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sketchfabApi, setSketchfabApi] = useState<any>(null);
  
  // Categorias de materiais
  const [paintMaterials, setPaintMaterials] = useState<any[]>([]); 
  const [detalhesMaterials, setDetalhesMaterials] = useState<any[]>([]); 
  const [wheelMaterials, setWheelMaterials] = useState<any[]>([]); 
  const [interiorMaterials, setInteriorMaterials] = useState<any[]>([]); 
  const [glassNodeIds, setGlassNodeIds] = useState<number[]>([]);
  
  const [isReady, setIsReady] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  
  // Cores iniciais elegantes
  const [selectedColor, setSelectedColor] = useState("#0F172A"); // Azul Meia-Noite
  const [selectedDetalhesColor, setSelectedDetalhesColor] = useState("#18181B"); // Preto Fosco
  const [selectedWheelColor, setSelectedWheelColor] = useState("#27272A"); // Grafite Rodas
  const [selectedInteriorColor, setSelectedInteriorColor] = useState("#9A3412"); // Couro Terracota
  const [glassType, setGlassType] = useState("transparente");
  
  const [currentId, setCurrentId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Aba ativa na sidebar (substitui a rolagem longa)
  const [abaAtiva, setAbaAtiva] = useState<'pintura' | 'rodas' | 'interior' | 'detalhes'>('pintura');

  const precoTotal = 
    precos.carroceria +
    precos.pecaPequena +
    precos.rodas +
    precos.interior +
    (glassType === "preto" ? 1200 : 0);

  const hexParaRgb = (hex: string): [number, number, number] => {
    let limpo = hex.replace("#", "");
    if (limpo.length === 3) {
      limpo = limpo.split("").map(c => c + c).join("");
    }
    const num = parseInt(limpo, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255
    ];
  };

  const handleAddToCart = () => {
    const itensConfigurados = [
      { nome: "Veículo Base", detalhe: `${marca} ${modelo}`, preco: 0 },
      { nome: "Pintura Externa", detalhe: selectedColor, preco: precos.carroceria },
      { nome: "Acabamentos e Detalhes", detalhe: selectedDetalhesColor, preco: precos.pecaPequena },
      { nome: "Rodas Esportivas", detalhe: selectedWheelColor, preco: precos.rodas },
      { nome: "Acabamento Interno", detalhe: selectedInteriorColor, preco: precos.interior },
      { nome: "Estilo dos Vidros", detalhe: glassType, preco: glassType === "preto" ? 1200 : 0 },
    ];

    localStorage.setItem("carrinho_customizacao", JSON.stringify(itensConfigurados));
    localStorage.setItem("carrinho_total", precoTotal.toString());
    router.push("/carrinho");
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedMarca = localStorage.getItem("projeto_marca");
    let activeLink = view3dUrl || localStorage.getItem("projeto_link3d");

    if (!savedMarca && !activeLink) {
      router.replace("/selecionar-carro");
      return;
    }

    if (savedMarca) setMarca(savedMarca);
    setModelo(localStorage.getItem("projeto_modelo") || "");

    if (activeLink) {
      try { activeLink = decodeURIComponent(activeLink); } catch (e) {}
      if (view3dUrl) localStorage.setItem("projeto_link3d", activeLink);
      const match = activeLink.match(/-([a-f0-9]{32})$/) || activeLink.match(/([a-f0-9]{32})/);
      setCurrentId(match ? match[1] : activeLink.split("/").pop() || "");
    }

    const script = document.createElement("script");
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    script.async = true;
    script.onload = () => setIsReady(true);
    document.body.appendChild(script);

    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
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
              lightIntensity: 1.3,
              exposure: 1.1
            }, () => {});

            api.getMaterialList((err: any, materials: any[]) => {
              if (!err && materials) {
                const pinturas: any[] = [];
                const detalhes: any[] = [];
                const rodas: any[] = [];
                const interior: any[] = [];

                materials.forEach(m => {
                  const n = m.name.toLowerCase();
                  if (n.includes("glass") || n.includes("window") || n.includes("vidro") || n.includes("windshield") || n.includes("logo") || n.includes("emblem") || n.includes("light") || n.includes("lamp") || n.includes("farol") || n.includes("lantern")) return; 
                  else if (n.includes("wheel") || n.includes("rim") || n.includes("tire") || n.includes("pneu") || n.includes("brake") || n.includes("disco") || n.includes("roda")) rodas.push(m);
                  else if (n.includes("interior") || n.includes("seat") || n.includes("banco") || n.includes("steering") || n.includes("volante") || n.includes("dashboard") || n.includes("painel")) interior.push(m);
                  else if (n.includes("rubber") || n.includes("trim") || n.includes("plastic") || n.includes("grill") || n.includes("grade")) detalhes.push(m);
                  else pinturas.push(m);
                });

                setPaintMaterials(pinturas);
                setDetalhesMaterials(detalhes);
                setWheelMaterials(rodas);
                setInteriorMaterials(interior);
              }
            });

            api.getNodeMap((err: any, nodes: Record<string, any>) => {
              if (!err && nodes) {
                const glassIds: number[] = [];
                Object.values(nodes).forEach((node: any) => {
                  if (node.type === 'MatrixTransform' && node.name) {
                    const nomeBaixo = node.name.toLowerCase();
                    if (nomeBaixo.includes("glass") || nomeBaixo.includes("window") || nomeBaixo.includes("vidro")) {
                      glassIds.push(node.instanceID);
                    }
                  }
                });
                setGlassNodeIds(glassIds);
              }
            });
          });
        },
        error: () => console.error('Erro ao iniciar visualizador Sketchfab'),
        autostart: 1, transparent: 1, ui_controls: 0, ui_infos: 0, ui_watermark: 0, ui_theme: "dark"
      });
    }
  }, [isReady, currentId]);

  const aplicaCorNoMaterial = (listaMateriais: any[], corHex: string) => {
    if (!sketchfabApi) return;
    const rgb = hexParaRgb(corHex);
    listaMateriais.forEach((mat: any) => {
      if (mat.channels && mat.channels.AlbedoPBR) {
        mat.channels.AlbedoPBR.color = rgb;
        mat.channels.AlbedoPBR.enable = true;
        sketchfabApi.setMaterial(mat, () => {
          if (typeof sketchfabApi.updateMaterial === "function") sketchfabApi.updateMaterial(mat);
        });
      }
    });
  };

  useEffect(() => { aplicaCorNoMaterial(paintMaterials, selectedColor); }, [selectedColor, sketchfabApi, paintMaterials]);
  useEffect(() => { aplicaCorNoMaterial(detalhesMaterials, selectedDetalhesColor); }, [selectedDetalhesColor, sketchfabApi, detalhesMaterials]);
  useEffect(() => { aplicaCorNoMaterial(wheelMaterials, selectedWheelColor); }, [selectedWheelColor, sketchfabApi, wheelMaterials]);
  useEffect(() => { aplicaCorNoMaterial(interiorMaterials, selectedInteriorColor); }, [selectedInteriorColor, sketchfabApi, interiorMaterials]);

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
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-emerald-400 font-medium gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-sm tracking-wide text-gray-400">Preparando estúdio 3D...</span>
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen bg-[#090a0f] text-white flex flex-col justify-between overflow-hidden">
      
      {/* Container do Iframe 3D */}
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-transparent overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-80" style={{ backgroundImage: "url('/fundogaragem.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent z-10 pointer-events-none" />
        
        <div className="w-full h-full relative z-20 flex items-center justify-center overflow-hidden">
          <iframe 
            ref={iframeRef} 
            title="Visualizador 3D" 
            className="w-full h-full border-0 pointer-events-auto bg-transparent transition-all duration-300" 
            allow="autoplay; fullscreen; vr" 
          />
        </div>
      </div>

      {/* Botão de Gatilho da Sidebar */}
      <div className="absolute top-1/2 -translate-y-1/2 z-40 flex items-center">
        <div className="relative">
          <button 
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setShowAlert(false);
            }}
            className={`bg-[#12131a]/90 hover:bg-emerald-600 backdrop-blur-md border border-white/10 text-white p-3.5 rounded-r-2xl transition-all duration-300 shadow-2xl cursor-pointer flex items-center justify-center ${
              isSidebarOpen ? 'translate-x-[420px]' : 'translate-x-0'
            }`}
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>

          {!isSidebarOpen && showAlert && (
            <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xl whitespace-nowrap animate-pulse border border-emerald-400/40 pointer-events-none z-50 flex items-center gap-2">
              <Zap size={14} /> <span>Abrir estúdio de customização</span>
            </div>
          )}
        </div>
      </div>

      {/* Painel Lateral Redesenhado (Estilo Dashboard Clean) */}
      <div className={`absolute top-0 left-0 h-full w-full sm:w-[420px] bg-[#101116]/95 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col justify-between z-30 transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div className="flex flex-col gap-5 pt-12 sm:pt-2">
          
          {/* Topo do Menu */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-xs font-extrabold tracking-widest text-gray-200 uppercase">
                CustomStudio Pro
              </h2>
            </div>
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
              Sair
            </Link>
          </div>

          {/* Card do Veículo */}
          <div className="bg-[#16181d] p-3.5 rounded-2xl border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Veículo Ativo</span>
              <span className="text-xs font-bold text-white tracking-wide">{marca} {modelo}</span>
            </div>
            <Link href="/selecionar-carro" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 transition-all">
              <RefreshCw size={12} /> Trocar
            </Link>
          </div>

          {/* Abas de Navegação Super Limpas */}
          <div className="grid grid-cols-4 gap-1.5 bg-[#16181d] p-1.5 rounded-2xl border border-white/[0.08]">
            {[
              { id: 'pintura', label: 'Pintura', icon: Palette },
              { id: 'detalhes', label: 'Acab.', icon: Shield },
              { id: 'rodas', label: 'Rodas', icon: Disc },
              { id: 'interior', label: 'Interior', icon: Armchair },
            ].map((aba) => {
              const Icon = aba.icon;
              const ativa = abaAtiva === aba.id;
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id as any)}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    ativa 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span>{aba.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conteúdo Dinâmico Conforme a Aba Selecionada */}
          <div className="pt-1">
            {abaAtiva === 'pintura' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Palette size={14} className="text-emerald-400" /> Cor da Carroceria
                </span>
                <ColorPickerCustom selectedColorHex={selectedColor} onChangeColor={setSelectedColor} preco={precos.carroceria} />
              </div>
            )}

            {abaAtiva === 'detalhes' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} className="text-emerald-400" /> Frisos e Plásticos
                </span>
                <ColorPickerCustom selectedColorHex={selectedDetalhesColor} onChangeColor={setSelectedDetalhesColor} preco={precos.pecaPequena} />
              </div>
            )}

            {abaAtiva === 'rodas' && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex flex-col gap-3">
                  <span className="text-xs text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Disc size={14} className="text-emerald-400" /> Acabamento das Rodas
                  </span>
                  <ColorPickerCustom selectedColorHex={selectedWheelColor} onChangeColor={setSelectedWheelColor} preco={precos.rodas} />
                </div>

                {/* Subseção de Vidros dentro de Rodas/Vidros */}
                <div className="flex flex-col gap-3 bg-[#16181d] p-4 rounded-2xl border border-white/[0.08] mt-2">
                  <span className="text-xs text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets size={14} className="text-emerald-400" /> Película dos Vidros
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'transparente', label: 'Original' },
                      { id: 'preto', label: 'Fumê Dark' }
                    ].map((v) => (
                      <button 
                        key={v.id} 
                        onClick={() => setGlassType(v.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          glassType === v.id 
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                            : 'bg-[#1b1d24] border-white/5 text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        {glassType === v.id && <Check size={12} />}
                        {v.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-gray-400 flex justify-between bg-[#111217] px-3 py-2 rounded-xl border border-white/5">
                    <span>Taxa da película:</span>
                    <span className="font-semibold text-emerald-400">{glassType === "preto" ? "+ R$ 1.200" : "Incluso"}</span>
                  </div>
                </div>
              </div>
            )}

            {abaAtiva === 'interior' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Armchair size={14} className="text-emerald-400" /> Revestimento dos Bancos
                </span>
                <ColorPickerCustom selectedColorHex={selectedInteriorColor} onChangeColor={setSelectedInteriorColor} preco={precos.interior} />
              </div>
            )}
          </div>

        </div>

        {/* Rodapé Fixo com Botão de Finalizar */}
        <div className="bg-[#16181d] p-4 rounded-2xl border border-white/[0.08] flex flex-col gap-3 shadow-xl mt-6 sticky bottom-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Valor Total do Projeto:</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              R$ {precoTotal.toLocaleString('pt-BR')}
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/30 text-xs uppercase tracking-wider cursor-pointer"
          >
            <ShoppingCart size={16} /> Salvar e Ir para o Carrinho
          </button>
        </div>

      </div>

    </section>
  );
}

export default function MonteSeuCarroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center">Carregando estúdio...</div>}>
      <ConteudoMonteSeuCarro />
    </Suspense>
  );
}