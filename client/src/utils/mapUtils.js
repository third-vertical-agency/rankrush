import * as THREE from "three";
import { geoMercator } from "d3-geo";

// Convert geographical data into a map projection.
export function createProjection(featureCollection, width, height) {
  const padding = 35;

  return geoMercator().fitExtent(
    [
      [-width / 2 + padding, -height / 2 + padding],
      [width / 2 - padding, height / 2 - padding],
    ],
    featureCollection,
  );
}

// Convert a GeoJSON ring into Three.js points.
function convertRing(ring, projection) {
  return ring.map(([longitude, latitude]) => {
    const [x, y] = projection([longitude, latitude]);

    // Invert Y because Three.js and SVG use
    // different vertical coordinate directions.
    return new THREE.Vector2(x, -y);
  });
}

// Convert polygon coordinates into a Three.js shape.
function createPolygonShape(coordinates, projection) {
  const [outerRing, ...innerRings] = coordinates;

  const outerPoints = convertRing(outerRing, projection);

  const shape = new THREE.Shape();

  outerPoints.forEach((point, index) => {
    if (index === 0) {
      shape.moveTo(point.x, point.y);
    } else {
      shape.lineTo(point.x, point.y);
    }
  });

  shape.closePath();

  // Handle holes inside geographical polygons.
  innerRings.forEach((ring) => {
    const points = convertRing(ring, projection);
    const hole = new THREE.Path();

    points.forEach((point, index) => {
      if (index === 0) {
        hole.moveTo(point.x, point.y);
      } else {
        hole.lineTo(point.x, point.y);
      }
    });

    hole.closePath();
    shape.holes.push(hole);
  });

  return shape;
}

// A state may contain one polygon or multiple polygons.
// Islands are a good example of multiple polygons.
export function createStateGeometry(feature, projection) {
  const { type, coordinates } = feature.geometry;

  const polygons = type === "Polygon" ? [coordinates] : coordinates;

  return polygons.map((polygon) => {
    const shape = createPolygonShape(polygon, projection);

    return new THREE.ShapeGeometry(shape);
  });
}

// Create independent boundary lines for each polygon ring.
export function createStateOutlines(feature, projection) {
  const { type, coordinates } = feature.geometry;

  const polygons = type === "Polygon" ? [coordinates] : coordinates;

  return polygons.flatMap((polygon) =>
    polygon.map((ring) => {
      const points = convertRing(ring, projection);

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      return geometry;
    }),
  );
}
