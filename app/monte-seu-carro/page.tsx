'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Palette, Sliders, ShoppingCart, 
  Car, RefreshCw, ChevronLeft, 
  ChevronRight, Settings, Droplets, Bug, Armchair, Search, 
  Disc, Flame, Lightbulb, Shield, Layers
} from "lucide-react";

// PALETA DE CORES (Apenas valores RGB)
const colorMap: Record<string, [number, number, number]> = {
  brancoPerola: [0.95, 0.95, 0.92],
  prataLunar: [0.75, 0.77, 0.8],
  cinzaNardo: [0.35, 0.36, 0.38],
  chumboMetalico: [0.18, 0.19, 0.21],
  pretoBrilhante: [0.08, 0.08, 0.08],
  pretoFosco: [0.03, 0.03, 0.03],
  champanhe: [0.75, 0.68, 0.55],
  marromCafe: [0.22, 0.12, 0.06],
  carameloCouro: [0.45, 0.22, 0.1],
  vermelhoFerrari: [0.85, 0.02, 0.02],
  vermelhoCereja: [0.55, 0.02, 0.05],
  amareloSpeed: [0.95, 0.78, 0.02],
  laranjaLambo: [0.92, 0.32, 0.02],
  azulMidnight: [0.02, 0.12, 0.35],
  azulCyan: [0.0, 0.45, 0.85],
  verdeEsmeralda: [0.02, 0.35, 0.18],
  verdeLimao: [0.22, 0.85, 0.05],
  roxoNeon: [0.38, 0.02, 0.55],
  rosaMagenta: [0.85, 0.05, 0.52],
  bronzeGold: [0.55, 0.42, 0.22],
  aluminioEscovado: [0.65, 0.65, 0.68],
  fibraCarbono: [0.12, 0.12, 0.12],
};

// LISTA DE CORES PADRÕES / SÓBRIAS
const standardColorsList = [
  'brancoPerola', 'prataLunar', 'cinzaNardo', 'chumboMetalico', 
  'pretoBrilhante', 'pretoFosco', 'champanhe', 'marromCafe'
];

// PREÇOS DIFERENCIADOS POR TIPO DE PEÇA E CATEGORIA DE COR
const pricingRules = {
  carroceria: {
    padrao: 2500,
    vibrante: 4000,
  },
  rodas: {
    padrao: 1200,
    vibrante: 1800,
  },
  interior: {
    padrao: 800,
    vibrante: 1200,
  },
  pecaPequena: {
    padrao: 400,
    vibrante: 700,
  }
};

// Função auxiliar que calcula o preço baseado no tipo da peça e na cor escolhida
const getPartPrice = (partType: keyof typeof pricingRules, selectedColorId: string) => {
  if (selectedColorId === "brancoPerola") return 0; // Cor base gratuita
  const isStandard = standardColorsList.includes(selectedColorId);
  const rules = pricingRules[partType] || pricingRules.pecaPequena;
  return isStandard ? rules.padrao : rules.vibrante;
};

