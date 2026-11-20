import { useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { geoMercator } from "d3-geo";

import StateFeature from "./StateFeature";
import MapCamera from "./MapCamera";

function MapContents({ data, selectedId, completedIds }) {
  const { size } = useThree();

  const projection = useMemo(() => {
    const padding = 35;

    // First, fit the entire map inside the canvas.
    const rawProjection = geoMercator().fitExtent(
      [
        [padding, padding],
        [size.width - padding, size.height - padding],
      ],
      data,
    );

    // Then shift the projected coordinates so that
    // the center of the map matches the center of the canvas.
    return (coordinates) => {
      const [x, y] = rawProjection(coordinates);

      return [x - size.width / 2, y - size.height / 2];
    };
  }, [data, size.width, size.height]);

  return (
    <>
      <MapCamera />

      {data.features.map((feature) => {
        const id =
          feature.properties.iso ||
          feature.properties.id ||
          feature.properties.name;

        return (
          <StateFeature
            key={id}
            feature={feature}
            projection={projection}
            selected={id === selectedId}
            completed={completedIds.has(id)}
          />
        );
      })}
    </>
  );
}

export default function IndiaMap({
  data,
  selectedId,
  completedIds = new Set(),
}) {
  if (!data?.features?.length) return null;

  return (
    <div className="w-full h-full min-h-105">
      <Canvas
        orthographic
        camera={{
          position: [0, 0, 100],
          zoom: 1,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        <MapContents
          data={data}
          selectedId={selectedId}
          completedIds={completedIds}
        />
      </Canvas>
    </div>
  );
}
