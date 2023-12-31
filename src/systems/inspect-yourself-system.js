import { isLockedDownDemoRoom } from "../utils/hub-utils";
import { paths } from "./userinput/paths";
export class InspectYourselfSystem {
  tick(scene, userinput, cameraSystem) {
    if (!scene.is("entered")) return;
    if (userinput.get(paths.actions.startInspectingSelf) && !isLockedDownDemoRoom()) {
      const rig = document.getElementById("avatar-rig");
      cameraSystem.inspect(rig.object3D, 1.5);
    }
  }
}
