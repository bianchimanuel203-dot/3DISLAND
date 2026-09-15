"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Leva, useControls } from "leva";

function Product({ color }: { color: string }) {
  return (
    <group rotation={[0.2, 0.5, 0]}>
      
      {/* BASE PRINCIPAL */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2, 0.3, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>

      {/* SOPORTE IZQUIERDO */}
      <mesh position={[-0.8, 0.3, 0]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>

      {/* SOPORTE DERECHO */}
      <mesh position={[0.8, 0.3, 0]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>

      {/* CONECTOR SUPERIOR */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.6]} />
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

    </group>
  );
}

export default function Configurator() {

  // 🎨 COLOR GENGAR POR DEFECTO
  const { color } = useControls({
    color: "#b300ff",
  });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "radial-gradient(circle at top, #120018, #000)",
        color: "white",
        overflow: "hidden",
      }}
    >

      {/* PANEL IZQUIERDO */}
      <div
        style={{
          width: "320px",
          padding: "20px",
          borderRight: "1px solid #2a0033",
          background: "#0b0010",
        }}
      >
        <h2 style={{ color: "#b300ff", marginBottom: "10px" }}>
          CONFIGURADOR 3D
        </h2>

        <p style={{ color: "#888", fontSize: "13px" }}>
          Personaliza tu producto de impresión 3D estilo Gengar.
        </p>

        {/* CONTROL DE COLOR */}
        <div style={{ marginTop: "20px" }}>
          <Leva collapsed={false} />
        </div>

        {/* BOTÓN COMPRA */}
        <button
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "#b300ff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            color: "white",
            boxShadow: "0 0 20px rgba(179,0,255,0.4)",
          }}
        >
          AÑADIR AL CARRITO
        </button>

        <p style={{ marginTop: "20px", fontSize: "11px", color: "#444" }}>
          3D ISLAND • Canary Islands • Print Lab
        </p>
      </div>

      {/* ESCENA 3D */}
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>

          {/* LUCES ESTILO NEÓN FANTASMA */}
          <ambientLight intensity={0.4} />

          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#b300ff" />
          <directionalLight position={[-5, 2, -5]} intensity={0.6} color="#4b0082" />

          {/* PRODUCTO */}
          <Product color={color} />

          {/* CONTROLES DE CÁMARA */}
          <OrbitControls enablePan={false} />

        </Canvas>
      </div>

    </div>
  );
}