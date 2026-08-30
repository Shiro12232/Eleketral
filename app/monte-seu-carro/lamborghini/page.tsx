'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Palette, ShoppingCart, 
  Car, RefreshCw, ChevronLeft, 
  ChevronRight, Settings, Droplets, Armchair, 
  Disc, Flame, Lightbulb, Shield, Layers
} from "lucide-react";

// COMPONENTE COLOR PICKER CUSTOMIZADO COM PERFORMANCE OTIMIZADA
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
  const animationFrameRef = useRef<number | null>(null);

  const handleHslToHex = (h: number, s: number, l: number) => {
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

  const updateWithValues = (h: number, s: number, l: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    // Otimização para evitar travamentos no arrasto do mouse
    animationFrameRef.current = requestAnimationFrame(() => {
      const hex = handleHslToHex(h, s, l);
      onChangeColor(hex);
    });
  };

  return (
    <div className="flex flex-col gap-3 bg-[#12121a] p-3 rounded-2xl border border-white/10">
      {/* Área de Saturação e Luminosidade */}
      <div 
        className="relative w-full h-32 rounded-xl cursor-crosshair overflow-hidden shadow-inner"
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
            
            const newSat = (x / rect.width) * 100;
            const newLight = 50 - ((y / rect.height) * 50);
            
            setSat(newSat);
            setLight(newLight);
            updateWithValues(hue, newSat, newLight);
          };
          move(e.nativeEvent);
          const onMouseUp = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", onMouseUp);
          };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", onMouseUp);
        }}
      />

      {/* Slider de Matiz (Hue) */}
      <div 
        className="relative w-full h-5 rounded-lg cursor-pointer"
        style={{
          background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
        }}
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const move = (event: MouseEvent) => {
            let x = event.clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const newHue = (x / rect.width) * 360;
            
            setHue(newHue);
            updateWithValues(newHue, sat, light);
          };
          move(e.nativeEvent);
          const onMouseUp = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", onMouseUp);
          };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", onMouseUp);
        }}
      />

      {/* Preview, Hex e Preço */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: selectedColorHex }} />
          <span className="text-gray-400 font-mono">{selectedColorHex}</span>
        </div>
        <span className="text-emerald-400 font-bold">+ R$ {preco.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );
}

const pricingRules = {
  carroceria: 3500,
  rodas: 1500,
  interior: 1000,
  pecaPequena: 600
};

