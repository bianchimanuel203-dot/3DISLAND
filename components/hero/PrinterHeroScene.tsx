"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import PrinterModel from "./PrinterModel";
import HintBadge, { type HintState } from "./HintBadge";
import { useHeroShopNavigation } from "./useHeroShopNavigation";

export default function PrinterHeroScene() {
  const [sceneReady, setSceneReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPrinterHovered, setIsPrinterHovered] = useState(false);

  const { navigateToShop } = useHeroShopNavigation(sceneReady);

  const hintState: HintState = useMemo(() => {
    if (isDragging) return "dragging";
    if (isPrinterHovered) return "hover";
    return "idle";
  }, [isDragging, isPrinterHovered]);

  const handleOrbitStart = useCallback(() => setIsDragging(true), []);
  const handleOrbitEnd = useCallback(() => setIsDragging(false), []);

  const isWebGL2Ready = useCallback(() => {
    // This check is kept minimal; actual context validation is done in onCreated.
    return true;
  }, []);

  return (
    <div className="experience-root">
      <div className="fixed inset-0 z-[9] bg-[#05050A]" />

      {!sceneReady && (
        <div className="fixed inset-0 z-[11] bg-[#05050A]" />
      )}

      <div
        className="fixed inset-0 z-9  bg-[#0D0D18]"
        style={{
          opacity: sceneReady ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
        }}
      >
        <Canvas
          style={{ background: "#121220" }}
          gl={{
            alpha: false,
            antialias: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={(state) => {
            // Don't block render; just ensure context looks valid.
            try {
              const gl: any = state.gl;
              const ctx = gl?.getContext?.("webgl2");
              if (!ctx) {
                // If WebGL2 is not available, we still keep the scene and let drei render.
                // The context lost issues are handled elsewhere.
                console.warn("WebGL2 context not available");
              }
            } catch {
              // no-op
            }
          }}
        >
          <Suspense fallback={null}>
            <Stage
              intensity={0.4}
              environment="studio"
              adjustCamera={2.4}
              shadows={false}
              preset="soft"
            >
              <ambientLight intensity={0.18} color="#1A0A2E" />
              <pointLight
                position={[-3.5, 4, 2.5]}
                intensity={20}
                color="#A855F7"
                distance={14}
                decay={2}
              />
              <pointLight
                position={[0, 2.5, -4]}
                intensity={30}
                color="#C77DFF"
                distance={8}
                decay={2}
              />
              <pointLight
                position={[0, -1.8, 1]}
                intensity={5}
                color="#6D28D9"
                distance={5}
                decay={2}
              />

              {isWebGL2Ready() && (
                <PrinterModel
                  onReady={() => setSceneReady(true)}
                  onGlbLoaded={() => {
                    // Keeping side-effects in parent only.
                    // (Any loader/normalization is handled in PrinterModel.)
                  }}
                  onPrinterClick={navigateToShop}
                  onPrinterPointerOver={() => setIsPrinterHovered(true)}
                  onPrinterPointerOut={() => setIsPrinterHovered(false)}
                />
              )}
            </Stage>
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.2}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            onStart={handleOrbitStart}
            onEnd={handleOrbitEnd}
          />
        </Canvas>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[15] flex flex-col items-center justify-start pt-[8vh] text-center">
        <h1 className="m-0 font-black tracking-[0.2em] text-[#E9D5FF] text-[clamp(2.2rem,8vw,4rem)]">
          3D ISLAND
        </h1>
      </div>

      <div className="fixed inset-0 z-[30] pointer-events-none">
        <HintBadge state={hintState} />
      </div>

      <div
        className="hero-scroll-sentinel pointer-events-none relative z-[2] h-[400vh] w-full"
        aria-hidden
      />
    </div>
  );
}

