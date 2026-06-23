"use client";

import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

export type SemiconductorLayerId =
  | "package"
  | "substrate"
  | "interposer"
  | "chiplets"
  | "hbm"
  | "bumps"
  | "thermal"
  | "defects"
  | "cutaway";

export type SemiconductorNetId =
  | "PKG_THERMAL_01"
  | "HBM_SIGNAL_07"
  | "BGA_POWER_A3";

type SemiconductorThreeSceneProps = {
  activeLayers: SemiconductorLayerId[];
  selectedNetId: SemiconductorNetId;
  frame: number;
};

type TraceSegment = {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  color: string;
  opacity?: number;
};

type PadPoint = {
  x: number;
  z: number;
  selected: boolean;
};

const selectedColors: Record<SemiconductorNetId, string> = {
  PKG_THERMAL_01: "#f6d365",
  HBM_SIGNAL_07: "#38bdf8",
  BGA_POWER_A3: "#22c55e"
};

export function SemiconductorThreeScene({
  activeLayers,
  selectedNetId,
  frame
}: SemiconductorThreeSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [5.6, 3.55, 6.4], fov: 35 }}
      dpr={[1, 1.4]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      role="img"
      aria-label="Photorealistic 3D advanced semiconductor package with chiplets and HBM"
    >
      <color attach="background" args={["#05080c"]} />
      <fog attach="fog" args={["#05080c", 8.5, 13]} />
      <ambientLight intensity={0.34} />
      <hemisphereLight args={["#f4fbff", "#090d12", 0.58]} />
      <directionalLight
        position={[3.8, 5.8, 3.2]}
        intensity={3.45}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-4.2, 3.9, 4.3]}
        angle={0.44}
        penumbra={0.72}
        intensity={2.7}
        color="#9edcff"
        castShadow
      />
      <pointLight position={[3.8, 1.45, -3.2]} intensity={1.95} color="#f5c16c" />
      <StudioStage />
      <PackageAssembly
        activeLayers={activeLayers}
        selectedNetId={selectedNetId}
        frame={frame}
      />
      <OrbitControls
        enablePan={false}
        enableZoom
        autoRotate
        autoRotateSpeed={0.16}
        minDistance={5.2}
        maxDistance={8.4}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}

function PackageAssembly({
  activeLayers,
  selectedNetId,
  frame
}: SemiconductorThreeSceneProps) {
  const groupRef = useRef<Group>(null);
  const selectedColor = selectedColors[selectedNetId];
  const show = (layer: SemiconductorLayerId) => activeLayers.includes(layer);
  const hasCutaway = show("cutaway");

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y =
      -0.42 + Math.sin(clock.elapsedTime * 0.22 + frame * 0.005) * 0.035;
  });

  return (
    <group ref={groupRef} rotation={[-0.24, -0.42, 0.018]} scale={1.18}>
      {show("bumps") ? <SolderBallGrid selectedColor={selectedColor} /> : null}
      {show("substrate") ? <OrganicSubstrate selectedColor={selectedColor} /> : null}
      {show("package") ? <PackageBody hasCutaway={hasCutaway} /> : null}
      {show("interposer") ? <SiliconInterposer selectedColor={selectedColor} /> : null}
      {show("bumps") ? <MicroBumpFields selectedColor={selectedColor} /> : null}
      {show("chiplets") ? <LogicChiplets selectedColor={selectedColor} /> : null}
      {show("hbm") ? <HbmStacks /> : null}
      {show("thermal") ? <ThermalPath frame={frame} /> : null}
      {show("defects") ? <InspectionMarkers selectedColor={selectedColor} /> : null}
      <SelectedPath selectedNetId={selectedNetId} selectedColor={selectedColor} />
    </group>
  );
}

