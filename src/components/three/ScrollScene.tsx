"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { bindMotion, motionState } from "@/lib/motion";

/*
 * The WebGL layer. Right now it holds one thing: the brand mark, revolving beside the motto as it
 * scrolls into view, glued to the #logo-anchor div in Hero.tsx. The camera tilts slightly with the mouse.
 */

const CAM_Z = 9;
const smooth = { velocity: 0 };

function ScrollDriver() {
  useEffect(() => bindMotion(), []);
  useFrame(({ camera }, delta) => {
    const target = THREE.MathUtils.clamp(motionState.velocity / 60, -1, 1);
    motionState.velocity = 0;
    smooth.velocity = THREE.MathUtils.damp(smooth.velocity, target, 4, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, motionState.pointerX * 0.3, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, motionState.pointerY * 0.18, 3, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const LOGO_ASPECT = 571 / 532;

function LogoSpinner() {
  const map = useTexture("/brand/logo.png", (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  });
  const ref = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const el = document.getElementById("logo-anchor");
    if (!el) {
      g.visible = false;
      return;
    }
    const r = el.getBoundingClientRect();
    g.visible = r.bottom > 0 && r.top < size.height;
    if (!g.visible) return;
    const t = state.clock.elapsedTime;
    g.position.set(
      ((r.left + r.width / 2) / size.width - 0.5) * viewport.width,
      -((r.top + r.height / 2) / size.height - 0.5) * viewport.height + Math.sin(t * 0.8) * 0.08,
      0.4,
    );
    g.scale.setScalar((r.width / size.width) * viewport.width * 0.78);
    // One and a half turns over its trip through the viewport, plus a slow idle turn and a scroll kick.
    const trip = (size.height - r.top) / (size.height + r.height);
    g.rotation.set(0.12 * Math.sin(t * 0.5), trip * Math.PI * 1.5 + t * 0.35 + smooth.velocity * 0.8, 0.05 * Math.cos(t * 0.4));
  });

  // Two front-facing planes back to back, so the mark reads correctly from either side.
  return (
    <group ref={ref} visible={false}>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[1, LOGO_ASPECT]} />
        <meshStandardMaterial map={map} transparent alphaTest={0.2} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1, LOGO_ASPECT]} />
        <meshStandardMaterial map={map} transparent alphaTest={0.2} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function ScrollScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 38, position: [0, 0, CAM_Z], near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ScrollDriver />
      {/* Studio lighting built from light panels: soft top light, mint rim, white front fill. No downloads. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 2]} scale={[10, 6, 1]} rotation={[-Math.PI / 2.2, 0, 0]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.2} position={[0, 1, 8]} scale={[8, 5, 1]} color="#f4faf7" />
        <Lightformer form="rect" intensity={2.5} position={[-7, 2, 1]} scale={[2, 6, 1]} rotation={[0, Math.PI / 2, 0]} color="#8acfb5" />
        <Lightformer form="rect" intensity={1.5} position={[7, -1, 1]} scale={[2, 6, 1]} rotation={[0, -Math.PI / 2, 0]} color="#ffffff" />
      </Environment>
      <ambientLight intensity={0.35} />
      <Suspense fallback={null}>
        <LogoSpinner />
      </Suspense>
    </Canvas>
  );
}
