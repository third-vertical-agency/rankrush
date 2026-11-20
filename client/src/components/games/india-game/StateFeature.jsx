import { createStateGeometry, createStateOutlines } from "@/utils/mapUtils";
import { useMemo } from "react";
import * as THREE from "three";

export default function StateFeature({
  feature,
  projection,
  selected,
  completed,
}) {
  const geometries = useMemo(
    () => createStateGeometry(feature, projection),
    [feature, projection],
  );

  const outlines = useMemo(
    () => createStateOutlines(feature, projection),
    [feature, projection],
  );

  const fillColor = completed ? "#164E45" : selected ? "#123F55" : "#202A35";

  return (
    <group>
      {/* Individual geographical polygons */}
      {geometries.map((geometry, index) => (
        <mesh key={`shape-${index}`} geometry={geometry} position={[0, 0, 0]}>
          <meshBasicMaterial
            color={fillColor}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* State boundaries */}
      {outlines.map((geometry, index) => (
        <group key={`outline-${index}`}>
          {selected && (
            <lineLoop geometry={geometry} position={[0, 0, 0.5]}>
              <lineBasicMaterial color="#06B6D4" transparent opacity={0.3} />
            </lineLoop>
          )}

          <lineLoop geometry={geometry} position={[0, 0, 0.7]}>
            <lineBasicMaterial
              color={selected ? "#22D3EE" : "#64748B"}
              transparent={!selected}
              opacity={selected ? 1 : 0.8}
            />
          </lineLoop>
        </group>
      ))}
    </group>
  );
}
