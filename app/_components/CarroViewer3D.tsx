"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";

// centraliza o carro
function Model({ url, color }: { url: string; color: string }) {
  const { scene } = useGLTF(url);
  
  // customizar os materiais
  return (
    <Center top>
      <primitive object={scene} scale={1.2} />
    </Center>
  );
}

export default function CarroViewer3D({ modelo, color }: { modelo: string; color: string }) {
  //arquivo glb
  let glbPath = "/2018_audi_e-tron_gt_concept.glb"; 
  
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
        {/* iluminação */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 15]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Model url={glbPath} color={color} />
        </Suspense>

        {/* Controles da câmera  */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={3} 
          maxDistance={8} 
          maxPolarAngle={Math.PI / 2 - 0.05} // Impede ir abaixo do horizonte
          minPolarAngle={Math.PI / 6} // Limita o topo
        />
      </Canvas>
    </div>
  );
}