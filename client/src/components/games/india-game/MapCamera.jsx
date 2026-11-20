import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function MapCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    camera.left = -size.width / 2;
    camera.right = size.width / 2;
    camera.top = size.height / 2;
    camera.bottom = -size.height / 2;

    camera.position.set(0, 0, 100);

    // Do not reset camera.zoom here.
    // Let IndiaMap control the zoom.

    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}