function StudioStage() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]} receiveShadow>
        <planeGeometry args={[8.8, 6.4]} />
        <meshStandardMaterial color="#05090e" metalness={0.24} roughness={0.34} />
      </mesh>
      {[-2.2, 0, 2.2].map((x) => (
        <mesh
          key={x}
          position={[x, -0.466, -1.85]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.1, 0.018]} />
          <meshBasicMaterial color="#c7f0ff" transparent opacity={0.16} />
        </mesh>
      ))}
      <mesh position={[0, -0.463, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 2.93, 128]} />
        <meshBasicMaterial color="#5fb7d7" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function SolderBallGrid({ selectedColor }: { selectedColor: string }) {
  const balls = useMemo(() => {
    const output: PadPoint[] = [];

    for (let col = -10; col <= 10; col += 1) {
      for (let row = -6; row <= 6; row += 1) {
        const edgeKeepout = Math.abs(col) > 8 && Math.abs(row) > 4;

        if (!edgeKeepout) {
          output.push({
            x: col * 0.2,
            z: row * 0.2,
            selected: Math.abs(col) <= 1 && row <= -2
          });
        }
      }
    }

    return output;
  }, []);

  return (
    <group position={[0, -0.36, 0]}>
      {balls.map((ball, index) => (
        <mesh key={index} position={[ball.x, 0, ball.z]} castShadow>
          <sphereGeometry args={[0.061, 18, 18]} />
          <meshStandardMaterial
            color={ball.selected ? selectedColor : "#cfd6d8"}
            metalness={0.9}
            roughness={0.18}
            emissive={ball.selected ? selectedColor : "#000000"}
            emissiveIntensity={ball.selected ? 0.12 : 0}
          />
        </mesh>
      ))}
      <mesh position={[-2.2, 0.03, -1.24]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.075, 0.104, 24]} />
        <meshBasicMaterial color="#f4d06f" transparent opacity={0.78} />
      </mesh>
    </group>
  );
}

function OrganicSubstrate({ selectedColor }: { selectedColor: string }) {
  return (
    <group position={[0, -0.16, 0]}>
      <RoundedBox args={[4.9, 0.22, 3.22]} radius={0.08} smoothness={8} castShadow receiveShadow>
        <meshStandardMaterial
          color="#123b33"
          metalness={0.22}
          roughness={0.42}
          emissive="#03150f"
          emissiveIntensity={0.18}
        />
      </RoundedBox>
      {[-0.04, 0.02, 0.08].map((y, index) => (
        <mesh key={y} position={[0, y, 1.64 + index * 0.012]}>
          <boxGeometry args={[4.55, 0.012, 0.026]} />
          <meshBasicMaterial
            color={index === 1 ? "#c49a48" : "#2d796c"}
            transparent
            opacity={0.62}
          />
        </mesh>
      ))}
      <SubstrateRouting selectedColor={selectedColor} />
      <ViaField />
    </group>
  );
}

function SubstrateRouting({ selectedColor }: { selectedColor: string }) {
  const traces = useMemo<TraceSegment[]>(() => {
    const output: TraceSegment[] = [];

    for (let index = 0; index < 34; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const x = -2.1 + (index % 9) * 0.52;
      const z = side * (0.92 + Math.floor(index / 9) * 0.18);
      output.push({
        position: [x, 0.126, z],
        rotation: [0, side > 0 ? 0.25 : -0.25, 0],
        size: [0.34 + (index % 3) * 0.13, 0.012, 0.018],
        color: index % 7 === 0 ? selectedColor : "#c49a48",
        opacity: index % 7 === 0 ? 0.88 : 0.42
      });
    }

    return output;
  }, [selectedColor]);

  return (
    <group>
      {traces.map((trace, index) => (
        <mesh
          key={index}
          position={trace.position}
          rotation={trace.rotation ?? [0, 0, 0]}
        >
          <boxGeometry args={trace.size} />
          <meshBasicMaterial color={trace.color} transparent opacity={trace.opacity ?? 0.6} />
        </mesh>
      ))}
      {[-1.58, -0.82, 0, 0.82, 1.58].map((x) => (
        <mesh key={x} position={[x, 0.132, -1.31]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.52, 0.013, 0.02]} />
          <meshBasicMaterial color="#dac06d" transparent opacity={0.52} />
        </mesh>
      ))}
    </group>
  );
}

