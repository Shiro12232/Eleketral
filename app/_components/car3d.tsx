'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, Environment } from '@react-three/drei';

interface Car3DProps {
  bodyColor?: string;
  rimColor?: string;
  grilleColor?: string;
}

// Carrega o modelo 3Ds. lataria, rodas, placa
function CarModel({ bodyColor = "#90309B", rimColor = "#ef4444", grilleColor = "#000000" }: Car3DProps) {
  const { scene } = useGLTF('/2019_toyota_camry_hybrid_xse.glb');
  
  React.useEffect(() => {
    // placa escrita eleketral
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 16;
      context.strokeStyle = '#000000';
      context.strokeRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#000000';
      context.font = 'bold 55px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('ELEKETRAL', canvas.width / 2, canvas.height / 2);
    }
    const plateTexture = new THREE.CanvasTexture(canvas);

    // aplicar as cores
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();
          const name = (child.name + (child.material.name || "")).toLowerCase();

          if (name.includes("plate") || name.includes("license")) {
            child.material.map = plateTexture;
            child.material.needsUpdate = true;
          } else if ((name.includes("rim") || name.includes("spoke") || name.includes("wheel") || name.includes("hub")) && !name.includes("tire")) {
            child.material.color.set(rimColor);
            child.material.map = null;
            child.material.needsUpdate = true;
          } else if (name.includes("tire") || name.includes("rubber")) {
            child.material.color.set("#1a1a1a");
          } else if (name.includes("grille") || name.includes("grill") || name.includes("mesh") || name.includes("grid")) {
            child.material.color.set(grilleColor);
          } else if (name.includes("body") || name.includes("paint") || name.includes("exterior")) {
            child.material.color.set(bodyColor);
          }
        }
      }
    });
  }, [scene, bodyColor, rimColor, grilleColor]);

  return <primitive object={scene} scale={9.5} position={[0.5, -0.4, 0]} />;
}

// tela de carregando
function Carregando() {
  return (
    <Html center>
      <div className="text-purple-400 font-bold text-xl whitespace-nowrap animate-pulse">
        Carregando 3D...
      </div>
    </Html>
  );
}

export default function Car3D({ 
  bodyColor = "#90309B", 
  rimColor = "#ef4444", 
  grilleColor = "#000000" 
}: Car3DProps) {
  return (
    <section className="relative w-full flex items-center overflow-hidden pb-12 pt-12">
      {/*  luz de fundo */}
      <div className="absolute top-1/2 right-20 -translate-y-1/2 w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
      

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 px-4 md:px-8">
        
        {/* textos do lado esquerdo */}
        <div className="flex flex-col gap-6">
          <span className="text-purple-400 font-semibold tracking-wider text-xs uppercase">MONTE DO SEU JEITO</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Personalize <br /> seu carro com <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">estilo e potência.</span>
          </h1>
          <p className="text-gray-400 text-base max-w-lg">Oferecemos os melhores serviços para customização do seu carro com as melhores peças.</p>

          <div className="flex flex-col items-center lg:items-start gap-4 pt-2">
            <Link href="/selecionar-carro" className="bg-purple-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg max-w-max cursor-pointer">
              Monte seu carro
            </Link>
            <Link href="/catalogo" className="bg-purple-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg w-max cursor-pointer">
              Veja nossos produtos
            </Link>
          </div>
        </div>

        {/* 3d do lado direito, parte do palco */}
        <div className="relative w-full h-[480px] md:h-[480px] flex items-center justify-center">
          <Canvas shadows camera={{ position: [7, 1.8, 7], fov: 42 }} className="w-full h-full cursor-grab active:cursor-grabbing">
            <ambientLight intensity={0.5} />
            
            <directionalLight 
              position={[10, 15, 10]} 
              intensity={2} 
              castShadow 
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
            />
            
            <Suspense fallback={<Carregando />}>
              <Environment preset="city" />
              
              <CarModel bodyColor={bodyColor} rimColor={rimColor} grilleColor={grilleColor} />

              {/* sombra */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.4} />
              </mesh>
            </Suspense>
            
            {/* controle */}
            <OrbitControls 
              enableZoom={true} 
              zoomSpeed={0.8}
              enablePan={false}
              makeDefault
              minDistance={4}
              maxDistance={12}
            />
          </Canvas>
        </div>

      </div>
    </section>
  );
}