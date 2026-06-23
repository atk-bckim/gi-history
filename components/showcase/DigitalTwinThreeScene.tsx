"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import type { Group, Mesh } from "three";
import type { Equipment, LayerId } from "@/components/showcase/showcase-data";

type DigitalTwinThreeSceneProps = {
  equipment: Equipment[];
  activeLayers: LayerId[];
  selectedId: string;
  reducedMotion: boolean;
  timeIndex: number;
  onSelect: (equipmentId: string) => void;
};

type EquipmentBlockProps = {
  item: Equipment;
  isSelected: boolean;
  activeLayers: LayerId[];
  reducedMotion: boolean;
  timeIndex: number;
  onSelect: (equipmentId: string) => void;
};

const statusColor: Record<Equipment["status"], string> = {
  nominal: "#39d98a",
  warning: "#f6b84b",
  alarm: "#ff5c5c"
};

const equipmentMetal: Record<Equipment["status"], string> = {
  nominal: "#9aa8b3",
  warning: "#a99b7f",
  alarm: "#b18c8c"
};

export function DigitalTwinThreeScene({
  equipment,
  activeLayers,
  selectedId,
  reducedMotion,
  timeIndex,
  onSelect
}: DigitalTwinThreeSceneProps) {
  const hasHeatmap = activeLayers.includes("heatmap");
  const hasFacility = activeLayers.includes("facility");
  const hasSensors = activeLayers.includes("sensors");

  return (
    <Canvas
      shadows
      camera={{ position: [6.7, 5.35, 7.2], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      role="img"
      aria-label="Interactive 3D digital twin of semiconductor line equipment"
    >
      <color attach="background" args={["#071019"]} />
      <fog attach="fog" args={["#071019", 8, 14]} />
      <ambientLight intensity={0.42} />
      <hemisphereLight args={["#cdeeff", "#182330", 0.55]} />
      <directionalLight
        position={[4.5, 7.5, 3.5]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 3, -3]} intensity={1.45} color="#43c4ff" />
      <pointLight position={[4, 2.4, 3]} intensity={1.05} color="#ffb54b" />
      <spotLight
        position={[0, 5.2, 2.6]}
        angle={0.52}
        penumbra={0.65}
        intensity={1.8}
        color="#d7f3ff"
        castShadow
      />

      <FabFloor />
      <OverheadUtilitySpine />

      <gridHelper
        args={[10, 20, "#355061", "#1d303d"]}
        position={[0, 0.012, 0]}
      />

      {hasFacility ? <FacilityShell /> : null}
      {hasHeatmap ? <HeatmapOverlay timeIndex={timeIndex} /> : null}
      {activeLayers.includes("throughput") ? (
        <ThroughputFlow reducedMotion={reducedMotion} />
      ) : null}

      {equipment.map((item) => (
        <EquipmentBlock
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          activeLayers={activeLayers}
          reducedMotion={reducedMotion}
          timeIndex={timeIndex}
          onSelect={onSelect}
        />
      ))}

      {hasSensors ? <SensorRail reducedMotion={reducedMotion} /> : null}

      <OrbitControls
        enablePan={false}
        enableZoom
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.22}
        minDistance={6}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}

function EquipmentBlock({
  item,
  isSelected,
  activeLayers,
  reducedMotion,
  timeIndex,
  onSelect
}: EquipmentBlockProps) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const hasDefects = activeLayers.includes("defects");
  const hasMaintenance = activeLayers.includes("maintenance");

  useFrame(({ clock }) => {
    if (reducedMotion || !glowRef.current) {
      return;
    }

    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2 + timeIndex) * 0.08;
    glowRef.current.scale.setScalar(isSelected ? pulse * 1.25 : pulse);

    if (groupRef.current && isSelected) {
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 2.4) * 0.018;
    }
  });

  const dimensions = useMemo<[number, number, number]>(() => {
    if (item.id.startsWith("CMP")) {
      return [1.2, 0.78, 0.92];
    }

    if (item.id.startsWith("ETCH")) {
      return [1.05, 0.9, 1.05];
    }

    return [0.95, 0.72, 0.82];
  }, [item.id]);

  return (
    <group
      ref={groupRef}
      position={item.position3d}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.id);
      }}
    >
      <EquipmentToolBody
        item={item}
        dimensions={dimensions}
        isSelected={isSelected}
        meshRef={meshRef}
      />

      <LoadPortArray status={item.status} y={dimensions[1] * 0.58} />

      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.72, 48]} />
        <meshBasicMaterial
          color={statusColor[item.status]}
          transparent
          opacity={isSelected ? 0.55 : 0.25}
        />
      </mesh>

      <mesh
        ref={glowRef}
        position={[0, dimensions[1] + 0.38, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.14, 32]} />
        <meshBasicMaterial color={statusColor[item.status]} transparent opacity={0.82} />
      </mesh>

      <StackLight status={item.status} y={dimensions[1] + 0.15} />

      {hasDefects && item.status !== "nominal" ? (
        <mesh position={[0.32, dimensions[1] + 0.38, -0.28]}>
          <sphereGeometry args={[0.12, 20, 20]} />
          <meshBasicMaterial color={statusColor[item.status]} />
        </mesh>
      ) : null}

      {hasMaintenance ? (
        <MaintenanceTag y={dimensions[1] + 0.22} />
      ) : null}
    </group>
  );
}

