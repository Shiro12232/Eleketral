'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Palette, ShoppingCart, 
  Car, RefreshCw, 
  Bug, Armchair, Search, 
  Disc, Flame, Lightbulb, Droplets, Layers, Settings, ChevronLeft, ChevronRight
} from "lucide-react";

// Função auxiliar para converter cor HEX (#RRGGBB) para vetor RGB [0..1]
const hexToRgbNormalized = (hex: string): [number, number, number] => {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  const num = parseInt(cleanHex, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r, g, b];
};

const pricingRules = {
  carroceria: { padrao: 3000 },
  rodas: { padrao: 1500 },
  interior: { padrao: 1000 },
  pecaPequena: { padrao: 500 }
};

const getPartPrice = (partType: keyof typeof pricingRules, hexColor: string) => {
  if (hexColor.toLowerCase() === "#ffffff" || hexColor.toLowerCase() === "#fff") return 0;
  const rules = pricingRules[partType] || pricingRules.pecaPequena;
  return rules.padrao;
};

// Componente ColorPickerCustom integrado
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
  const [localHex, setLocalHex] = useState(selectedColorHex);

  useEffect(() => {
    setLocalHex(selectedColorHex);
  }, [selectedColorHex]);

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

  return (
    <div className="flex flex-col gap-3 bg-[#12121a] p-3 rounded-2xl border border-white/10 select-none">
      {/* Área de Saturação e Luminosidade (Pintura Externa / Rodas) */}
      <div 
        className="relative w-full h-32 rounded-xl cursor-crosshair overflow-hidden shadow-inner"
        style={{
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
        }}
        onMouseDown={(e) => {
          const container = e.currentTarget.getBoundingClientRect();
          let lastCall = 0;

          const calculateColor = (clientX: number, clientY: number, forceApply: boolean) => {
            let x = clientX - container.left;
            let y = clientY - container.top;
            x = Math.max(0, Math.min(x, container.width));
            y = Math.max(0, Math.min(y, container.height));
            
            const newSat = (x / container.width) * 100;
            const newLight = 50 - ((y / container.height) * 50);
            
            setSat(newSat);
            setLight(newLight);
            
            const hex = handleHslToHex(hue, newSat, newLight);
            setLocalHex(hex); // Preview ultra-rápido na tela
            
            const now = Date.now();
            // Limita as chamadas pesadas ao Sketchfab para no máximo a cada 50ms (evita o travamento)
            if (forceApply || (now - lastCall > 50)) {
              lastCall = now;
              onChangeColor(hex); 
            }
          };

          calculateColor(e.clientX, e.clientY, false);

          const onMouseMove = (moveEvent: MouseEvent) => {
            calculateColor(moveEvent.clientX, moveEvent.clientY, false);
          };

          const onMouseUp = (upEvent: MouseEvent) => {
            calculateColor(upEvent.clientX, upEvent.clientY, true); // Garante a cor exata ao soltar
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
          };

          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
        }}
      />

      {/* Slider de Matiz (Hue) */}
      <div 
        className="relative w-full h-5 rounded-lg cursor-pointer overflow-hidden"
        style={{
          background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
        }}
        onMouseDown={(e) => {
          const container = e.currentTarget.getBoundingClientRect();
          let lastCall = 0;

          const calculateHue = (clientX: number, forceApply: boolean) => {
            let x = clientX - container.left;
            x = Math.max(0, Math.min(x, container.width));
            const newHue = (x / container.width) * 360;
            
            setHue(newHue);
            const hex = handleHslToHex(newHue, sat, light);
            setLocalHex(hex);

            const now = Date.now();
            if (forceApply || (now - lastCall > 50)) {
              lastCall = now;
              onChangeColor(hex);
            }
          };

          calculateHue(e.clientX, false);

          const onMouseMove = (moveEvent: MouseEvent) => {
            calculateHue(moveEvent.clientX, false);
          };

          const onMouseUp = (upEvent: MouseEvent) => {
            calculateHue(upEvent.clientX, true);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
          };

          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
        }}
      />

      {/* Preview e Preço */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: localHex }} />
          <span className="text-gray-400 font-mono">{localHex}</span>
        </div>
        <span className="text-emerald-400 font-bold">+ R$ {preco.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );
}

