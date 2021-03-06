import * as React from "react";
import { BooleanMCUInputGroup } from "./boolean_mcu_input_group";
import { ToolTips, DeviceSetting } from "../../constants";
import { ToggleButton } from "../../controls/toggle_button";
import { settingToggle } from "../../devices/actions";
import { NumericMCUInputGroup } from "./numeric_mcu_input_group";
import { MotorsProps } from "./interfaces";
import { Header } from "./header";
import { Collapse, Position } from "@blueprintjs/core";
import { Xyz, McuParamName } from "farmbot";
import { Feature, SourceFwConfig } from "../../devices/interfaces";
import { calcMicrostepsPerMm } from "../../controls/move/direction_axes_props";
import { isTMCBoard } from "../firmware/firmware_hardware_support";
import { SingleSettingRow } from "./single_setting_row";
import { Highlight } from "../maybe_highlight";
import { SpacePanelHeader } from "./space_panel_header";
import { Col, Help, Row } from "../../ui";
import { t } from "../../i18next_wrapper";
import { McuInputBox } from "./mcu_input_box";

export const calculateScale =
  (sourceFwConfig: SourceFwConfig): Record<Xyz, number | undefined> => {
    const getV = (key: McuParamName) => sourceFwConfig(key).value;
    return {
      x: calcMicrostepsPerMm(getV("movement_step_per_mm_x"),
        getV("movement_microsteps_x")),
      y: calcMicrostepsPerMm(getV("movement_step_per_mm_y"),
        getV("movement_microsteps_y")),
      z: calcMicrostepsPerMm(getV("movement_step_per_mm_z"),
        getV("movement_microsteps_z")),
    };
  };