function FabFloor() {
  const panels = useMemo(() => {
    const output: { x: number; z: number; tone: number }[] = [];

    for (let x = -4; x <= 4; x += 1) {
      for (let z = -3; z <= 3; z += 1) {
        output.push({ x, z, tone: (x + z + 8) % 3 });
      }
    }

    return output;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10.8, 7.4]} />
        <meshStandardMaterial color="#111b24" roughness={0.72} metalness={0.28} />
      </mesh>
      {panels.map((panel) => (
        <mesh
          key={`${panel.x}-${panel.z}`}
          position={[panel.x, 0.018, panel.z]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <boxGeometry args={[0.94, 0.94, 0.018]} />
          <meshStandardMaterial
            color={panel.tone === 0 ? "#1b2731" : panel.tone === 1 ? "#17232d" : "#202d38"}
            roughness={0.58}
            metalness={0.36}
          />
        </mesh>
      ))}
      {[-2.7, 2.7].map((z) => (
        <mesh key={z} position={[0, 0.032, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9.6, 0.1]} />
          <meshBasicMaterial color="#8bd7ff" transparent opacity={0.28} />
        </mesh>
      ))}
      {[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((x) =>
        [-2.95, -2.6, 2.6, 2.95].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, 0.038, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.026, 12]} />
            <meshBasicMaterial color="#87a9b8" transparent opacity={0.28} />
          </mesh>
        ))
      )}
    </group>
  );
}

