/* eslint-disable */
import { CallMode, CallSettings } from "../types";

export const defaultCallSettings = {
  swapXY: CallMode.ReturnConfirmatedOperation,
  swapYX: CallMode.ReturnConfirmatedOperation,
  setPosition: CallMode.ReturnConfirmatedOperation,
  updatePosition: CallMode.ReturnConfirmatedOperation,
  transfer: CallMode.ReturnConfirmatedOperation,
  updateOperators: CallMode.ReturnConfirmatedOperation,
  increaseObservationCount: CallMode.ReturnConfirmatedOperation,
};