function ViaField() {
  const pads = useMemo(() => {
    const output: [number, number][] = [];

    for (let x = -2; x <= 2; x += 0.4) {
      for (let z = -1.18; z <= 1.18; z += 0.4) {
        if (Math.abs(x) > 1.15 || Math.abs(z) > 0.78) {
          output.push([x, z]);
        }
      }
    }

    return output;
  }, []);

  return (
    <group>
      {pads.map(([x, z], index) => (
        <mesh key={index} position={[x, 0.142, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.036, 16]} />
          <meshBasicMaterial color="#e3b85a" transparent opacity={0.46} />
        </mesh>
      ))}
    </group>
  );
}

function PackageBody({ hasCutaway }: { hasCutaway: boolean }) {
  return (
    <group>
      <PackageMold hasCutaway={hasCutaway} />
      <HeatSpreader hasCutaway={hasCutaway} />
    </group>
  );
}

function PackageMold({ hasCutaway }: { hasCutaway: boolean }) {
  return (
    <group position={[0, 0.12, 0]}>
      {hasCutaway ? (
        <>
          <RoundedBox args={[4.72, 0.26, 0.32]} radius={0.07} smoothness={8} position={[0, 0.05, -1.35]} castShadow>
            <meshStandardMaterial color="#070809" metalness={0.12} roughness={0.64} />
          </RoundedBox>
          <RoundedBox args={[4.72, 0.24, 0.28]} radius={0.07} smoothness={8} position={[0, 0.02, 1.35]} castShadow>
            <meshStandardMaterial color="#070809" metalness={0.14} roughness={0.58} />
          </RoundedBox>
          <RoundedBox args={[0.32, 0.26, 2.55]} radius={0.07} smoothness={8} position={[-2.18, 0.05, 0]} castShadow>
            <meshStandardMaterial color="#070809" metalness={0.12} roughness={0.64} />
          </RoundedBox>
          <RoundedBox args={[0.32, 0.26, 2.55]} radius={0.07} smoothness={8} position={[2.18, 0.05, 0]} castShadow>
            <meshStandardMaterial color="#070809" metalness={0.12} roughness={0.64} />
          </RoundedBox>
        </>
      ) : (
        <RoundedBox args={[4.7, 0.32, 2.86]} radius={0.09} smoothness={8} position={[0, 0.08, 0]} castShadow>
          <meshStandardMaterial color="#070809" metalness={0.14} roughness={0.6} />
        </RoundedBox>
      )}
      <mesh position={[-1.92, 0.235, 1.14]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.095, 0.13, 24]} />
        <meshBasicMaterial color="#ebd27b" transparent opacity={0.76} />
      </mesh>
    </group>
  );
}

function HeatSpreader({ hasCutaway }: { hasCutaway: boolean }) {
  if (!hasCutaway) {
    return (
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[3.62, 0.2, 2.08]} radius={0.08} smoothness={10} castShadow>
          <meshStandardMaterial
            color="#c7cdd0"
            metalness={0.82}
            roughness={0.18}
            emissive="#141719"
            emissiveIntensity={0.16}
          />
        </RoundedBox>
        <BrushedMetalLines y={0.108} width={3.22} depth={1.72} />
      </group>
    );
  }

  return (
    <group position={[0, 0.92, -0.3]} rotation={[-0.08, 0.02, 0]}>
      <RoundedBox args={[3.78, 0.18, 0.64]} radius={0.07} smoothness={10} position={[0, 0, -0.78]} castShadow>
        <meshStandardMaterial
          color="#c8ced0"
          metalness={0.84}
          roughness={0.17}
          emissive="#151719"
          emissiveIntensity={0.18}
        />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.18, 1.7]} radius={0.07} smoothness={10} position={[-1.64, 0, 0.34]} castShadow>
        <meshStandardMaterial
          color="#c8ced0"
          metalness={0.84}
          roughness={0.17}
          emissive="#151719"
          emissiveIntensity={0.18}
        />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.18, 1.7]} radius={0.07} smoothness={10} position={[1.64, 0, 0.34]} castShadow>
        <meshStandardMaterial
          color="#c8ced0"
          metalness={0.84}
          roughness={0.17}
          emissive="#151719"
          emissiveIntensity={0.18}
        />
      </RoundedBox>
      <BrushedMetalLines y={0.086} width={3.1} depth={1.36} />
    </group>
  );
}