function OverheadUtilitySpine() {
  return (
    <group>
      {[-1.8, 0, 1.8].map((z) => (
        <mesh key={z} position={[0, 2.16, z]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 8.8, 14]} />
          <meshStandardMaterial color="#6d8798" metalness={0.72} roughness={0.22} />
        </mesh>
      ))}
      {[-2.8, 0, 2.8].map((x) => (
        <mesh key={x} position={[x, 2.04, 0]}>
          <boxGeometry args={[0.18, 0.16, 5.7]} />
          <meshStandardMaterial color="#263845" metalness={0.44} roughness={0.36} />
        </mesh>
      ))}
      {[
        [-2.4, -1.05],
        [-0.85, 0.65],
        [1.2, -0.85],
        [2.55, 1.05]
      ].map(([x, z], index) => (
        <group key={index} position={[x, 1.55, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.95, 12]} />
            <meshStandardMaterial color="#8fb2c4" metalness={0.68} roughness={0.22} />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <boxGeometry args={[0.22, 0.08, 0.16]} />
            <meshStandardMaterial color="#c3d7df" metalness={0.48} roughness={0.28} />
          </mesh>
        </group>
      ))}
      {[-3.6, -1.2, 1.2, 3.6].map((x) => (
        <mesh key={`luminaire-${x}`} position={[x, 1.92, 2.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.78, 0.095]} />
          <meshBasicMaterial color="#e1f7ff" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function EquipmentToolBody({
  item,
  dimensions,
  isSelected,
  meshRef
}: {
  item: Equipment;
  dimensions: [number, number, number];
  isSelected: boolean;
  meshRef: RefObject<Mesh | null>;
}) {
  if (item.id.startsWith("CMP")) {
    return <CmpPolisher item={item} isSelected={isSelected} meshRef={meshRef} />;
  }

  if (item.id.startsWith("ETCH")) {
    return <EtchCluster item={item} isSelected={isSelected} meshRef={meshRef} />;
  }

  return (
    <VacuumProcessTool
      item={item}
      dimensions={dimensions}
      isSelected={isSelected}
      meshRef={meshRef}
    />
  );
}

function LoadPortArray({
  status,
  y
}: {
  status: Equipment["status"];
  y: number;
}) {
  return (
    <group position={[0, y, 0.52]}>
      {[-0.22, 0.22].map((x, index) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.34, 0.11]} />
            <meshStandardMaterial color="#dce7ec" metalness={0.5} roughness={0.24} />
          </mesh>
          <mesh position={[0, 0.015, 0.062]}>
            <boxGeometry args={[0.17, 0.23, 0.018]} />
            <meshBasicMaterial color={index === 0 ? "#62d4ff" : "#203646"} transparent opacity={0.72} />
          </mesh>
          {[-0.06, 0, 0.06].map((slot) => (
            <mesh key={slot} position={[slot, -0.135, 0.07]}>
              <boxGeometry args={[0.028, 0.055, 0.014]} />
              <meshBasicMaterial color={statusColor[status]} transparent opacity={0.62} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, -0.25, -0.04]} castShadow>
        <boxGeometry args={[0.78, 0.14, 0.18]} />
        <meshStandardMaterial color="#8295a0" metalness={0.62} roughness={0.26} />
      </mesh>
    </group>
  );
}

function BaseCabinet({
  color,
  selected,
  dimensions,
  meshRef
}: {
  color: string;
  selected: boolean;
  dimensions: [number, number, number];
  meshRef?: RefObject<Mesh | null>;
}) {
  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, dimensions[1] / 2, 0]}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial
        color={selected ? "#5d6e7a" : color}
        emissive={selected ? "#0f5f8d" : "#03131e"}
        emissiveIntensity={selected ? 0.58 : 0.12}
        metalness={0.56}
        roughness={0.34}
      />
    </mesh>
  );
}

function VacuumProcessTool({
  item,
  dimensions,
  isSelected,
  meshRef
}: {
  item: Equipment;
  dimensions: [number, number, number];
  isSelected: boolean;
  meshRef: RefObject<Mesh | null>;
}) {
  const chamberColor = equipmentMetal[item.status];

  return (
    <group>
      <BaseCabinet
        color="#2a3640"
        selected={isSelected}
        dimensions={dimensions}
        meshRef={meshRef}
      />
      {[-0.3, 0.32].map((x) => (
        <mesh key={x} castShadow position={[x, dimensions[1] + 0.14, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.32, 0.22, 36]} />
          <meshStandardMaterial
            color={chamberColor}
            metalness={0.78}
            roughness={0.22}
            emissive={item.status === "alarm" ? "#3b1111" : "#061823"}
            emissiveIntensity={0.18}
          />
        </mesh>
      ))}
      <mesh castShadow position={[0, dimensions[1] + 0.12, 0.28]}>
        <boxGeometry args={[0.86, 0.26, 0.16]} />
        <meshStandardMaterial color="#d8e1e7" metalness={0.52} roughness={0.24} />
      </mesh>
      <mesh position={[0, dimensions[1] + 0.13, 0.37]}>
        <boxGeometry args={[0.62, 0.11, 0.025]} />
        <meshBasicMaterial color="#79caff" transparent opacity={0.75} />
      </mesh>
      <PipeRun y={dimensions[1] + 0.32} />
    </group>
  );
}

function EtchCluster({
  item,
  isSelected,
  meshRef
}: {
  item: Equipment;
  isSelected: boolean;
  meshRef: RefObject<Mesh | null>;
}) {
  return (
    <group>
      <BaseCabinet
        color="#263643"
        selected={isSelected}
        dimensions={[1.05, 0.56, 1.05]}
        meshRef={meshRef}
      />
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.36, 8]} />
        <meshStandardMaterial color={equipmentMetal[item.status]} metalness={0.76} roughness={0.2} />
      </mesh>
      {[
        [0.42, 0, 0],
        [-0.42, 0, 0],
        [0, 0, 0.42],
        [0, 0, -0.42]
      ].map(([x, y, z], index) => (
        <mesh key={index} castShadow position={[x, 0.82 + y, z]} rotation={[0, index < 2 ? Math.PI / 2 : 0, 0]}>
          <cylinderGeometry args={[0.18, 0.2, 0.28, 28]} />
          <meshStandardMaterial color="#aab5bd" metalness={0.82} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={[0, 1.12, 0]}>
        <torusGeometry args={[0.42, 0.012, 10, 48]} />
        <meshBasicMaterial color="#56c5ff" transparent opacity={0.62} />
      </mesh>
      <PipeRun y={1.18} />
    </group>
  );
}

function CmpPolisher({
  item,
  isSelected,
  meshRef
}: {
  item: Equipment;
  isSelected: boolean;
  meshRef: RefObject<Mesh | null>;
}) {
  return (
    <group>
      <BaseCabinet
        color="#31404a"
        selected={isSelected}
        dimensions={[1.2, 0.56, 0.94]}
        meshRef={meshRef}
      />
      <mesh castShadow position={[-0.22, 0.82, -0.02]}>
        <cylinderGeometry args={[0.32, 0.36, 0.18, 42]} />
        <meshStandardMaterial color="#c2c8ca" metalness={0.72} roughness={0.2} />
      </mesh>
      <mesh position={[-0.22, 0.93, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.31, 46]} />
        <meshBasicMaterial color={statusColor[item.status]} transparent opacity={0.5} />
      </mesh>
      <mesh castShadow position={[0.43, 0.76, 0.22]}>
        <cylinderGeometry args={[0.16, 0.18, 0.42, 28]} />
        <meshStandardMaterial color="#e6edf1" metalness={0.56} roughness={0.28} />
      </mesh>
      <mesh castShadow position={[0.28, 0.98, -0.2]} rotation={[0.18, 0, -0.55]}>
        <boxGeometry args={[0.11, 0.5, 0.1]} />
        <meshStandardMaterial color="#9fb2bd" metalness={0.62} roughness={0.24} />
      </mesh>
      <mesh position={[0.14, 0.7, 0.42]}>
        <boxGeometry args={[0.62, 0.12, 0.08]} />
        <meshBasicMaterial color="#6ee7ff" transparent opacity={0.52} />
      </mesh>
    </group>
  );
}

function PipeRun({ y }: { y: number }) {
  return (
    <group>
      <mesh position={[0, y, -0.58]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 1.05, 14]} />
        <meshStandardMaterial color="#9fc2d4" metalness={0.7} roughness={0.24} />
      </mesh>
      <mesh position={[0.54, y - 0.08, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.58, 14]} />
        <meshStandardMaterial color="#7aa6bb" metalness={0.65} roughness={0.28} />
      </mesh>
    </group>
  );
}

function StackLight({ status, y }: { status: Equipment["status"]; y: number }) {
  return (
    <group position={[0.48, y, -0.36]}>
      <mesh castShadow position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.24, 10]} />
        <meshStandardMaterial color="#9fb2bd" metalness={0.72} roughness={0.26} />
      </mesh>
      {[
        ["#39d98a", status === "nominal" ? 0.95 : 0.24],
        ["#f6b84b", status === "warning" ? 0.95 : 0.24],
        ["#ff5c5c", status === "alarm" ? 0.95 : 0.24]
      ].map(([color, opacity], index) => (
        <mesh key={color as string} position={[0, index * 0.075, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={color as string} transparent opacity={opacity as number} />
        </mesh>
      ))}
    </group>
  );
}

function MaintenanceTag({ y }: { y: number }) {
  return (
    <group position={[-0.42, y, 0.33]}>
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.16, 0.055]} />
        <meshStandardMaterial color="#77b7ff" emissive="#0d5f9d" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.031]}>
        <boxGeometry args={[0.16, 0.026, 0.012]} />
        <meshBasicMaterial color="#e7f6ff" transparent opacity={0.86} />
      </mesh>
    </group>
  );
}

