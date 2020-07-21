import { getDevice } from "../../device";
import { toPairs } from "../../util";
import { commandErr } from "../../devices/actions";

export const calibrate = (grid: boolean) => () =>
  getDevice()
    .execScript("camera-calibration",
      toPairs({
        CAMERA_CALIBRATION_easy_calibration: grid ? "TRUE" : "FALSE"
      }))
    .catch(commandErr("Camera calibration"));

export const scanImage = (grid: boolean) => (imageId: number) =>
  getDevice()
    .execScript("historical-camera-calibration",
      toPairs({
        CAMERA_CALIBRATION_selected_image: "" + imageId,
        CAMERA_CALIBRATION_easy_calibration: grid ? "TRUE" : "FALSE",
      }))
    .catch(commandErr("Camera calibration"));
