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

function isDenseTestEquipment(id: string) {
  return id.startsWith("PB") || id.startsWith("ATE") || id.startsWith("HDL");
}

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
      camera={{ position: [12.2, 8.2, 12.4], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ cursor: "grab", touchAction: "none" }}
      role="img"
      aria-label="Interactive 3D digital twin of semiconductor line equipment"
    >
      <color attach="background" args={["#071019"]} />
      <fog attach="fog" args={["#071019", 12, 24]} />
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
      <TestLineConveyor reducedMotion={reducedMotion} timeIndex={timeIndex} />

      <gridHelper
        args={[21, 42, "#355061", "#1d303d"]}
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
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        enableZoom
        rotateSpeed={0.72}
        zoomSpeed={0.72}
        panSpeed={0.62}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.22}
        minDistance={6}
        maxDistance={18}
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
  const hasLegacyLoadPorts =
    item.id.startsWith("PB") ||
    item.id.startsWith("WSORT") ||
    item.id.startsWith("CVD") ||
    item.id.startsWith("PVD") ||
    item.id.startsWith("CMP") ||
    item.id.startsWith("ETCH");
  const hasDetailedStatusTower =
    item.id.startsWith("PB") ||
    item.id.startsWith("WSORT") ||
    item.id.startsWith("ATE") ||
    item.id.startsWith("HDL") ||
    item.id.startsWith("FT-HDL") ||
    item.id.startsWith("BURN") ||
    item.id.startsWith("SLT");

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
    if (item.id.startsWith("WSORT")) {
      return [1.45, 0.72, 1.18];
    }

    if (item.id.startsWith("PB")) {
      return [1.32, 0.68, 1.08];
    }

    if (item.id.startsWith("ATE")) {
      return [1.2, 1.16, 0.92];
    }

    if (item.id.startsWith("HDL")) {
      return [1.42, 0.72, 1.05];
    }

    if (item.id.startsWith("FT-HDL")) {
      return [1.58, 0.78, 1.18];
    }

    if (item.id.startsWith("BURN")) {
      return [1.28, 1.05, 0.78];
    }

    if (item.id.startsWith("SLT")) {
      return [1.08, 0.95, 0.82];
    }

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
      scale={isDenseTestEquipment(item.id) ? 0.68 : 1}
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

      {hasLegacyLoadPorts ? (
        <LoadPortArray status={item.status} y={dimensions[1] * 0.58} />
      ) : null}

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

      {hasDetailedStatusTower ? null : (
        <StackLight status={item.status} y={dimensions[1] + 0.15} />
      )}

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

    for (let x = -9; x <= 9; x += 1) {
      for (let z = -6; z <= 6; z += 1) {
        output.push({ x, z, tone: (x + z + 8) % 3 });
      }
    }

    return output;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[21.2, 14.2]} />
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
      <PedestrianAisles />
      {[-5.82, -1.34, 1.34, 5.82].map((z) => (
        <mesh key={z} position={[0, 0.032, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[19.2, 0.1]} />
          <meshBasicMaterial color="#8bd7ff" transparent opacity={0.28} />
        </mesh>
      ))}
      {[-4.3, -3.3, -2.3, 2.3, 3.3, 4.3].map((z) => (
        <group key={`lane-${z}`}>
          {[-7.2, -3.6, 0, 3.6, 7.2].map((x) => (
            <mesh key={`${x}-${z}`} position={[x, 0.046, z + 0.48]} rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[0.28, 0.075, 0.012]} />
              <meshBasicMaterial color="#f8fafc" transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      {[-9.2, -8, -6.8, -5.6, -4.4, -3.2, -2, -0.8, 0.8, 2, 3.2, 4.4, 5.6, 6.8, 8, 9.2].map((x) =>
        [-6.52, -6.12, -1.16, 1.16, 6.12, 6.52].map((z) => (
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

function PedestrianAisles() {
  return (
    <group>
      <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[19.4, 1.9]} />
        <meshBasicMaterial color="#2b4654" transparent opacity={0.62} />
      </mesh>
      {[-1.02, 1.02].map((z) => (
        <mesh key={`ped-edge-${z}`} position={[0, 0.048, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[19.5, 0.055]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.86} />
        </mesh>
      ))}
      {[-8.4, -4.2, 0, 4.2, 8.4].map((x) => (
        <group key={`crosswalk-${x}`} position={[x, 0.052, 0]}>
          {[-0.66, -0.44, -0.22, 0, 0.22, 0.44, 0.66].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[0.72, 0.07, 0.01]} />
              <meshBasicMaterial color="#e5eef4" transparent opacity={0.68} />
            </mesh>
          ))}
        </group>
      ))}
      {[-6.1, 6.1].map((z) => (
        <group key={`service-${z}`}>
          <mesh position={[0, 0.037, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[19.4, 0.76]} />
            <meshBasicMaterial color="#1e3a46" transparent opacity={0.46} />
          </mesh>
          {[-0.36, 0.36].map((offset) => (
            <mesh key={offset} position={[0, 0.05, z + offset]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[19.4, 0.035]} />
              <meshBasicMaterial color="#67e8f9" transparent opacity={0.42} />
            </mesh>
          ))}
        </group>
      ))}
      {[-5.8, -1.9, 1.9, 5.8].map((x, index) => (
        <PedestrianScaleMarker key={`ped-marker-${x}`} x={x} z={index % 2 === 0 ? -0.34 : 0.34} />
      ))}
      {[-7.1, -3.55, 0, 3.55, 7.1].map((x) => (
        <group key={`walk-arrow-${x}`} position={[x, 0.058, 0]}>
          <mesh rotation={[0, 0.62, 0]}>
            <boxGeometry args={[0.46, 0.012, 0.052]} />
            <meshBasicMaterial color="#d9f99d" transparent opacity={0.62} />
          </mesh>
          <mesh rotation={[0, -0.62, 0]}>
            <boxGeometry args={[0.46, 0.012, 0.052]} />
            <meshBasicMaterial color="#d9f99d" transparent opacity={0.62} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PedestrianScaleMarker({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.08, z]}>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 24]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.18} />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.055, 0.07, 0.32, 14]} />
        <meshStandardMaterial color="#e5eef4" roughness={0.36} metalness={0.12} />
      </mesh>
      <mesh castShadow position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.075, 18, 18]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.42} metalness={0.08} />
      </mesh>
      {[-0.055, 0.055].map((offset) => (
        <mesh key={offset} position={[offset, 0.02, 0]}>
          <boxGeometry args={[0.035, 0.12, 0.035]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.42} metalness={0.16} />
        </mesh>
      ))}
    </group>
  );
}

function TestLineConveyor({
  reducedMotion,
  timeIndex
}: {
  reducedMotion: boolean;
  timeIndex: number;
}) {
  return (
    <group>
      {[-6.1, 6.1].map((z, laneIndex) => (
        <group key={z} position={[0, 0.09, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[18.6, 0.07, 0.22]} />
            <meshStandardMaterial color="#2b3944" metalness={0.68} roughness={0.26} />
          </mesh>
          <mesh position={[0, 0.052, -0.1]}>
            <boxGeometry args={[18.8, 0.045, 0.035]} />
            <meshStandardMaterial color="#758a97" metalness={0.75} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.052, 0.1]}>
            <boxGeometry args={[18.8, 0.045, 0.035]} />
            <meshStandardMaterial color="#758a97" metalness={0.75} roughness={0.2} />
          </mesh>
          {[-8.2, -5.15, -2.1, 0.95, 4, 7.05].map((x, index) => (
            <LotCarrier
              key={`${z}-${x}`}
              baseX={x}
              index={index + laneIndex * 3}
              reducedMotion={reducedMotion}
              timeIndex={timeIndex}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function LotCarrier({
  baseX,
  index,
  reducedMotion,
  timeIndex
}: {
  baseX: number;
  index: number;
  reducedMotion: boolean;
  timeIndex: number;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) {
      return;
    }

    const cycle = ((clock.elapsedTime * 0.22 + index * 1.15 + timeIndex * 0.08) % 17.2) - 8.6;
    groupRef.current.position.x = cycle;
  });

  return (
    <group ref={groupRef} position={[baseX, 0.11, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.09, 0.22]} />
        <meshStandardMaterial color="#d7e1e7" metalness={0.42} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0.055, 0]}>
        <boxGeometry args={[0.22, 0.026, 0.14]} />
        <meshBasicMaterial color={index % 2 === 0 ? "#6ee7ff" : "#fcd34d"} transparent opacity={0.72} />
      </mesh>
      {[-0.09, 0, 0.09].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.055]}>
          <boxGeometry args={[0.035, 0.018, 0.035]} />
          <meshBasicMaterial color="#101827" transparent opacity={0.86} />
        </mesh>
      ))}
    </group>
  );
}

function OverheadUtilitySpine() {
  return (
    <group>
      {[-4.48, -2.22, 2.22, 4.48].map((z) => (
        <mesh key={z} position={[0, 2.16, z]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 18.9, 14]} />
          <meshStandardMaterial color="#6d8798" metalness={0.72} roughness={0.22} />
        </mesh>
      ))}
      {[-7.4, -3.7, 0, 3.7, 7.4].map((x) => (
        <mesh key={x} position={[x, 2.04, 0]}>
          <boxGeometry args={[0.18, 0.16, 10.4]} />
          <meshStandardMaterial color="#263845" metalness={0.44} roughness={0.36} />
        </mesh>
      ))}
      {[
        [-3.2, -1.46],
        [-1.1, 1.28],
        [1.6, -1.26],
        [3.35, 1.48]
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
      {[-7.2, -3.6, 0, 3.6, 7.2].map((x) => (
        <mesh key={`luminaire-${x}`} position={[x, 1.92, 2.55]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.86, 0.095]} />
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
  if (item.id.startsWith("PB") || item.id.startsWith("WSORT")) {
    return <WaferSortCell item={item} isSelected={isSelected} meshRef={meshRef} />;
  }

  if (item.id.startsWith("ATE")) {
    return <AteMainframeCell item={item} isSelected={isSelected} meshRef={meshRef} />;
  }

  if (item.id.startsWith("HDL") || item.id.startsWith("FT-HDL")) {
    return <PackageTestHandler item={item} isSelected={isSelected} meshRef={meshRef} />;
  }

  if (item.id.startsWith("BURN")) {
    return <BurnInRack item={item} isSelected={isSelected} meshRef={meshRef} />;
  }

  if (item.id.startsWith("SLT")) {
    return <SystemLevelTestRack item={item} isSelected={isSelected} meshRef={meshRef} />;
  }

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

function WaferSortCell({
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
        color="#dfe7eb"
        selected={isSelected}
        dimensions={[1.45, 0.52, 1.18]}
        meshRef={meshRef}
      />
      <mesh castShadow position={[0, 0.86, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 64]} />
        <meshStandardMaterial color="#eef4f7" metalness={0.62} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.935, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 72]} />
        <meshStandardMaterial
          color="#0f1b2a"
          emissive="#134e6f"
          emissiveIntensity={0.42}
          metalness={0.24}
          roughness={0.28}
        />
      </mesh>
      <WaferMapOverlay status={item.status} />
      <mesh castShadow position={[0.52, 0.78, 0.36]}>
        <boxGeometry args={[0.38, 0.34, 0.24]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.34} roughness={0.24} />
      </mesh>
      <mesh position={[0.52, 0.79, 0.49]}>
        <boxGeometry args={[0.22, 0.2, 0.018]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.92} />
      </mesh>
      <OperatorMonitor x={-0.62} y={1.02} z={0.45} />
      <ProbeCardBridge status={item.status} />
      <StackLight status={item.status} y={1.16} />
      <PanelVents x={-0.58} y={0.34} z={-0.61} rows={4} />
    </group>
  );
}

function AteMainframeCell({
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
        color="#e8eef2"
        selected={isSelected}
        dimensions={[0.88, 1.22, 0.82]}
        meshRef={meshRef}
      />
      <mesh castShadow position={[-0.72, 0.66, 0]}>
        <boxGeometry args={[0.44, 1.34, 0.74]} />
        <meshStandardMaterial color="#cfd8df" metalness={0.48} roughness={0.3} />
      </mesh>
      <PanelVents x={-0.95} y={0.68} z={0.39} rows={8} />
      <mesh castShadow position={[0.63, 0.82, -0.03]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[0.88, 0.28, 0.34]} />
        <meshStandardMaterial color="#708393" metalness={0.68} roughness={0.22} />
      </mesh>
      <mesh castShadow position={[1.18, 0.82, -0.03]}>
        <boxGeometry args={[0.5, 0.36, 0.42]} />
        <meshStandardMaterial color="#d8e0e5" metalness={0.56} roughness={0.24} />
      </mesh>
      <mesh position={[1.19, 0.82, 0.2]}>
        <boxGeometry args={[0.38, 0.2, 0.018]} />
        <meshBasicMaterial color={statusColor[item.status]} transparent opacity={0.48} />
      </mesh>
      <LoadBoardNest status={item.status} x={1.52} y={0.82} z={-0.03} />
      <CableBundle startX={-0.62} endX={0.66} z={-0.42} />
      <StackLight status={item.status} y={1.47} />
    </group>
  );
}

function PackageTestHandler({
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
        color="#eef3f6"
        selected={isSelected}
        dimensions={[1.58, 0.62, 1.18]}
        meshRef={meshRef}
      />
      <mesh castShadow position={[0, 0.94, -0.04]} rotation={[0, 0, -0.09]}>
        <boxGeometry args={[1.34, 0.2, 0.92]} />
        <meshStandardMaterial color="#cfd9df" metalness={0.48} roughness={0.22} />
      </mesh>
      <mesh castShadow position={[-0.38, 1.1, -0.12]} rotation={[0, 0, -0.09]}>
        <boxGeometry args={[0.54, 0.18, 0.5]} />
        <meshStandardMaterial
          color="#d8f3ff"
          transparent
          opacity={0.54}
          metalness={0.14}
          roughness={0.06}
        />
      </mesh>
      <TrayDeck status={item.status} />
      <PickAndPlaceArm status={item.status} />
      <LoadBoardNest status={item.status} x={0.38} y={1.05} z={0.02} />
      <mesh position={[0.22, 1.22, -0.46]}>
        <boxGeometry args={[0.46, 0.035, 0.06]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
      </mesh>
      <StackLight status={item.status} y={1.23} />
      <PanelVents x={0.78} y={0.34} z={0.6} rows={3} />
    </group>
  );
}

function BurnInRack({
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
        color="#2d3640"
        selected={isSelected}
        dimensions={[1.28, 1.05, 0.78]}
        meshRef={meshRef}
      />
      <mesh castShadow position={[0, 1.15, 0]}>
        <boxGeometry args={[1.34, 0.16, 0.84]} />
        <meshStandardMaterial color="#566673" metalness={0.52} roughness={0.3} />
      </mesh>
      {[-0.42, -0.14, 0.14, 0.42].map((x) =>
        [-0.2, 0.02, 0.24].map((y, index) => (
          <mesh key={`${x}-${y}`} position={[x, 0.52 + y, 0.41]}>
            <boxGeometry args={[0.21, 0.035, 0.035]} />
            <meshBasicMaterial
              color={index === 2 ? statusColor[item.status] : "#fbbf24"}
              transparent
              opacity={index === 2 ? 0.76 : 0.45}
            />
          </mesh>
        ))
      )}
      {[-0.48, -0.24, 0, 0.24, 0.48].map((x) => (
        <mesh key={x} castShadow position={[x, 0.98, 0.44]}>
          <boxGeometry args={[0.12, 0.38, 0.04]} />
          <meshStandardMaterial color="#151f29" metalness={0.3} roughness={0.38} />
        </mesh>
      ))}
      <mesh position={[0, 0.24, 0.42]}>
        <boxGeometry args={[1.02, 0.08, 0.035]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.42} />
      </mesh>
      <StackLight status={item.status} y={1.34} />
    </group>
  );
}

function SystemLevelTestRack({
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
        color="#d9e2e8"
        selected={isSelected}
        dimensions={[1.08, 0.9, 0.82]}
        meshRef={meshRef}
      />
      <mesh castShadow position={[-0.34, 1.12, 0.08]}>
        <boxGeometry args={[0.34, 0.28, 0.34]} />
        <meshStandardMaterial color="#182534" metalness={0.42} roughness={0.28} />
      </mesh>
      <mesh position={[-0.34, 1.12, 0.255]}>
        <boxGeometry args={[0.25, 0.17, 0.02]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.72} />
      </mesh>
      {[0.0, 0.2, 0.4].map((x, index) => (
        <mesh key={x} castShadow position={[x, 0.98, 0.16 - index * 0.19]}>
          <boxGeometry args={[0.28, 0.045, 0.16]} />
          <meshStandardMaterial color="#334155" metalness={0.38} roughness={0.28} />
        </mesh>
      ))}
      <PanelVents x={0.53} y={0.5} z={0.41} rows={5} />
      <CableBundle startX={-0.12} endX={0.48} z={-0.48} />
      <StackLight status={item.status} y={1.16} />
    </group>
  );
}

function WaferMapOverlay({ status }: { status: Equipment["status"] }) {
  const dies = useMemo(() => {
    const output: { x: number; z: number; failed: boolean }[] = [];

    for (let x = -3; x <= 3; x += 1) {
      for (let z = -3; z <= 3; z += 1) {
        if (Math.hypot(x, z) <= 3.1) {
          output.push({ x, z, failed: Math.abs(x) + Math.abs(z) > 4 });
        }
      }
    }

    return output;
  }, []);

  return (
    <group position={[0, 0.942, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
      {dies.map((die) => (
        <mesh key={`${die.x}-${die.z}`} position={[die.x * 0.075, die.z * 0.075, 0.006]}>
          <boxGeometry args={[0.052, 0.052, 0.006]} />
          <meshBasicMaterial
            color={die.failed ? statusColor[status] : "#8cf2c7"}
            transparent
            opacity={die.failed ? 0.72 : 0.42}
          />
        </mesh>
      ))}
    </group>
  );
}

function ProbeCardBridge({ status }: { status: Equipment["status"] }) {
  return (
    <group position={[-0.12, 1.08, -0.08]}>
      <mesh castShadow>
        <boxGeometry args={[0.72, 0.08, 0.14]} />
        <meshStandardMaterial color="#718493" metalness={0.68} roughness={0.2} />
      </mesh>
      {[-0.26, -0.13, 0, 0.13, 0.26].map((x) => (
        <mesh key={x} position={[x, -0.13, 0.02]}>
          <cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />
          <meshBasicMaterial color={statusColor[status]} transparent opacity={0.68} />
        </mesh>
      ))}
    </group>
  );
}

function OperatorMonitor({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.38, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.26} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.36, 0.24, 0.035]} />
        <meshStandardMaterial color="#e5edf2" metalness={0.36} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <boxGeometry args={[0.29, 0.17, 0.012]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.95} />
      </mesh>
      <mesh position={[0.045, 0.02, 0.029]}>
        <boxGeometry args={[0.12, 0.018, 0.012]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.72} />
      </mesh>
    </group>
  );
}

function PanelVents({
  x,
  y,
  z,
  rows
}: {
  x: number;
  y: number;
  z: number;
  rows: number;
}) {
  return (
    <group position={[x, y, z]}>
      {Array.from({ length: rows }).map((_, index) => (
        <mesh key={index} position={[0, (index - rows / 2) * 0.06, 0]}>
          <boxGeometry args={[0.26, 0.018, 0.012]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.78} />
        </mesh>
      ))}
    </group>
  );
}

function LoadBoardNest({
  status,
  x,
  y,
  z
}: {
  status: Equipment["status"];
  x: number;
  y: number;
  z: number;
}) {
  return (
    <group position={[x, y, z]}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.055, 0.34]} />
        <meshStandardMaterial color="#b9c5cc" metalness={0.62} roughness={0.2} />
      </mesh>
      {[-0.1, 0, 0.1].map((px) =>
        [-0.1, 0, 0.1].map((pz) => (
          <mesh key={`${px}-${pz}`} position={[px, 0.037, pz]}>
            <boxGeometry args={[0.052, 0.018, 0.052]} />
            <meshBasicMaterial color={statusColor[status]} transparent opacity={0.58} />
          </mesh>
        ))
      )}
    </group>
  );
}

function CableBundle({
  startX,
  endX,
  z
}: {
  startX: number;
  endX: number;
  z: number;
}) {
  const length = Math.abs(endX - startX);
  const center = (startX + endX) / 2;

  return (
    <group>
      {[0, 0.05, 0.1].map((offset) => (
        <mesh key={offset} position={[center, 0.54 + offset, z]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.022, 0.022, length, 12]} />
          <meshStandardMaterial color="#111827" metalness={0.44} roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}

function TrayDeck({ status }: { status: Equipment["status"] }) {
  return (
    <group position={[0, 1.07, 0.14]} rotation={[0, 0, -0.09]}>
      {[-0.48, -0.16, 0.16, 0.48].map((x, trayIndex) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.045, 0.42]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.36} roughness={0.28} />
          </mesh>
          {[-0.13, 0, 0.13].map((z, index) => (
            <mesh key={z} position={[0, 0.033, z]}>
              <boxGeometry args={[0.065, 0.017, 0.065]} />
              <meshBasicMaterial
                color={trayIndex === 2 && index === 1 ? statusColor[status] : "#1f2937"}
                transparent
                opacity={0.82}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function PickAndPlaceArm({ status }: { status: Equipment["status"] }) {
  return (
    <group position={[-0.16, 1.28, 0.16]} rotation={[0, 0, -0.35]}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.46, 0.075]} />
        <meshStandardMaterial color="#7b8d9a" metalness={0.7} roughness={0.22} />
      </mesh>
      <mesh castShadow position={[0.16, -0.22, 0]}>
        <boxGeometry args={[0.38, 0.055, 0.055]} />
        <meshStandardMaterial color="#9aa9b3" metalness={0.68} roughness={0.22} />
      </mesh>
      <mesh position={[0.36, -0.22, 0]}>
        <sphereGeometry args={[0.055, 18, 18]} />
        <meshBasicMaterial color={statusColor[status]} transparent opacity={0.78} />
      </mesh>
    </group>
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
      <mesh position={[0, 1.08, -5.12]}>
        <boxGeometry args={[17.4, 2.1, 0.08]} />
        <meshStandardMaterial color="#14202b" transparent opacity={0.42} metalness={0.1} roughness={0.45} />
      </mesh>
      <mesh position={[-8.82, 1.05, 0]}>
        <boxGeometry args={[0.08, 2.1, 10.4]} />
        <meshStandardMaterial color="#111922" transparent opacity={0.34} />
      </mesh>
      <mesh position={[8.82, 1.05, 0]}>
        <boxGeometry args={[0.08, 2.1, 10.4]} />
        <meshStandardMaterial color="#111922" transparent opacity={0.34} />
      </mesh>
      {[-7.2, -3.6, 0, 3.6, 7.2].map((x) => (
        <mesh key={x} position={[x, 2.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 10.1, 10]} />
          <meshStandardMaterial color="#567081" metalness={0.62} roughness={0.3} />
        </mesh>
      ))}
      {[-5.4, -1.8, 1.8, 5.4].map((x) => (
        <mesh key={x} position={[x, 2.18, -0.62]}>
          <boxGeometry args={[0.18, 0.18, 8.8]} />
          <meshStandardMaterial color="#263846" metalness={0.5} roughness={0.36} />
        </mesh>
      ))}
      {[-7.2, -3.6, 0, 3.6, 7.2].map((x) => (
        <mesh key={`light-${x}`} position={[x, 2.03, 3.72]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.08]} />
          <meshBasicMaterial color="#d7f3ff" transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function HeatmapOverlay({ timeIndex }: { timeIndex: number }) {
  const opacity = 0.2 + timeIndex * 0.022;

  return (
    <group position={[3.45, 0.035, 3.35]}>
      <mesh rotation={[-Math.PI / 2, 0, -0.18]}>
        <planeGeometry args={[4.4, 1.85]} />
        <meshBasicMaterial color="#f3d93b" transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.55, 0.015, -0.06]} rotation={[-Math.PI / 2, 0, -0.18]}>
        <planeGeometry args={[1.9, 1.08]} />
        <meshBasicMaterial color="#ff4d3d" transparent opacity={opacity + 0.18} />
      </mesh>
      <mesh position={[-1.25, 0.02, 0.18]} rotation={[-Math.PI / 2, 0, -0.18]}>
        <planeGeometry args={[1.85, 1.28]} />
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

    railRef.current.position.x = -8.1 + (clock.elapsedTime % 7) * 2.28;
  });

  return (
    <group>
      <mesh ref={railRef} position={[-8.1, 0.18, 4.7]}>
        <sphereGeometry args={[0.08, 18, 18]} />
        <meshBasicMaterial color="#49d7ff" />
      </mesh>
      <mesh position={[0, 0.04, 4.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[17.2, 0.035]} />
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

    carrierRef.current.position.x = -8.2 + (clock.elapsedTime % 7) * 2.36;
  });

  return (
    <group>
      <mesh position={[0, 0.065, -6.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18.4, 0.16]} />
        <meshBasicMaterial color="#6ee7ff" transparent opacity={0.24} />
      </mesh>
      {[-7.2, -3.6, 0, 3.6, 7.2].map((x) => (
        <mesh key={x} position={[x, 0.1, -6.1]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.34, 16]} />
          <meshStandardMaterial color="#6f8792" metalness={0.66} roughness={0.22} />
        </mesh>
      ))}
      <group ref={carrierRef} position={[-8.2, 0.18, -6.1]}>
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