function ConteudoMonteSeuCarro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view3dUrl = searchParams.get("view3d");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sketchfabApi, setSketchfabApi] = useState<any>(null);
  
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

  const [glassNodeIds, setGlassNodeIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const [allMaterialsDebug, setAllMaterialsDebug] = useState<any[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  const [debugSearchQuery, setDebugSearchQuery] = useState("");
  
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  
  // Cores iniciais
  const [selectedColor, setSelectedColor] = useState("vermelhoFerrari");
  const [selectedGridColor, setSelectedGridColor] = useState("pretoFosco");
  const [selectedInteriorColor, setSelectedInteriorColor] = useState("carameloCouro"); 
  const [selectedWheelColor, setSelectedWheelColor] = useState("chumboMetalico");
  const [selectedFrontSeatColor, setSelectedFrontSeatColor] = useState("carameloCouro");
  const [selectedRoofColor, setSelectedRoofColor] = useState("pretoFosco");
  const [selectedTrunkColor, setSelectedTrunkColor] = useState("pretoFosco");
  const [selectedRearGlassColor, setSelectedRearGlassColor] = useState("pretoFosco");
  const [selectedSidePartsColor, setSelectedSidePartsColor] = useState("pretoFosco");
  const [selectedTaillightColor, setSelectedTaillightColor] = useState("vermelhoFerrari");
  const [selectedExhaustColor, setSelectedExhaustColor] = useState("chumboMetalico");

  const [glassType, setGlassType] = useState("transparente");
  const [currentId, setCurrentId] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // CÁLCULO DINÂMICO DO PREÇO TOTAL BASEADO NO TIPO DE CADA PEÇA
  const precoBaseCarro = 100000;
  
  const precoTotal = 
    precoBaseCarro + 
    getPartPrice('carroceria', selectedColor) +
    getPartPrice('rodas', selectedWheelColor) +
    getPartPrice('interior', selectedFrontSeatColor) +
    getPartPrice('interior', selectedInteriorColor) +
    getPartPrice('pecaPequena', selectedRoofColor) +
    getPartPrice('pecaPequena', selectedTrunkColor) +
    getPartPrice('pecaPequena', selectedRearGlassColor) +
    getPartPrice('pecaPequena', selectedTaillightColor) +
    getPartPrice('pecaPequena', selectedExhaustColor) +
    (glassType === "preto" ? 800 : 0);

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

                materials.forEach(m => {
                  const n = m.name.toLowerCase();

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
  }, [isReady, currentId]);

  const applyMaterialColor = (matList: any[], colorKey: string) => {
    if (!sketchfabApi) return;
    const novaCor = colorMap[colorKey] || colorMap.pretoFosco;

    if (matList.length === 0) {
      sketchfabApi.getMaterialList((err: any, materials: any[]) => {
        if (!err && materials) {
          materials.forEach((mat: any) => {
            const n = mat.name.toLowerCase();
            if (n.includes("mat_237_19") || n.includes("side")) {
              if (mat.channels && mat.channels.AlbedoPBR) {
                mat.channels.AlbedoPBR.color = novaCor;
                mat.channels.AlbedoPBR.enable = true;
                sketchfabApi.setMaterial(mat, () => {
                  if (typeof sketchfabApi.updateMaterial === "function") sketchfabApi.updateMaterial(mat);
                });
              }
            }
          });
        }
      });
      return;
    }

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
    if (sketchfabApi && glassNodeIds.length > 0) {
      glassNodeIds.forEach((nodeId) => {
        if (glassType === "transparente") sketchfabApi.hide(nodeId);
        else sketchfabApi.show(nodeId);
      });
    }
  }, [glassType, sketchfabApi, glassNodeIds]);

  const testPaintMaterialDebug = (matToTest: any) => {
    if (!sketchfabApi) return;
    const materialCopy = { ...matToTest };
    if (materialCopy.channels && materialCopy.channels.AlbedoPBR) {
      materialCopy.channels.AlbedoPBR.color = [0.0, 1.0, 0.0];
      sketchfabApi.setMaterial(materialCopy, () => {
        if (typeof sketchfabApi.updateMaterial === "function") sketchfabApi.updateMaterial(materialCopy);
      });
    }
  };

  const resetDebugColors = () => window.location.reload();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center text-purple-400 font-semibold">
        Carregando 3D...
      </div>
    );
  }

  const standardColors = [
    { id: 'brancoPerola', label: 'Branco Pérola', bg: 'bg-gray-100' },
    { id: 'prataLunar', label: 'Prata Lunar', bg: 'bg-gray-300' },
    { id: 'cinzaNardo', label: 'Cinza Nardo', bg: 'bg-zinc-500' },
    { id: 'chumboMetalico', label: 'Chumbo Metálico', bg: 'bg-zinc-700' },
    { id: 'pretoBrilhante', label: 'Preto Brilhante', bg: 'bg-gray-900' },
    { id: 'pretoFosco', label: 'Preto Fosco', bg: 'bg-black border border-white/20' },
    { id: 'champanhe', label: 'Champanhe', bg: 'bg-stone-300' },
    { id: 'marromCafe', label: 'Marrom Café', bg: 'bg-stone-800' },
    { id: 'carameloCouro', label: 'Couro Caramelo', bg: 'bg-amber-700' },
    { id: 'aluminioEscovado', label: 'Alumínio Escovado', bg: 'bg-slate-400' },
    { id: 'fibraCarbono', label: 'Fibra de Carbono', bg: 'bg-zinc-950 border border-zinc-700' },
  ];

  const vibrantColors = [
    { id: 'vermelhoFerrari', label: 'Vermelho Esportivo', bg: 'bg-red-600' },
    { id: 'vermelhoCereja', label: 'Vermelho Cereja', bg: 'bg-rose-900' },
    { id: 'amareloSpeed', label: 'Amarelo Speed', bg: 'bg-yellow-400' },
    { id: 'laranjaLambo', label: 'Laranja Racing', bg: 'bg-orange-500' },
    { id: 'azulMidnight', label: 'Azul Midnight', bg: 'bg-blue-950 border border-blue-500/30' },
    { id: 'azulCyan', label: 'Azul Elétrico', bg: 'bg-blue-500' },
    { id: 'verdeEsmeralda', label: 'Verde Esmeralda', bg: 'bg-emerald-600' },
    { id: 'verdeLimao', label: 'Verde Limão', bg: 'bg-lime-500' },
    { id: 'roxoNeon', label: 'Roxo Neon', bg: 'bg-purple-600' },
    { id: 'rosaMagenta', label: 'Rosa Magenta', bg: 'bg-pink-600' },
    { id: 'bronzeGold', label: 'Bronze / Ouro', bg: 'bg-amber-600' },
  ];

  const renderColorGrid = (selectedVal: string, setter: (val: string) => void, partType: keyof typeof pricingRules) => {
    const currentPrice = getPartPrice(partType, selectedVal);
    const rules = pricingRules[partType];

    return (
      <div className="flex flex-col gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1.5">
            Cores Vibrantes (+R$ {rules.vibrante})
          </span>
          <div className="grid grid-cols-6 gap-2">
            {vibrantColors.map((c) => (
              <button key={c.id} onClick={() => setter(c.id)} title={c.label}
                className={`h-9 rounded-xl transition-all cursor-pointer ${c.bg} ${selectedVal === c.id ? "ring-2 ring-purple-500 scale-110 shadow-lg" : "opacity-75 hover:opacity-100"}`} />
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1.5">
            Cores Padrões (+R$ {rules.padrao})
          </span>
          <div className="grid grid-cols-6 gap-2">
            {standardColors.map((c) => (
              <button key={c.id} onClick={() => setter(c.id)} title={c.label}
                className={`h-9 rounded-xl transition-all cursor-pointer ${c.bg} ${selectedVal === c.id ? "ring-2 ring-purple-500 scale-110 shadow-lg" : "opacity-75 hover:opacity-100"}`} />
            ))}
          </div>
        </div>

        <div className="text-[11px] text-purple-300 flex justify-between bg-[#1b1b26] px-3 py-1.5 rounded-lg border border-white/5">
          <span>Acréscimo desta seção:</span>
          <span className="font-bold">{currentPrice === 0 ? "Incluso" : `+ R$ ${currentPrice.toLocaleString('pt-BR')}`}</span>
        </div>
      </div>
    );
  };

  const filteredDebugMaterials = allMaterialsDebug.filter((mat) => 
    mat.name.toLowerCase().includes(debugSearchQuery.toLowerCase()) ||
    String(mat.id).includes(debugSearchQuery)
  );

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

      {/* PAINEL DE DEBUG */}
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

          {/* 1. Pintura Externa (Carroceria - Preço Maior) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Palette size={14} /> 1. Pintura Externa
            </span>
            {renderColorGrid(selectedColor, setSelectedColor, 'carroceria')}
          </div>

          {/* 3. Rodas (Preço Intermediário) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Disc size={14} /> 3. Rodas 
            </span>
            {renderColorGrid(selectedWheelColor, setSelectedWheelColor, 'rodas')}
          </div>

          {/* 5. Bancos da Frente (Interior) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Armchair size={14} /> 5. Bancos da Frente 
            </span>
            {renderColorGrid(selectedFrontSeatColor, setSelectedFrontSeatColor, 'interior')}
          </div>

          {/* 6. Bancos Traseiros (Interior) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Armchair size={14} /> 6. Bancos Traseiros 
            </span>
            {renderColorGrid(selectedInteriorColor, setSelectedInteriorColor, 'interior')}
          </div>

          {/* 7. Teto Interior (Peça Pequena) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Layers size={14} /> 7. Teto Interior 
            </span>
            {renderColorGrid(selectedRoofColor, setSelectedRoofColor, 'pecaPequena')}
          </div>

          {/* 8. Porta-malas (Peça Pequena) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Layers size={14} /> 8. Porta-malas 
            </span>
            {renderColorGrid(selectedTrunkColor, setSelectedTrunkColor, 'pecaPequena')}
          </div>

          {/* 9. Moldura Vidro Traseiro (Peça Pequena) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Droplets size={14} /> 9. Moldura Vidro Traseiro 
            </span>
            {renderColorGrid(selectedRearGlassColor, setSelectedRearGlassColor, 'pecaPequena')}
          </div>

          {/* 10. Luz Traseira (Peça Pequena) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Lightbulb size={14} /> 10. Luz Traseira 
            </span>
            {renderColorGrid(selectedTaillightColor, setSelectedTaillightColor, 'pecaPequena')}
          </div>

          {/* 11. Escape / Fumaça (Peça Pequena) */}
          <div className="flex flex-col gap-3 bg-[#12121a] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Flame size={14} /> 11. Escape/Fumaça (mat_237_61)
            </span>
            {renderColorGrid(selectedExhaustColor, setSelectedExhaustColor, 'pecaPequena')}
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
          <Link href="#" className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-600/40 text-sm">
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