function BrushedMetalLines({
  y,
  width,
  depth
}: {
  y: number;
  width: number;
  depth: number;
}) {
  return (
    <group>
      {Array.from({ length: 14 }, (_, index) => (
        <mesh
          key={index}
          position={[0, y, -depth / 2 + index * (depth / 13)]}
        >
          <boxGeometry args={[width, 0.006, 0.006]} />
          <meshBasicMaterial color="#eef7f9" transparent opacity={0.14} />
        </mesh>
      ))}
    </group>
  );
}

function SiliconInterposer({ selectedColor }: { selectedColor: string }) {
  const rdl = useMemo<TraceSegment[]>(() => {
    const output: TraceSegment[] = [];

    for (let index = 0; index < 22; index += 1) {
      const horizontal = index % 2 === 0;
      output.push({
        position: [
          -1.55 + (index % 6) * 0.62,
          0.285 + (index % 3) * 0.006,
          -0.72 + Math.floor(index / 6) * 0.46
        ],
        rotation: horizontal ? [0, Math.PI / 2, 0] : [0, 0, 0],
        size: horizontal ? [0.018, 0.01, 0.56] : [0.018, 0.01, 0.42],
        color: index % 5 === 0 ? selectedColor : "#6bbfe2",
        opacity: index % 5 === 0 ? 0.84 : 0.44
      });
    }

    return output;
  }, [selectedColor]);

  return (
    <group>
      <RoundedBox args={[3.25, 0.055, 1.9]} radius={0.045} smoothness={8} position={[0, 0.26, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#162838"
          metalness={0.32}
          roughness={0.2}
          transparent
          opacity={0.72}
          emissive="#051b2b"
          emissiveIntensity={0.24}
        />
      </RoundedBox>
      {rdl.map((trace, index) => (
        <mesh
          key={index}
          position={trace.position}
          rotation={trace.rotation ?? [0, 0, 0]}
        >
          <boxGeometry args={trace.size} />
          <meshBasicMaterial color={trace.color} transparent opacity={trace.opacity ?? 0.5} />
        </mesh>
      ))}
    </group>
  );
}

function MicroBumpFields({ selectedColor }: { selectedColor: string }) {
  const bumps = useMemo(() => {
    const output: PadPoint[] = [];

    for (let x = -1.36; x <= 1.36; x += 0.17) {
      for (let z = -0.76; z <= 0.76; z += 0.17) {
        const inLogic = Math.abs(x) < 0.56 && Math.abs(z) < 0.42;
        const inHbm = Math.abs(x) > 0.82 && Math.abs(z) < 0.62;

        if (inLogic || inHbm) {
          output.push({
            x,
            z,
            selected: Math.abs(x) < 0.16 || Math.abs(z + 0.34) < 0.12
          });
        }
      }
    }

    return output;
  }, []);

  return (
    <group position={[0, 0.35, 0]}>
      {bumps.map((bump, index) => (
        <mesh key={index} position={[bump.x, 0, bump.z]} castShadow>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshStandardMaterial
            color={bump.selected ? selectedColor : "#d8a33a"}
            metalness={0.86}
            roughness={0.16}
            emissive={bump.selected ? selectedColor : "#000000"}
            emissiveIntensity={bump.selected ? 0.16 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function LogicChiplets({ selectedColor }: { selectedColor: string }) {
  return (
    <group position={[0, 0.42, 0]}>
      <ChipletBlock
        position={[0, 0, 0]}
        size={[0.95, 0.16, 0.76]}
        color="#101722"
        accent={selectedColor}
      />
      <ChipletBlock
        position={[0, 0.035, -0.78]}
        size={[1.42, 0.08, 0.22]}
        color="#13202b"
        accent="#79d8ff"
      />
      {[-0.28, 0, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.055, 0.071, 5]} />
          <meshBasicMaterial color="#71e7ff" transparent opacity={0.58} />
        </mesh>
      ))}
    </group>
  );
}

function ChipletBlock({
  position,
  size,
  color,
  accent
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  accent: string;
}) {
  return (
    <group position={position}>
      <RoundedBox args={size} radius={0.035} smoothness={8} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          metalness={0.44}
          roughness={0.28}
          emissive="#030b12"
          emissiveIntensity={0.18}
        />
      </RoundedBox>
      {[-0.3, 0, 0.3].map((x) => (
        <mesh key={x} position={[x, size[1] / 2 + 0.006, 0]}>
          <boxGeometry args={[0.16, 0.008, size[2] * 0.72]} />
          <meshBasicMaterial color={accent} transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function HbmStacks() {
  const stacks: [number, number, string][] = [
    [-1.2, -0.43, "#1d3345"],
    [-1.2, 0.53, "#21384a"],
    [1.2, -0.43, "#1f3647"],
    [1.2, 0.53, "#243a49"]
  ];

  return (
    <group position={[0, 0.42, 0]}>
      {stacks.map(([x, z, color], stackIndex) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          {Array.from({ length: 7 }, (_, index) => (
            <RoundedBox
              key={index}
              args={[0.58, 0.045, 0.56]}
              radius={0.025}
              smoothness={5}
              position={[0, index * 0.047, 0]}
              castShadow
            >
              <meshStandardMaterial
                color={index % 2 === 0 ? color : "#182838"}
                metalness={0.52}
                roughness={0.26}
                emissive="#03101a"
                emissiveIntensity={0.1}
              />
            </RoundedBox>
          ))}
          {[-0.18, 0, 0.18].map((lane) => (
            <mesh key={lane} position={[lane, 0.18, 0.292]}>
              <boxGeometry args={[0.02, 0.28, 0.014]} />
              <meshBasicMaterial color={stackIndex % 2 === 0 ? "#69d6ff" : "#9be8ff"} transparent opacity={0.45} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function SelectedPath({
  selectedNetId,
  selectedColor
}: {
  selectedNetId: SemiconductorNetId;
  selectedColor: string;
}) {
  const path =
    selectedNetId === "BGA_POWER_A3"
      ? [
          [0, 0.175, -1.18, 1.35, 0.018, 0.026],
          [0.66, 0.38, -0.54, 0.026, 0.4, 0.026]
        ]
      : selectedNetId === "HBM_SIGNAL_07"
        ? [
            [-0.6, 0.49, 0.18, 1.18, 0.024, 0.026],
            [-1.05, 0.49, 0.44, 0.026, 0.024, 0.52]
          ]
        : [
            [0, 0.64, 0, 0.82, 0.018, 0.55],
            [0, 0.73, -0.56, 2.36, 0.018, 0.05]
          ];

  return (
    <group>
      {path.map(([x, y, z, sx, sy, sz], index) => (
        <mesh key={index} position={[x, y, z]}>
          <boxGeometry args={[sx, sy, sz]} />
          <meshBasicMaterial color={selectedColor} transparent opacity={0.74} />
        </mesh>
      ))}
    </group>
  );
}

function ThermalPath({ frame }: { frame: number }) {
  const pulse = 0.22 + (frame % 120) / 900;

  return (
    <group>
      <mesh position={[0, 0.79, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.88, 48]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={pulse} />
      </mesh>
      <mesh position={[0, 0.805, -0.58]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.56, 42]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={pulse + 0.08} />
      </mesh>
      {[0.34, 0.58, 0.82].map((radius) => (
        <mesh key={radius} position={[0, 0.81 + radius * 0.005, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.012, 48]} />
          <meshBasicMaterial color="#fde68a" transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function InspectionMarkers({ selectedColor }: { selectedColor: string }) {
  const markers: [number, number, number, number][] = [
    [-1.2, 0.68, 0.54, 0.16],
    [1.22, 0.66, -0.42, 0.16],
    [0.46, 0.41, -1.18, 0.13],
    [-2.02, 0.05, 1.02, 0.11]
  ];

  return (
    <group>
      {markers.map(([x, y, z, radius], index) => (
        <group key={index} position={[x, y, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius, radius + 0.018, 32]} />
            <meshBasicMaterial color={index === 0 ? selectedColor : "#fb923c"} transparent opacity={0.72} />
          </mesh>
          <mesh>
            <boxGeometry args={[radius * 2.2, 0.01, 0.01]} />
            <meshBasicMaterial color="#fed7aa" transparent opacity={0.64} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.01, 0.01, radius * 2.2]} />
            <meshBasicMaterial color="#fed7aa" transparent opacity={0.64} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