export function Motors(props: MotorsProps) {
  const {
    dispatch, controlPanelState, sourceFwConfig, firmwareHardware, arduinoBusy,
  } = props;
  const enable2ndXMotor = sourceFwConfig("movement_secondary_motor_x");
  const invert2ndXMotor = sourceFwConfig("movement_secondary_motor_invert_x");
  const scale = calculateScale(sourceFwConfig);

  return <Highlight className={"section"}
    settingName={DeviceSetting.motors}>
    <Header
      expanded={controlPanelState.motors}
      title={DeviceSetting.motors}
      panel={"motors"}
      dispatch={dispatch} />
    {controlPanelState.motors &&
      <Help customClass={"hw-warn"} text={ToolTips.HW_SETTINGS}
        customIcon={"exclamation-triangle"} />}
    <Collapse isOpen={!!controlPanelState.motors}>
      <SpacePanelHeader />
      <NumericMCUInputGroup
        label={DeviceSetting.maxSpeed}
        tooltip={ToolTips.MAX_SPEED}
        x={"movement_max_spd_x"}
        y={"movement_max_spd_y"}
        z={"movement_max_spd_z"}
        xScale={scale.x}
        yScale={scale.y}
        zScale={scale.z}
        disabled={arduinoBusy}
        sourceFwConfig={sourceFwConfig}
        dispatch={dispatch} />
      {props.shouldDisplay(Feature.z2_firmware_params) &&
        <Highlight settingName={DeviceSetting.maxSpeedTowardHome}>
          <Row>
            <Col xs={8} className={"z-param-label"}>
              <label>
                {t(DeviceSetting.maxSpeedTowardHome)}
              </label>
              <Help text={ToolTips.MAX_SPEED} position={Position.TOP_RIGHT} />
            </Col>
            <Col xs={4} className={"z-param-input"}>
              <McuInputBox
                setting={"movement_max_spd_z2"}
                sourceFwConfig={sourceFwConfig}
                dispatch={dispatch}
                scale={scale.z}
                disabled={arduinoBusy} />
            </Col>
          </Row>
        </Highlight>}
      <NumericMCUInputGroup
        label={DeviceSetting.homingSpeed}
        tooltip={ToolTips.HOME_SPEED}
        x={"movement_home_spd_x"}
        y={"movement_home_spd_y"}
        z={"movement_home_spd_z"}
        xScale={scale.x}
        yScale={scale.y}
        zScale={scale.z}
        disabled={arduinoBusy}
        sourceFwConfig={sourceFwConfig}
        dispatch={dispatch} />
      <NumericMCUInputGroup
        label={DeviceSetting.minimumSpeed}
        tooltip={ToolTips.MIN_SPEED}
        x={"movement_min_spd_x"}
        y={"movement_min_spd_y"}
        z={"movement_min_spd_z"}
        xScale={scale.x}
        yScale={scale.y}
        zScale={scale.z}
        disabled={arduinoBusy}
        sourceFwConfig={sourceFwConfig}
        dispatch={dispatch} />
      {props.shouldDisplay(Feature.z2_firmware_params) &&
        <Highlight settingName={DeviceSetting.minimumSpeedTowardHome}>
          <Row>
            <Col xs={8} className={"z-param-label"}>
              <label>
                {t(DeviceSetting.minimumSpeedTowardHome)}
              </label>
              <Help text={ToolTips.MIN_SPEED} position={Position.TOP_RIGHT} />
            </Col>
            <Col xs={4} className={"z-param-input"}>
              <McuInputBox
                setting={"movement_min_spd_z2"}
                sourceFwConfig={sourceFwConfig}
                dispatch={dispatch}
                scale={scale.z}
                disabled={arduinoBusy} />
            </Col>
          </Row>
        </Highlight>}
      <NumericMCUInputGroup
        label={DeviceSetting.accelerateFor}
        tooltip={ToolTips.ACCELERATE_FOR}
        x={"movement_steps_acc_dec_x"}
        y={"movement_steps_acc_dec_y"}
        z={"movement_steps_acc_dec_z"}
        xScale={scale.x}
        yScale={scale.y}
        zScale={scale.z}
        disabled={arduinoBusy}
        sourceFwConfig={sourceFwConfig}
        dispatch={dispatch} />
      {props.shouldDisplay(Feature.z2_firmware_params) &&
        <Highlight settingName={DeviceSetting.accelerateForTowardHome}>
          <Row>
            <Col xs={8} className={"z-param-label"}>
              <label>
                {t(DeviceSetting.accelerateForTowardHome)}
              </label>
              <Help text={ToolTips.ACCELERATE_FOR} position={Position.TOP_RIGHT} />
            </Col>
            <Col xs={4} className={"z-param-input"}>
              <McuInputBox
                setting={"movement_steps_acc_dec_z2"}
                sourceFwConfig={sourceFwConfig}
                dispatch={dispatch}
                scale={scale.z}
                disabled={arduinoBusy} />
            </Col>
          </Row>
        </Highlight>}
      <NumericMCUInputGroup
        label={DeviceSetting.stepsPerMm}
        tooltip={ToolTips.STEPS_PER_MM}
        x={"movement_step_per_mm_x"}
        y={"movement_step_per_mm_y"}
        z={"movement_step_per_mm_z"}
        xScale={sourceFwConfig("movement_microsteps_x").value}
        yScale={sourceFwConfig("movement_microsteps_y").value}
        zScale={sourceFwConfig("movement_microsteps_z").value}
        disabled={arduinoBusy}
        float={false}
        sourceFwConfig={props.sourceFwConfig}
        dispatch={props.dispatch} />
      <NumericMCUInputGroup
        label={DeviceSetting.microstepsPerStep}
        tooltip={ToolTips.MICROSTEPS_PER_STEP}
        x={"movement_microsteps_x"}
        y={"movement_microsteps_y"}
        z={"movement_microsteps_z"}
        disabled={arduinoBusy}
        sourceFwConfig={props.sourceFwConfig}
        dispatch={props.dispatch} />
      <BooleanMCUInputGroup
        label={DeviceSetting.alwaysPowerMotors}
        tooltip={ToolTips.ALWAYS_POWER_MOTORS}
        x={"movement_keep_active_x"}
        y={"movement_keep_active_y"}
        z={"movement_keep_active_z"}
        disabled={arduinoBusy}
        dispatch={dispatch}
        sourceFwConfig={sourceFwConfig} />
      <BooleanMCUInputGroup
        label={DeviceSetting.invertMotors}
        tooltip={ToolTips.INVERT_MOTORS}
        x={"movement_invert_motor_x"}
        y={"movement_invert_motor_y"}
        z={"movement_invert_motor_z"}
        disabled={arduinoBusy}
        dispatch={dispatch}
        sourceFwConfig={sourceFwConfig} />
      {isTMCBoard(firmwareHardware) &&
        <NumericMCUInputGroup
          label={DeviceSetting.motorCurrent}
          tooltip={ToolTips.MOTOR_CURRENT}
          x={"movement_motor_current_x"}
          y={"movement_motor_current_y"}
          z={"movement_motor_current_z"}
          disabled={arduinoBusy}
          dispatch={dispatch}
          sourceFwConfig={sourceFwConfig} />}
      <SingleSettingRow settingType="button"
        label={DeviceSetting.enable2ndXMotor}
        tooltip={ToolTips.ENABLE_X2_MOTOR}>
        <ToggleButton
          className={"no-float"}
          toggleValue={enable2ndXMotor.value}
          dim={!enable2ndXMotor.consistent}
          disabled={arduinoBusy}
          toggleAction={() => dispatch(
            settingToggle("movement_secondary_motor_x", sourceFwConfig))} />
      </SingleSettingRow>
      <SingleSettingRow settingType="button"
        label={DeviceSetting.invert2ndXMotor}
        tooltip={ToolTips.INVERT_MOTORS}>
        <ToggleButton
          className={"no-float"}
          grayscale={!enable2ndXMotor.value}
          toggleValue={invert2ndXMotor.value}
          dim={!invert2ndXMotor.consistent}
          disabled={arduinoBusy}
          toggleAction={() => dispatch(
            settingToggle("movement_secondary_motor_invert_x", sourceFwConfig))} />
      </SingleSettingRow>
    </Collapse>
  </Highlight>;
}