function ConteudoMonteSeuCarro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view3dUrl = searchParams.get("view3d");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sketchfabApi, setSketchfabApi] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [paintMaterials, setPaintMaterials] = useState<any[]>([]); 
  const [gridMaterials, setGridMaterials] = useState<any[]>([]); 
  const [interiorMaterials, setInteriorMaterials] = useState<any[]>([]); 
  const [wheelMaterials, setWheelMaterials] = useState<any[]>([]);
  const [frontSeatMaterials, setFrontSeatMaterials] = useState<any[]>([]);
  const [roofInteriorMaterials, setRoofInteriorMaterials] = useState<any[]>([]);
  const [trunkMaterials, setTrunkMaterials] = useState<any[]>([]);
  const [rearGlassFrameMaterials, setRearGlassFrameMaterials] = useState<any[]>([]);
  const [sidePartsMaterials, setSidePartsMaterials] = useState<any[]>([]);
  const [taillightMaterials, setTaillightMaterials] = useState<any[]>([]);
  const [exhaustMaterials, setExhaustMaterials] = useState<any[]>([]);
  
  const [innerPart22Materials, setInnerPart22Materials] = useState<any[]>([]);
  const [innerSide21Materials, setInnerSide21Materials] = useState<any[]>([]);

  const [glassNodeIds, setGlassNodeIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const [allMaterialsDebug, setAllMaterialsDebug] = useState<any[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugSearchQuery, setDebugSearchQuery] = useState("");
  
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  
  // Cores em formato HEX
  const [selectedColor, setSelectedColor] = useState("#E60000");
  const [selectedGridColor, setSelectedGridColor] = useState("#1A1A1A");
  const [selectedInteriorColor, setSelectedInteriorColor] = useState("#B35900"); 
  const [selectedWheelColor, setSelectedWheelColor] = useState("#2E3238");
  const [selectedFrontSeatColor, setSelectedFrontSeatColor] = useState("#B35900");
  const [selectedRoofColor, setSelectedRoofColor] = useState("#1A1A1A");
  const [selectedTrunkColor, setSelectedTrunkColor] = useState("#1A1A1A");
  const [selectedRearGlassColor, setSelectedRearGlassColor] = useState("#1A1A1A");
  const [selectedSidePartsColor, setSelectedSidePartsColor] = useState("#1A1A1A");
  const [selectedTaillightColor, setSelectedTaillightColor] = useState("#E60000");
  const [selectedExhaustColor, setSelectedExhaustColor] = useState("#2E3238");
  
  const [selectedInner22Color, setSelectedInner22Color] = useState("#B35900");
  const [selectedInner21Color, setSelectedInner21Color] = useState("#B35900");

  const [glassType, setGlassType] = useState("transparente");
  const [currentId, setCurrentId] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  const isBmw = modelo.toUpperCase().includes('G80') || marca.toUpperCase().includes('BMW');

  const precoBaseCarro = 0;
  const precoTotal = 
    precoBaseCarro + 
    getPartPrice('carroceria', selectedColor) +
    getPartPrice('rodas', selectedWheelColor) +
    getPartPrice('interior', selectedFrontSeatColor) +
    getPartPrice('interior', selectedInteriorColor) +
    (isBmw ? getPartPrice('interior', selectedInner22Color) : 0) +
    (isBmw ? getPartPrice('interior', selectedInner21Color) : 0) +
    getPartPrice('pecaPequena', selectedRoofColor) +
    getPartPrice('pecaPequena', selectedTrunkColor) +
    getPartPrice('pecaPequena', selectedRearGlassColor) +
    getPartPrice('pecaPequena', selectedTaillightColor) +
    getPartPrice('pecaPequena', selectedExhaustColor) +
    (glassType === "preto" ? 800 : 0);

  const filteredDebugMaterials = allMaterialsDebug.filter((mat) => {
    const query = debugSearchQuery.toLowerCase();
    const nameMatch = mat.name && mat.name.toLowerCase().includes(query);
    const idMatch = mat.id && mat.id.toString().includes(query);
    return nameMatch || idMatch;
  });

  const testPaintMaterialDebug = (mat: any) => {
    if (!sketchfabApi || !mat) return;
    const verdeColor: [number, number, number] = [0.02, 0.85, 0.05];
    if (mat.channels && mat.channels.AlbedoPBR) {
      mat.channels.AlbedoPBR.color = verdeColor;
      mat.channels.AlbedoPBR.enable = true;
      sketchfabApi.setMaterial(mat, () => {
        if (typeof sketchfabApi.updateMaterial === "function") {
          sketchfabApi.updateMaterial(mat);
        }
      });
    }
  };

  const resetDebugColors = () => {
    if (!sketchfabApi) return;
    applyMaterialColor(paintMaterials, selectedColor);
    applyMaterialColor(gridMaterials, selectedGridColor);
    applyMaterialColor(interiorMaterials, selectedInteriorColor);
    applyMaterialColor(wheelMaterials, selectedWheelColor);
    applyMaterialColor(frontSeatMaterials, selectedFrontSeatColor);
    applyMaterialColor(roofInteriorMaterials, selectedRoofColor);
    applyMaterialColor(trunkMaterials, selectedTrunkColor);
    applyMaterialColor(rearGlassFrameMaterials, selectedRearGlassColor);
    applyMaterialColor(sidePartsMaterials, selectedSidePartsColor);
    applyMaterialColor(taillightMaterials, selectedTaillightColor);
    applyMaterialColor(exhaustMaterials, selectedExhaustColor);
    if (isBmw) {
      applyMaterialColor(innerPart22Materials, selectedInner22Color);
      applyMaterialColor(innerSide21Materials, selectedInner21Color);
    }
  };

  const handleAddToCart = () => {
    const itensConfigurados = [
      { nome: "Veículo Base", detalhe: `${marca} ${modelo}`, preco: 0 },
      { nome: "Pintura Externa", detalhe: selectedColor, preco: getPartPrice('carroceria', selectedColor) },
      { nome: "Rodas", detalhe: selectedWheelColor, preco: getPartPrice('rodas', selectedWheelColor) },
      { nome: "Bancos da Frente", detalhe: selectedFrontSeatColor, preco: getPartPrice('interior', selectedFrontSeatColor) },
      { nome: "Bancos Traseiros", detalhe: selectedInteriorColor, preco: getPartPrice('interior', selectedInteriorColor) },
      ...(isBmw ? [
        { nome: "Parte Interna ", detalhe: selectedInner22Color, preco: getPartPrice('interior', selectedInner22Color) },
        { nome: "Parte Interna Lateral ", detalhe: selectedInner21Color, preco: getPartPrice('interior', selectedInner21Color) }
      ] : []),
      { nome: "Teto Interior", detalhe: selectedRoofColor, preco: getPartPrice('pecaPequena', selectedRoofColor) },
      { nome: "Porta-malas", detalhe: selectedTrunkColor, preco: getPartPrice('pecaPequena', selectedTrunkColor) },
      { nome: "Moldura Vidro Traseiro", detalhe: selectedRearGlassColor, preco: getPartPrice('pecaPequena', selectedRearGlassColor) },
      { nome: "Luz Traseira", detalhe: selectedTaillightColor, preco: getPartPrice('pecaPequena', selectedTaillightColor) },
      { nome: "Escape / Fumaça", detalhe: selectedExhaustColor, preco: getPartPrice('pecaPequena', selectedExhaustColor) },
      { nome: "Estilo dos Vidros", detalhe: glassType, preco: glassType === "preto" ? 800 : 0 },
    ].filter(item => item.preco > 0 || item.nome === "Veículo Base");

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
      try { activeLink = decodeURIComponent(activeLink); } catch {}
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
      setInnerPart22Materials([]);
      setInnerSide21Materials([]);
      setAllMaterialsDebug([]);

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
                setAllMaterialsDebug(materials);
                
                const pinturas: any[] = [];
                const grades: any[] = [];
                const interiores: any[] = [];
                const rodas: any[] = [];
                const bancosFrente: any[] = [];
                const tetoInterior: any[] = [];
                const portaMalas: any[] = [];
                const vidroAtras: any[] = [];
                const partesLaterais: any[] = [];
                const luzTraseira: any[] = [];
                const fumaçaEscape: any[] = [];
                const part22: any[] = [];
                const part21: any[] = [];

                materials.forEach(m => {
                  const n = m.name.toLowerCase();

                  if (modelo.toUpperCase().includes('G80') || marca.toUpperCase().includes('BMW')) {
                    if (n.includes("mat_237_22")) {
                      part22.push(m);
                      return;
                    } else if (n.includes("mat_237_21")) {
                      part21.push(m);
                      return;
                    }
                  }

                  if (n.includes("mat_237_69")) {
                    rodas.push(m);
                  } else if (n.includes("mat_237_15")) {
                    bancosFrente.push(m);
                  } else if (n.includes("mat_237_30")) {
                    tetoInterior.push(m);
                  } else if (n.includes("mat_237_95")) {
                    portaMalas.push(m);
                  } else if (n.includes("mat_237_60")) {
                    vidroAtras.push(m);
                  } else if (n.includes("mat_237_19") || n.includes("side") || n.includes("lateral")) {
                    partesLaterais.push(m);
                  } else if (n.includes("mat_237_46")) {
                    luzTraseira.push(m);
                  } else if (n.includes("mat_237_61")) {
                    fumaçaEscape.push(m);
                  } else if (n.includes("mat_237_28") || n.includes("interior") || n.includes("seat") || n.includes("banco") || n.includes("leather")) {
                    interiores.push(m);
                  } else if (n.includes("grill") || n.includes("grid") || n.includes("mesh") || n.includes("grelha") || n.includes("mat_237_14")) {
                    grades.push(m);
                  } else if (n.includes("glass") || n.includes("window") || n.includes("vidro") || n.includes("windshield") || n.includes("headlight") || n.includes("taillight") || n.includes("lamp") || n.includes("logo") || n.includes("emblem")) {
                    return;
                  } else {
                    pinturas.push(m);
                  }
                });

                setPaintMaterials(pinturas);
                setGridMaterials(grades);
                setInteriorMaterials(interiores);
                setWheelMaterials(rodas);
                setFrontSeatMaterials(bancosFrente);
                setRoofInteriorMaterials(tetoInterior);
                setTrunkMaterials(portaMalas);
                setRearGlassFrameMaterials(vidroAtras);
                setSidePartsMaterials(partesLaterais);
                setTaillightMaterials(luzTraseira);
                setExhaustMaterials(fumaçaEscape);
                setInnerPart22Materials(part22);
                setInnerSide21Materials(part21);
              }
            });

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
        error: () => console.error('Erro no Sketchfab'),
        autostart: 1, transparent: 1, ui_controls: 0, ui_infos: 0, ui_watermark: 0, ui_theme: "dark"
      });
    }
  }, [isReady, currentId, modelo, marca]);

  const applyMaterialColor = (matList: any[], hexColor: string) => {
    if (!sketchfabApi) return;
    const novaCor = hexToRgbNormalized(hexColor);

    matList.forEach((mat: any) => {
      if (mat.channels && mat.channels.AlbedoPBR) {
        mat.channels.AlbedoPBR.color = novaCor;
        mat.channels.AlbedoPBR.enable = true;
        sketchfabApi.setMaterial(mat, () => {
          if (typeof sketchfabApi.updateMaterial === "function") sketchfabApi.updateMaterial(mat);
        });
      }
    });
  };

  useEffect(() => { applyMaterialColor(paintMaterials, selectedColor); }, [selectedColor, sketchfabApi, paintMaterials]);
  useEffect(() => { applyMaterialColor(gridMaterials, selectedGridColor); }, [selectedGridColor, sketchfabApi, gridMaterials]);
  useEffect(() => { applyMaterialColor(interiorMaterials, selectedInteriorColor); }, [selectedInteriorColor, sketchfabApi, interiorMaterials]);
  useEffect(() => { applyMaterialColor(wheelMaterials, selectedWheelColor); }, [selectedWheelColor, sketchfabApi, wheelMaterials]);
  useEffect(() => { applyMaterialColor(frontSeatMaterials, selectedFrontSeatColor); }, [selectedFrontSeatColor, sketchfabApi, frontSeatMaterials]);
  useEffect(() => { applyMaterialColor(roofInteriorMaterials, selectedRoofColor); }, [selectedRoofColor, sketchfabApi, roofInteriorMaterials]);
  useEffect(() => { applyMaterialColor(trunkMaterials, selectedTrunkColor); }, [selectedTrunkColor, sketchfabApi, trunkMaterials]);
  useEffect(() => { applyMaterialColor(rearGlassFrameMaterials, selectedRearGlassColor); }, [selectedRearGlassColor, sketchfabApi, rearGlassFrameMaterials]);
  useEffect(() => { applyMaterialColor(sidePartsMaterials, selectedSidePartsColor); }, [selectedSidePartsColor, sketchfabApi, sidePartsMaterials]);
  useEffect(() => { applyMaterialColor(taillightMaterials, selectedTaillightColor); }, [selectedTaillightColor, sketchfabApi, taillightMaterials]);
  useEffect(() => { applyMaterialColor(exhaustMaterials, selectedExhaustColor); }, [selectedExhaustColor, sketchfabApi, exhaustMaterials]);
  
  useEffect(() => { 
    if (isBmw) {
      applyMaterialColor(innerPart22Materials, selectedInner22Color); 
      applyMaterialColor(innerSide21Materials, selectedInner21Color); 
    }
  }, [selectedInner22Color, selectedInner21Color, sketchfabApi, innerPart22Materials, innerSide21Materials, isBmw]);

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

      {/* Painel de Debug */}
      <div className="absolute top-4 right-4 z-40 flex flex-col items-end">
        <div className="flex items-center gap-2 mb-2">
          {showDebugPanel && (
            <button 
              onClick={resetDebugColors}
              className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1 shadow-lg cursor-pointer"
            >
              Resetar Cores
            </button>
          )}
          <button 
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="bg-black/80 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Bug size={14} /> {showDebugPanel ? "Ocultar Debug" : "Abrir Debug"}
          </button>
        </div>

        {showDebugPanel && (
          <div className="bg-black/95 backdrop-blur-xl border border-purple-500/30 p-4 rounded-2xl w-96 max-h-[500px] overflow-hidden shadow-2xl text-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span className="font-bold text-purple-400 uppercase tracking-wider block">Inspecionar Materiais</span>
                <span className="text-[10px] text-gray-400">Pesquise e teste peças individualmente</span>
              </div>
              <span className="bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                {filteredDebugMaterials.length} / {allMaterialsDebug.length}
              </span>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Pesquisar por nome ou ID..."
                value={debugSearchQuery}
                onChange={(e) => setDebugSearchQuery(e.target.value)}
                className="w-full bg-[#12121a] text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 text-xs placeholder-gray-500 transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-2 overflow-y-auto max-h-72 pr-1">
              {filteredDebugMaterials.length === 0 ? (
                <span className="text-gray-400 italic text-center py-4">Nenhum material encontrado...</span>
              ) : (
                filteredDebugMaterials.map((mat, idx) => (
                  <div key={idx} className="bg-[#12121a] p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex flex-col truncate">
                      <span className="font-bold text-white truncate max-w-[200px]" title={mat.name}>{mat.name}</span>
                      <span className="text-[10px] text-gray-400">ID: {mat.id}</span>
                    </div>
                    <button
                      onClick={() => testPaintMaterialDebug(mat)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer whitespace-nowrap shadow-md flex items-center gap-1"
                    >
                      <Palette size={12} /> Pintar de Verde
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

           <div className="absolute top-1/2 -translate-y-1/2 z-40 flex items-center">
        <div className="relative">
          <button 
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setShowAlert(false);
            }}
            className={`bg-[#12121a]/95 hover:bg-purple-600 backdrop-blur-md border border-white/10 text-white p-3 rounded-r-2xl transition-all duration-300 shadow-2xl cursor-pointer flex items-center justify-center ${
              isSidebarOpen ? 'translate-x-[420px] md:translate-x-112.5' : 'translate-x-0'
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
              <Settings size={18} /> Configurador
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

          {/* 1. Pintura Externa */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Palette size={14} /> 1. Pintura Externa
            </span>
            <ColorPickerCustom selectedColorHex={selectedColor} onChangeColor={setSelectedColor} preco={getPartPrice('carroceria', selectedColor)} />
          </div>

          {/* 3. Rodas */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Disc size={14} /> 3. Rodas
            </span>
            <ColorPickerCustom selectedColorHex={selectedWheelColor} onChangeColor={setSelectedWheelColor} preco={getPartPrice('rodas', selectedWheelColor)} />
          </div>

          {/* 5. Bancos da Frente */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Armchair size={14} /> 5. Bancos da Frente
            </span>
            <ColorPickerCustom selectedColorHex={selectedFrontSeatColor} onChangeColor={setSelectedFrontSeatColor} preco={getPartPrice('interior', selectedFrontSeatColor)} />
          </div>

          {/* 6. Bancos Traseiros */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Armchair size={14} /> 6. Bancos Traseiros
            </span>
            <ColorPickerCustom selectedColorHex={selectedInteriorColor} onChangeColor={setSelectedInteriorColor} preco={getPartPrice('interior', selectedInteriorColor)} />
          </div>

          {isBmw && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
                  <Armchair size={14} /> Parte Interna 
                </span>
                <ColorPickerCustom selectedColorHex={selectedInner22Color} onChangeColor={setSelectedInner22Color} preco={getPartPrice('interior', selectedInner22Color)} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
                  <Armchair size={14} /> Parte Interna Lateral 
                </span>
                <ColorPickerCustom selectedColorHex={selectedInner21Color} onChangeColor={setSelectedInner21Color} preco={getPartPrice('interior', selectedInner21Color)} />
              </div>
            </>
          )}

          {/* 7. Teto Interior */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Layers size={14} /> 7. Teto Interior
            </span>
            <ColorPickerCustom selectedColorHex={selectedRoofColor} onChangeColor={setSelectedRoofColor} preco={getPartPrice('pecaPequena', selectedRoofColor)} />
          </div>

          {/* 8. Porta-malas */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Layers size={14} /> 8. Porta-malas
            </span>
            <ColorPickerCustom selectedColorHex={selectedTrunkColor} onChangeColor={setSelectedTrunkColor} preco={getPartPrice('pecaPequena', selectedTrunkColor)} />
          </div>

          {/* 9. Moldura Vidro Traseiro */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Droplets size={14} /> 9. Moldura Vidro Traseiro
            </span>
            <ColorPickerCustom selectedColorHex={selectedRearGlassColor} onChangeColor={setSelectedRearGlassColor} preco={getPartPrice('pecaPequena', selectedRearGlassColor)} />
          </div>

          {/* 10. Luz Traseira */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Lightbulb size={14} /> 10. Luz Traseira
            </span>
            <ColorPickerCustom selectedColorHex={selectedTaillightColor} onChangeColor={setSelectedTaillightColor} preco={getPartPrice('pecaPequena', selectedTaillightColor)} />
          </div>

          {/* 11. Escape / Fumaça */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Flame size={14} /> 11. Escape / Fumaça
            </span>
            <ColorPickerCustom selectedColorHex={selectedExhaustColor} onChangeColor={setSelectedExhaustColor} preco={getPartPrice('pecaPequena', selectedExhaustColor)} />
          </div>

          {/* Vidros */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Droplets size={14} /> Estilo dos Vidros
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