function FacilityShell() {
  return (
    <group>
      <mesh position={[0, 1.08, -3.48]}>
        <boxGeometry args={[10, 2.1, 0.08]} />
        <meshStandardMaterial color="#14202b" transparent opacity={0.42} metalness={0.1} roughness={0.45} />
      </mesh>
      <mesh position={[-5.02, 1.05, 0]}>
        <boxGeometry args={[0.08, 2.1, 7]} />
        <meshStandardMaterial color="#111922" transparent opacity={0.34} />
      </mesh>
      <mesh position={[5.02, 1.05, 0]}>
        <boxGeometry args={[0.08, 2.1, 7]} />
        <meshStandardMaterial color="#111922" transparent opacity={0.34} />
      </mesh>
      {[-3.5, -1.2, 1.2, 3.5].map((x) => (
        <mesh key={x} position={[x, 2.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 6.7, 10]} />
          <meshStandardMaterial color="#567081" metalness={0.62} roughness={0.3} />
        </mesh>
      ))}
      {[-2.4, 0, 2.4].map((x) => (
        <mesh key={x} position={[x, 2.18, -0.45]}>
          <boxGeometry args={[0.18, 0.18, 5.7]} />
          <meshStandardMaterial color="#263846" metalness={0.5} roughness={0.36} />
        </mesh>
      ))}
      {[-3.6, -1.2, 1.2, 3.6].map((x) => (
        <mesh key={`light-${x}`} position={[x, 2.03, 2.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.08]} />
          <meshBasicMaterial color="#d7f3ff" transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function HeatmapOverlay({ timeIndex }: { timeIndex: number }) {
  const opacity = 0.24 + timeIndex * 0.025;

  return (
    <group position={[1.9, 0.035, 0.42]}>
      <mesh rotation={[-Math.PI / 2, 0, -0.18]}>
        <planeGeometry args={[3.8, 1.65]} />
        <meshBasicMaterial color="#f3d93b" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.55, 0.015, -0.06]} rotation={[-Math.PI / 2, 0, -0.18]}>
        <planeGeometry args={[1.65, 1.02]} />
        <meshBasicMaterial color="#ff4d3d" transparent opacity={opacity + 0.18} />
      </mesh>
      <mesh position={[-1.25, 0.02, 0.18]} rotation={[-Math.PI / 2, 0, -0.18]}>
        <planeGeometry args={[1.7, 1.22]} />
        <meshBasicMaterial color="#25d0a4" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function SensorRail({ reducedMotion }: { reducedMotion: boolean }) {
  const railRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (reducedMotion || !railRef.current) {
      return;
    }

    railRef.current.position.x = -3.8 + (clock.elapsedTime % 5) * 1.45;
  });

  return (
    <group>
      <mesh ref={railRef} position={[-3.8, 0.18, 2.45]}>
        <sphereGeometry args={[0.08, 18, 18]} />
        <meshBasicMaterial color="#49d7ff" />
      </mesh>
      <mesh position={[0, 0.04, 2.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.4, 0.035]} />
        <meshBasicMaterial color="#49d7ff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function ThroughputFlow({ reducedMotion }: { reducedMotion: boolean }) {
  const carrierRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion || !carrierRef.current) {
      return;
    }

    carrierRef.current.position.x = -4 + (clock.elapsedTime % 6) * 1.35;
  });

  return (
    <group>
      <mesh position={[0, 0.065, -2.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.8, 0.16]} />
        <meshBasicMaterial color="#6ee7ff" transparent opacity={0.24} />
      </mesh>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((x) => (
        <mesh key={x} position={[x, 0.1, -2.65]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.34, 16]} />
          <meshStandardMaterial color="#6f8792" metalness={0.66} roughness={0.22} />
        </mesh>
      ))}
      <group ref={carrierRef} position={[-4, 0.18, -2.65]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.16, 0.26]} />
          <meshStandardMaterial color="#d9e8ef" metalness={0.52} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.11, 0.12, 0.05, 26]} />
          <meshStandardMaterial color="#6f7f87" metalness={0.72} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
