// Pose de cámara compartida fuera de React (la escribe CameraRig cada fotograma; la lee el minimapa).
// Evita re-renderizados de React a 60 fps.
import { Vector3 } from 'three';

export const cameraPose = {
  position: new Vector3(-58, 46, 66),
  target: new Vector3(0, 0, 0),
};
