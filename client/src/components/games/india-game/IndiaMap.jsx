import { useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { geoMercator } from "d3-geo";

import indiaGeoJSON from "../../../data/indian-states.json";

import StateFeature from "./StateFeature";
import MapCamera from "./MapCamera";

function MapContents({ data, selectedId, completedIds }) {
  const { size } = useThree();

  const projection = useMemo(() => {
    return geoMercator().fitExtent(
      [
        [-size.width / 2 + 35, -size.height / 2 + 35],
        [size.width / 2 - 35, size.height / 2 - 35],
      ],
      data,
    );
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
  // Use imported data directly if no data is passed by the parent.
  const mapData = data ?? indiaGeoJSON;

  if (!mapData?.features?.length) {
    return (
      <div className="flex h-full min-h-105 items-center justify-center text-red-400">
        Map data is unavailable.
      </div>
    );
  }

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
          data={mapData}
          selectedId={selectedId}
          completedIds={completedIds}
        />
      </Canvas>
    </div>
  );
}
