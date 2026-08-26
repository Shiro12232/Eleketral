'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Palette, Sliders, ShoppingCart, 
  Car, RefreshCw, ChevronLeft, 
  ChevronRight, Settings, Droplets, Bug, Search, 
  Disc, Layers, Shield
} from "lucide-react";

// Função auxiliar para converter HEX em RGB [0..1] para o Sketchfab
const hexToRgb01 = (hex: string): [number, number, number] => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  ];
};

// Componente do Seletor de Cores Interativo HSL com preço individual opcional
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
    const hex = handleHslToHex(h, s, l);
    onChangeColor(hex);
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

function ConteudoMonteSeuCarro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view3dUrl = searchParams.get("view3d");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sketchfabApi, setSketchfabApi] = useState<any>(null);
  
  // Estados para cada um dos 18 materiais exatos
  const [carPaintMats, setCarPaintMats] = useState<any[]>([]); 
  const [blackShineMats, setBlackShineMats] = useState<any[]>([]); 
  const [tireTextureMats, setTireTextureMats] = useState<any[]>([]); 
  const [plasticBlackMats, setPlasticBlackMats] = useState<any[]>([]); 
  const [chromeMats, setChromeMats] = useState<any[]>([]); 
  const [glassLightMats, setGlassLightMats] = useState<any[]>([]); 
  const [leatherColorBMats, setLeatherColorBMats] = useState<any[]>([]); 
  const [dGrayMats, setDGrayMats] = useState<any[]>([]); 
  const [leatherPlasBMats, setLeatherPlasBMats] = useState<any[]>([]); 
  const [glassSurrMats, setGlassSurrMats] = useState<any[]>([]); 
  const [leatherDotsColMats, setLeatherDotsColMats] = useState<any[]>([]); 
  const [chassisMats, setChassisMats] = useState<any[]>([]); 
  const [rubberMats, setRubberMats] = useState<any[]>([]); 
  const [breaksDiskMats, setBreaksDiskMats] = useState<any[]>([]); 
  const [chromeColorMats, setChromeColorMats] = useState<any[]>([]); 
  const [leatherBMats, setLeatherBMats] = useState<any[]>([]); 
  const [chromeBlackMats, setChromeBlackMats] = useState<any[]>([]); 
  const [outrosMats, setOutrosMats] = useState<any[]>([]); 

  const [glassNodeIds, setGlassNodeIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const [allMaterialsDebug, setAllMaterialsDebug] = useState<any[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugSearchQuery, setDebugSearchQuery] = useState("");
  
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  
  // Cores em formato HEX para cada bloco
  const [cCarPaint, setCCarPaint] = useState("#FF5733");
  const [cBlackShine, setCBlackShine] = useState("#111111");
  const [cTireTexture, setCTireTexture] = useState("#222222");
  const [cPlasticBlack, setCPlasticBlack] = useState("#1b1b1b");
  const [cChrome, setCChrome] = useState("#AAAAAA");
  const [cGlassLight, setCGlassLight] = useState("#E60000");
  const [cLeatherColorB, setCLeatherColorB] = useState("#B8621B");
  const [cDGray, setCDGray] = useState("#4A4A4A");
  const [cLeatherPlasB, setCLeatherPlasB] = useState("#2A2A2A");
  const [cGlassSurr, setCGlassSurr] = useState("#1A1A1A");
  const [cLeatherDotsCol, setCLeatherDotsCol] = useState("#B8621B");
  const [cChassis, setCChassis] = useState("#151515");
  const [cRubber, setCRubber] = useState("#1F1F1F");
  const [cBreaksDisk, setCBreaksDisk] = useState("#CCCCCC");
  const [cChromeColor, setCChromeColor] = useState("#A0A0A0");
  const [cLeatherB, setCLeatherB] = useState("#B8621B");
  const [cChromeBlack, setCChromeBlack] = useState("#111111");

  const [glassType, setGlassType] = useState("transparente");
  const [currentId, setCurrentId] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Preços fixos individuais para cada seção
  const precos = {
    carPaint: 4000,
    blackShine: 500,
    tireTexture: 300,
    plasticBlack: 400,
    chrome: 600,
    glassLight: 350,
    leatherColorB: 800,
    dGray: 450,
    leatherPlasB: 500,
    glassSurr: 300,
    leatherDotsCol: 400,
    chassis: 900,
    rubber: 250,
    breaksDisk: 700,
    chromeColor: 600,
    leatherB: 800,
    chromeBlack: 500,
    vidros: glassType === "preto" ? 800 : 0
  };

  const precoTotal = Object.values(precos).reduce((acc, val) => acc + val, 0);

  const filteredDebugMaterials = allMaterialsDebug.filter((mat) => {
    const query = debugSearchQuery.toLowerCase();
    return (mat.name && mat.name.toLowerCase().includes(query)) || (mat.id && mat.id.toString().includes(query));
  });

  const testPaintMaterialDebug = (mat: any) => {
    if (!sketchfabApi || !mat) return;
    const verdeColor: [number, number, number] = [0.02, 0.85, 0.05];
    if (mat.channels && mat.channels.AlbedoPBR) {
      mat.channels.AlbedoPBR.color = verdeColor;
      mat.channels.AlbedoPBR.enable = true;
      if (mat.channels.AlbedoPBR.texture) {
        mat.channels.AlbedoPBR.texture = null;
      }
      sketchfabApi.setMaterial(mat, () => {
        if (typeof sketchfabApi.updateMaterial === "function") sketchfabApi.updateMaterial(mat);
      });
    }
  };

  const handleAddToCart = () => {
    const itensConfigurados = [
      { nome: "Veículo Base", detalhe: `${marca} ${modelo}`, preco: 0 },
      { nome: "1. CarPaint (Pintura Carro)", detalhe: cCarPaint, preco: precos.carPaint },
      { nome: "2. Black_Shine", detalhe: cBlackShine, preco: precos.blackShine },
      { nome: "3. Tire_Texture", detalhe: cTireTexture, preco: precos.tireTexture },
      { nome: "4. Plastic_Black", detalhe: cPlasticBlack, preco: precos.plasticBlack },
      { nome: "5. Chrome", detalhe: cChrome, preco: precos.chrome },
      { nome: "6. Glass_Light", detalhe: cGlassLight, preco: precos.glassLight },
      { nome: "7. Leather_Color_B", detalhe: cLeatherColorB, preco: precos.leatherColorB },
      { nome: "8. D_Gray", detalhe: cDGray, preco: precos.dGray },
      { nome: "9. Leather_Plas_B", detalhe: cLeatherPlasB, preco: precos.leatherPlasB },
      { nome: "10. Glass_surr", detalhe: cGlassSurr, preco: precos.glassSurr },
      { nome: "11. Leather_Dots_Col", detalhe: cLeatherDotsCol, preco: precos.leatherDotsCol },
      { nome: "12. Chassis", detalhe: cChassis, preco: precos.chassis },
      { nome: "13. Rubber", detalhe: cRubber, preco: precos.rubber },
      { nome: "14. Breaks_disk", detalhe: cBreaksDisk, preco: precos.breaksDisk },
      { nome: "15. Chrome_Color", detalhe: cChromeColor, preco: precos.chromeColor },
      { nome: "16. Leather_B", detalhe: cLeatherB, preco: precos.leatherB },
      { nome: "17. Chrome_Black", detalhe: cChromeBlack, preco: precos.chromeBlack },
      { nome: "18. Estilo dos Vidros", detalhe: glassType, preco: precos.vidros },
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
                
                const mCarPaint: any[] = [];
                const mBlackShine: any[] = [];
                const mTireTexture: any[] = [];
                const mPlasticBlack: any[] = [];
                const mChrome: any[] = [];
                const mGlassLight: any[] = [];
                const mLeatherColorB: any[] = [];
                const mDGray: any[] = [];
                const mLeatherPlasB: any[] = [];
                const mGlassSurr: any[] = [];
                const mLeatherDotsCol: any[] = [];
                const mChassis: any[] = [];
                const mRubber: any[] = [];
                const mBreaksDisk: any[] = [];
                const mChromeColor: any[] = [];
                const mLeatherB: any[] = [];
                const mChromeBlack: any[] = [];
                const mOutros: any[] = [];

                materials.forEach(m => {
                  const n = m.name;
                  if (n === "CarPaint") mCarPaint.push(m);
                  else if (n === "Black_Shine") mBlackShine.push(m);
                  else if (n === "Tire_Texture") mTireTexture.push(m);
                  else if (n === "Plastic_Black") mPlasticBlack.push(m);
                  else if (n === "Chrome") mChrome.push(m);
                  else if (n === "Glass_Light") mGlassLight.push(m);
                  else if (n === "Leather_Color_B") mLeatherColorB.push(m);
                  else if (n === "D_Gray") mDGray.push(m);
                  else if (n === "Leather_Plas_B") mLeatherPlasB.push(m);
                  else if (n === "Glass_surr") mGlassSurr.push(m);
                  else if (n === "Leather_Dots_Col") mLeatherDotsCol.push(m);
                  else if (n === "Chassis") mChassis.push(m);
                  else if (n === "rubber") mRubber.push(m);
                  else if (n === "Breaks_disk") mBreaksDisk.push(m);
                  else if (n === "Chrome_Color") mChromeColor.push(m);
                  else if (n === "Leather_B") mLeatherB.push(m);
                  else if (n === "Chrome_Black") mChromeBlack.push(m);
                  else mOutros.push(m);
                });

                setCarPaintMats(mCarPaint);
                setBlackShineMats(mBlackShine);
                setTireTextureMats(mTireTexture);
                setPlasticBlackMats(mPlasticBlack);
                setChromeMats(mChrome);
                setGlassLightMats(mGlassLight);
                setLeatherColorBMats(mLeatherColorB);
                setDGrayMats(mDGray);
                setLeatherPlasBMats(mLeatherPlasB);
                setGlassSurrMats(mGlassSurr);
                setLeatherDotsColMats(mLeatherDotsCol);
                setChassisMats(mChassis);
                setRubberMats(mRubber);
                setBreaksDiskMats(mBreaksDisk);
                setChromeColorMats(mChromeColor);
                setLeatherBMats(mLeatherB);
                setChromeBlackMats(mChromeBlack);
                setOutrosMats(mOutros);
              }
            });

            api.getNodeMap((err: any, nodes: Record<string, any>) => {
              if (!err && nodes) {
                const glassIds: number[] = [];
                Object.values(nodes).forEach((node: any) => {
                  if (node.type === 'MatrixTransform' && node.name) {
                    const nameLower = node.name.toLowerCase();
                    if (nameLower.includes("glass") || nameLower.includes("window") || nameLower.includes("vidro")) {
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

  // Função atualizada para aplicar cor sólida RGB pura e remover textura antiga
  const applyMaterialHex = (matList: any[], hexColor: string) => {
    if (!sketchfabApi) return;
    const rgbArray = hexToRgb01(hexColor);

    matList.forEach((mat: any) => {
      if (mat.channels && mat.channels.AlbedoPBR) {
        mat.channels.AlbedoPBR.color = rgbArray;
        mat.channels.AlbedoPBR.enable = true;
        
        // Remove textura anterior para que o RGB substitua a pintura base
        if (mat.channels.AlbedoPBR.texture) {
          mat.channels.AlbedoPBR.texture = null;
        }

        sketchfabApi.setMaterial(mat, () => {
          if (typeof sketchfabApi.updateMaterial === "function") {
            sketchfabApi.updateMaterial(mat);
          }
        });
      }
    });
  };

  useEffect(() => { applyMaterialHex(carPaintMats, cCarPaint); }, [cCarPaint, sketchfabApi, carPaintMats]);
  useEffect(() => { applyMaterialHex(blackShineMats, cBlackShine); }, [cBlackShine, sketchfabApi, blackShineMats]);
  useEffect(() => { applyMaterialHex(tireTextureMats, cTireTexture); }, [cTireTexture, sketchfabApi, tireTextureMats]);
  useEffect(() => { applyMaterialHex(plasticBlackMats, cPlasticBlack); }, [cPlasticBlack, sketchfabApi, plasticBlackMats]);
  useEffect(() => { applyMaterialHex(chromeMats, cChrome); }, [cChrome, sketchfabApi, chromeMats]);
  useEffect(() => { applyMaterialHex(glassLightMats, cGlassLight); }, [cGlassLight, sketchfabApi, glassLightMats]);
  useEffect(() => { applyMaterialHex(leatherColorBMats, cLeatherColorB); }, [cLeatherColorB, sketchfabApi, leatherColorBMats]);
  useEffect(() => { applyMaterialHex(dGrayMats, cDGray); }, [cDGray, sketchfabApi, dGrayMats]);
  useEffect(() => { applyMaterialHex(leatherPlasBMats, cLeatherPlasB); }, [cLeatherPlasB, sketchfabApi, leatherPlasBMats]);
  useEffect(() => { applyMaterialHex(glassSurrMats, cGlassSurr); }, [cGlassSurr, sketchfabApi, glassSurrMats]);
  useEffect(() => { applyMaterialHex(leatherDotsColMats, cLeatherDotsCol); }, [cLeatherDotsCol, sketchfabApi, leatherDotsColMats]);
  useEffect(() => { applyMaterialHex(chassisMats, cChassis); }, [cChassis, sketchfabApi, chassisMats]);
  useEffect(() => { applyMaterialHex(rubberMats, cRubber); }, [cRubber, sketchfabApi, rubberMats]);
  useEffect(() => { applyMaterialHex(breaksDiskMats, cBreaksDisk); }, [cBreaksDisk, sketchfabApi, breaksDiskMats]);
  useEffect(() => { applyMaterialHex(chromeColorMats, cChromeColor); }, [cChromeColor, sketchfabApi, chromeColorMats]);
  useEffect(() => { applyMaterialHex(leatherBMats, cLeatherB); }, [cLeatherB, sketchfabApi, leatherBMats]);
  useEffect(() => { applyMaterialHex(chromeBlackMats, cChromeBlack); }, [cChromeBlack, sketchfabApi, chromeBlackMats]);
  useEffect(() => { applyMaterialHex(outrosMats, cPlasticBlack); }, [cPlasticBlack, sketchfabApi, outrosMats]);

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
        Carregando Infiniti Completa (18 Materiais)...
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
          <button 
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="bg-black/85 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Bug size={14} /> {showDebugPanel ? "Ocultar Debug" : "Abrir Debug"}
          </button>
        </div>

        {showDebugPanel && (
          <div className="bg-black/95 backdrop-blur-xl border border-purple-500/30 p-4 rounded-2xl w-96 max-h-[500px] overflow-hidden shadow-2xl text-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <span className="font-bold text-purple-400 uppercase tracking-wider block">Inspecionar 18 Materiais</span>
                <span className="text-[10px] text-gray-400">Total listados: {allMaterialsDebug.length}</span>
              </div>
              <span className="bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                {filteredDebugMaterials.length}
              </span>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Pesquisar..."
                value={debugSearchQuery}
                onChange={(e) => setDebugSearchQuery(e.target.value)}
                className="w-full bg-[#12121a] text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 text-xs placeholder-gray-500 transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-2 overflow-y-auto max-h-72 pr-1">
              {filteredDebugMaterials.map((mat, idx) => (
                <div key={idx} className="bg-[#12121a] p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                  <div className="flex flex-col truncate">
                    <span className="font-bold text-white truncate max-w-[200px]" title={mat.name}>{mat.name}</span>
                    <span className="text-[10px] text-gray-400">ID: {mat.id}</span>
                  </div>
                  <button
                    onClick={() => testPaintMaterialDebug(mat)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer whitespace-nowrap shadow-md flex items-center gap-1"
                  >
                    <Palette size={12} /> Pintar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botão lateral */}
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
              <span>Abra o configurador com os 18 materiais!</span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar de customização com o Seletor HSL interativo */}
      <div className={`absolute top-0 left-0 h-full w-full sm:w-[420px] md:w-[450px] bg-[#0b0b0f]/90 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between z-30 transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div className="flex flex-col gap-6 pt-16 md:pt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase flex items-center gap-2">
              <Settings size={18} /> 18 Materiais Infiniti (HSL)
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
                <RefreshCw size={12} /> Trocar
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1b1b26] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Marca</span>
                <span className="text-xs font-bold text-white">{marca || "Infiniti"}</span>
              </div>
              <div className="bg-[#1b1b26] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Modelo</span>
                <span className="text-xs font-bold text-purple-400 truncate block">{modelo || "Custom"}</span>
              </div>
            </div>
          </div>

          {/* 1. CarPaint */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">1. Pintura externa</span>
            <ColorPickerCustom selectedColorHex={cCarPaint} onChangeColor={setCCarPaint} preco={precos.carPaint} />
          </div>

          {/* 2. Black_Shine */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">2. Laterais Vidro</span>
            <ColorPickerCustom selectedColorHex={cBlackShine} onChangeColor={setCBlackShine} preco={precos.blackShine} />
          </div>

          {/* 3. Tire_Texture */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">3. Pneus</span>
            <ColorPickerCustom selectedColorHex={cTireTexture} onChangeColor={setCTireTexture} preco={precos.tireTexture} />
          </div>

          {/* 4. Plastic_Black */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">4. Parachoque</span>
            <ColorPickerCustom selectedColorHex={cPlasticBlack} onChangeColor={setCPlasticBlack} preco={precos.plasticBlack} />
          </div>

          {/* 5. Chrome */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">5. Laterais Exterior</span>
            <ColorPickerCustom selectedColorHex={cChrome} onChangeColor={setCChrome} preco={precos.chrome} />
          </div>

          {/* 6. Glass_Light */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">6. Freio e Faróis</span>
            <ColorPickerCustom selectedColorHex={cGlassLight} onChangeColor={setCGlassLight} preco={precos.glassLight} />
          </div>

          {/* 7. Leather_Color_B */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">7. Bancos</span>
            <ColorPickerCustom selectedColorHex={cLeatherColorB} onChangeColor={setCLeatherColorB} preco={precos.leatherColorB} />
          </div>

          {/* 8. D_Gray */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">8. Rodas</span>
            <ColorPickerCustom selectedColorHex={cDGray} onChangeColor={setCDGray} preco={precos.dGray} />
          </div>

          {/* 9. Leather_Plas_B */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">9. Interior Carro</span>
            <ColorPickerCustom selectedColorHex={cLeatherPlasB} onChangeColor={setCLeatherPlasB} preco={precos.leatherPlasB} />
          </div>

          {/* 10. Glass_surr */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">10. Contorno Vidros</span>
            <ColorPickerCustom selectedColorHex={cGlassSurr} onChangeColor={setCGlassSurr} preco={precos.glassSurr} />
          </div>

          {/* 11. Leather_Dots_Col */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">11. Banco Trás</span>
            <ColorPickerCustom selectedColorHex={cLeatherDotsCol} onChangeColor={setCLeatherDotsCol} preco={precos.leatherDotsCol} />
          </div>

          {/* 12. Chassis */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">12. Chassis</span>
            <ColorPickerCustom selectedColorHex={cChassis} onChangeColor={setCChassis} preco={precos.chassis} />
          </div>

          {/* 13. rubber */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">13. Lateral e Teto Solar</span>
            <ColorPickerCustom selectedColorHex={cRubber} onChangeColor={setCRubber} preco={precos.rubber} />
          </div>

          {/* 14. Breaks_disk */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">14. Disco de Roda</span>
            <ColorPickerCustom selectedColorHex={cBreaksDisk} onChangeColor={setCBreaksDisk} preco={precos.breaksDisk} />
          </div>

          {/* 15. Chrome_Color */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">15. Laterais Parachoque</span>
            <ColorPickerCustom selectedColorHex={cChromeColor} onChangeColor={setCChromeColor} preco={precos.chromeColor} />
          </div>

          {/* 16. Leather_B */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">16. Parte de Dentro</span>
            <ColorPickerCustom selectedColorHex={cLeatherB} onChangeColor={setCLeatherB} preco={precos.leatherB} />
          </div>

          {/* 17. Chrome_Black */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-purple-400 uppercase font-bold">17. Escada das portas</span>
            <ColorPickerCustom selectedColorHex={cChromeBlack} onChangeColor={setCChromeBlack} preco={precos.chromeBlack} />
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