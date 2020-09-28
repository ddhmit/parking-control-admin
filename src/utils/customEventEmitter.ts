import { EventEmitter } from 'events';
import { AppMaxMarketCameraNum } from '@/config/marketId';

const customEE = new EventEmitter();

customEE.setMaxListeners(AppMaxMarketCameraNum);
// console.log(' 最大 event listener 数量', customEE.getMaxListeners());

export const CustomEventTypes = {
  openGate: 'open-gate',
  openGateFinished: 'open-gate-finished',
  cameraStatusChange: 'camera-status-change',
  socketInstanceDisconnect: 'socket-instance-disconnect',
};

export default customEE;
