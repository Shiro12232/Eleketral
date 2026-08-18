"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url, color }: { url: string; color: string }) {
  const { scene } = useGLTF(url);
  
  // Aqui você pode aplicar tintas ou materiais se quiser, 
  // mas o foco principal é carregar o modelo perfeitamente centralizado.
  return (
    <Center top>
      <primitive object={scene} scale={1.2} />
    </Center>
  );
}

export default function CarroViewer3D({ modelo, color }: { modelo: string; color: string }) {
  // Mapeia o modelo salvo no localStorage para o arquivo .glb correspondente na pasta public
  let glbPath = "/2018_audi_e-tron_gt_concept.glb"; // padrão
  
  const modeloLower = modelo.toLowerCase();
  if (modeloLower.includes("m3") || modeloLower.includes("bmw")) {
    glbPath = "/1993_bmw_m3_coupe_e36.glb";
  } else if (modeloLower.includes("camry") || modeloLower.includes("toyota")) {
    glbPath = "/2019_toyota_camry_hybrid_xse.glb";
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [5, 2, 5], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 15]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Model url={glbPath} color={color} />
        </Suspense>

        {/* 
          CONTROLES TRAVADOS: 
          - maxPolarAngle impede que o usuário olhe por baixo do chão (evita sensação de flutuar/cabeça para baixo).
          - minPolarAngle limita o topo.
        */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={3} 
          maxDistance={8} 
          maxPolarAngle={Math.PI / 2 - 0.05} // Trava para não ir abaixo do horizonte
          minPolarAngle={Math.PI / 6} // Limita o topo
        />
      </Canvas>
    </div>
  );
}