function ConteudoMonteSeuCarro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view3dUrl = searchParams.get("view3d");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sketchfabApi, setSketchfabApi] = useState<any>(null);
  
  const [paintMaterials, setPaintMaterials] = useState<any[]>([]); 
  const [parachoqueMaterials, setParachoqueMaterials] = useState<any[]>([]); 
  const [motorTraseiroMaterials, setMotorTraseiroMaterials] = useState<any[]>([]); 
  const [wheelMaterials, setWheelMaterials] = useState<any[]>([]); 
  const [interiorMaterials, setInteriorMaterials] = useState<any[]>([]); 
  const [taillightMaterials, setTaillightMaterials] = useState<any[]>([]); 
  const [lateralDesenhoMaterials, setLateralDesenhoMaterials] = useState<any[]>([]); 
  
  const [glassNodeIds, setGlassNodeIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  
  const [selectedColor, setSelectedColor] = useState("#FF6600");
  const [selectedParachoqueColor, setSelectedParachoqueColor] = useState("#111111");
  const [selectedMotorColor, setSelectedMotorColor] = useState("#333333");
  const [selectedWheelColor, setSelectedWheelColor] = useState("#333333");
  const [selectedInteriorColor, setSelectedInteriorColor] = useState("#8B4513");
  const [selectedTaillightColor, setSelectedTaillightColor] = useState("#CC0000");
  const [selectedLateralColor, setSelectedLateralColor] = useState("#000000");

  const [glassType, setGlassType] = useState("transparente");
  const [currentId, setCurrentId] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const precoTotal = 
    pricingRules.carroceria +
    pricingRules.pecaPequena +
    pricingRules.pecaPequena +
    pricingRules.rodas +
    pricingRules.interior +
    pricingRules.pecaPequena +
    pricingRules.pecaPequena +
    (glassType === "preto" ? 800 : 0);

  const hexToRgb = (hex: string): [number, number, number] => {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map(c => c + c).join("");
    }
    const num = parseInt(cleanHex, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255
    ];
  };

  const handleAddToCart = () => {
    const itensConfigurados = [
      { nome: "Veículo Base", detalhe: `${marca} ${modelo}`, preco: 0 },
      { nome: "Pintura Externa", detalhe: selectedColor, preco: pricingRules.carroceria },
      { nome: "Parachoque", detalhe: selectedParachoqueColor, preco: pricingRules.pecaPequena },
      { nome: "Motor Traseiro", detalhe: selectedMotorColor, preco: pricingRules.pecaPequena },
      { nome: "Rodas", detalhe: selectedWheelColor, preco: pricingRules.rodas },
      { nome: "Interior", detalhe: selectedInteriorColor, preco: pricingRules.interior },
      { nome: "Luz Traseira", detalhe: selectedTaillightColor, preco: pricingRules.pecaPequena },
      { nome: "Lateral Desenho", detalhe: selectedLateralColor, preco: pricingRules.pecaPequena },
      { nome: "Estilo dos Vidros", detalhe: glassType, preco: glassType === "preto" ? 800 : 0 },
    ];

    localStorage.setItem("carrinho_customizacao", JSON.stringify(itensConfigurados));
    localStorage.setItem("carrinho_total", precoTotal.toString());
    router.push("/carrinho");
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 3000);
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
              lightIntensity: 1.2,
              exposure: 1.0
            }, () => {});

            api.getMaterialList((err: any, materials: any[]) => {
              if (!err && materials) {
                const pinturas: any[] = [];
                const parachoque: any[] = [];
                const motor: any[] = [];
                const rodas: any[] = [];
                const interior: any[] = [];
                const luzTraseira: any[] = [];
                const lateral: any[] = [];

                materials.forEach(m => {
                  const n = m.name.toLowerCase();

                  if (n.includes("material.131")) {
                    parachoque.push(m);
                  } else if (n.includes("material.210")) {
                    motor.push(m);
                  } else if (n.includes("tire_pirelli_pzerocorsa_d.003_63")) {
                    rodas.push(m);
                  } else if (n.includes("material.157") || n.includes("tire_pirelli_pzerocorsa_d.003_1")) {
                    interior.push(m);
                  } else if (n.includes("material.223")) {
                    luzTraseira.push(m);
                  } else if (n.includes("material.252")) {
                    lateral.push(m);
                  } else if (n.includes("tire_pirelli_pzerocorsa_d.003_28")) {
                    return;
                  } else if (n.includes("glass") || n.includes("window") || n.includes("vidro") || n.includes("windshield") || n.includes("headlight") || n.includes("lamp") || n.includes("logo") || n.includes("emblem")) {
                    return;
                  } else {
                    pinturas.push(m);
                  }
                });

                setPaintMaterials(pinturas);
                setParachoqueMaterials(parachoque);
                setMotorTraseiroMaterials(motor);
                setWheelMaterials(rodas);
                setInteriorMaterials(interior);
                setTaillightMaterials(luzTraseira);
                setLateralDesenhoMaterials(lateral);
              }
            });

            api.getNodeMap((err: any, nodes: Record<string, any>) => {
              if (!err && nodes) {
                const glassIds: number[] = [];
                Object.values(nodes).forEach((node: any) => {
                  if (node.type === 'MatrixTransform' && node.name) {
                    const nameLower = node.name.toLowerCase();
                    if (nameLower.includes("glass") || nameLower.includes("window") || nameLower.includes("vidro") || nameLower.includes("windshield") || nameLower.includes("tire_pirelli_pzerocorsa_d.003_28")) {
                      glassIds.push(node.instanceID);
                    }
                  }
                });
                setGlassNodeIds(glassIds);
              }
            });

          });
        },
        error: () => console.error('Erro no Sketchfab'),
        autostart: 1, transparent: 1, ui_controls: 0, ui_infos: 0, ui_watermark: 0, ui_theme: "dark"
      });
    }
  }, [isReady, currentId]);

  // Função otimizada para manter texturas, relevos e brilhos originais intactos
  const applyMaterialColor = (matList: any[], hexColor: string) => {
    if (!sketchfabApi || !matList || matList.length === 0) return;
    const rgb = hexToRgb(hexColor);

    matList.forEach((mat: any) => {
      if (mat.channels && mat.channels.AlbedoPBR) {
        mat.channels.AlbedoPBR.color = rgb;
        mat.channels.AlbedoPBR.enable = true;
        // Se houver uma textura original no canal, mantemos o blend ativo para não apagar os detalhes
        if (mat.channels.AlbedoPBR.texture) {
          mat.channels.AlbedoPBR.factor = 1.0;
        }
        sketchfabApi.setMaterial(mat, () => {
          if (typeof sketchfabApi.updateMaterial === "function") {
            sketchfabApi.updateMaterial(mat);
          }
        });
      }
    });
  };

  useEffect(() => { applyMaterialColor(paintMaterials, selectedColor); }, [selectedColor, sketchfabApi, paintMaterials]);
  useEffect(() => { applyMaterialColor(parachoqueMaterials, selectedParachoqueColor); }, [selectedParachoqueColor, sketchfabApi, parachoqueMaterials]);
  useEffect(() => { applyMaterialColor(motorTraseiroMaterials, selectedMotorColor); }, [selectedMotorColor, sketchfabApi, motorTraseiroMaterials]);
  useEffect(() => { applyMaterialColor(wheelMaterials, selectedWheelColor); }, [selectedWheelColor, sketchfabApi, wheelMaterials]);
  useEffect(() => { applyMaterialColor(interiorMaterials, selectedInteriorColor); }, [selectedInteriorColor, sketchfabApi, interiorMaterials]);
  useEffect(() => { applyMaterialColor(taillightMaterials, selectedTaillightColor); }, [selectedTaillightColor, sketchfabApi, taillightMaterials]);
  useEffect(() => { applyMaterialColor(lateralDesenhoMaterials, selectedLateralColor); }, [selectedLateralColor, sketchfabApi, lateralDesenhoMaterials]);

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
        Carregando 3D do Veículo...
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen bg-[#0b0b0f] text-white flex flex-col justify-between overflow-hidden">
      
      {/* 3D Viewer */}
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

      {/* Botão lateral para abrir configurador */}
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
              <Settings size={18} /> Configurador de Veículos
            </h2>
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
              Início
            </Link>
          </div>

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

          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Palette size={14} /> 1. Pintura Externa
            </span>
            <ColorPickerCustom selectedColorHex={selectedColor} onChangeColor={setSelectedColor} preco={pricingRules.carroceria} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Layers size={14} /> 2. Parachoque
            </span>
            <ColorPickerCustom selectedColorHex={selectedParachoqueColor} onChangeColor={setSelectedParachoqueColor} preco={pricingRules.pecaPequena} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Flame size={14} /> 3. Motor Traseiro
            </span>
            <ColorPickerCustom selectedColorHex={selectedMotorColor} onChangeColor={setSelectedMotorColor} preco={pricingRules.pecaPequena} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Disc size={14} /> 4. Rodas
            </span>
            <ColorPickerCustom selectedColorHex={selectedWheelColor} onChangeColor={setSelectedWheelColor} preco={pricingRules.rodas} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Armchair size={14} /> 5. Interior
            </span>
            <ColorPickerCustom selectedColorHex={selectedInteriorColor} onChangeColor={setSelectedInteriorColor} preco={pricingRules.interior} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Lightbulb size={14} /> 6. Luz Traseira
            </span>
            <ColorPickerCustom selectedColorHex={selectedTaillightColor} onChangeColor={setSelectedTaillightColor} preco={pricingRules.pecaPequena} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Shield size={14} /> 7. Lateral Desenho
            </span>
            <ColorPickerCustom selectedColorHex={selectedLateralColor} onChangeColor={setSelectedLateralColor} preco={pricingRules.pecaPequena} />
          </div>

          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Droplets size={14} /> 8. Parabrisa 
            </span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'transparente', label: 'Transparente' },
                { id: 'preto', label: 'Fumê / Preto' }
              ].map((v) => (
                <button key={v.id} onClick={() => setGlassType(v.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${glassType === v.id ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-[#1b1b26] border-white/10 text-gray-300 hover:bg-[#222230]'}`}>
                  {v.label}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-purple-300 flex justify-between bg-[#1b1b26] px-3 py-1.5 rounded-lg border border-white/5">
              <span>Acréscimo desta seção:</span>
              <span className="font-bold">{glassType === "preto" ? "+ R$ 800" : "Incluso"}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#12121a] p-4 rounded-2xl border border-white/10 flex flex-col gap-3 shadow-xl mt-6 sticky bottom-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase font-bold">Valor Total:</span>
            <span className="text-lg font-extrabold text-emerald-400">
              R$ {precoTotal.toLocaleString('pt-BR')}
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-600/40 text-sm cursor-pointer"
          >
            <ShoppingCart size={18} /> Adicionar ao Carrinho
          </button>
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