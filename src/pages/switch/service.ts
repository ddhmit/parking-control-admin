import io from 'socket.io-client';
import appUrl from '@/config/appUrl';
import { IHeartbeatRes, IAlarmInfoPlate, IResEventRes } from './data';
import customEE, { CustomEventTypes } from '@/utils/customEventEmitter';

const namespace = '/ipCamera';
// 部署原因，静态文件和接口不在一个服务器
let url = appUrl.BaseUrl + namespace;

let ipCameraSocket: undefined | SocketIOClient.Socket;

export const createSocketInstance = function (token: string | undefined) {
  if (ipCameraSocket) {
    // 关闭上一次 socket 的连接
    ipCameraSocket.disconnect();
    // 移除上一个 socket 的所有监听
    ipCameraSocket.removeAllListeners();
  }
  ipCameraSocket = io(url, { timeout: appUrl.Timeout, query: `token=${token}` });
  ipCameraSocket.on('disconnect', ondisconnect);
};

const ondisconnect = function () {
  customEE.emit(CustomEventTypes.socketInstanceDisconnect);
};

export const ipCameraSocketConnect = (token: string | undefined): Promise<any> => {
  return new Promise((resolve, reject) => {
    createSocketInstance(token);
    ipCameraSocket!.once('connect', resolve);
    ipCameraSocket!.once('connect_timeout', reject);
    // ipCameraSocket!.once('disconnect', reject);
    ipCameraSocket!.once('error', reject);
  });
};

const HeartbeatEvent = 'heartbeat';
let lastHeartbeatCB: any = null;
export const ipCameraSocketHeartbeat = (cb: (e: IHeartbeatRes) => void) => {
  if (!ipCameraSocket) return;
  // console.log('add heartBeat');
  ipCameraSocketHeartbeatRemove();
  lastHeartbeatCB = cb;
  ipCameraSocket.on(HeartbeatEvent, cb);
};

export const ipCameraSocketHeartbeatRemove = () => {
  // console.log('解除上一个 Heartbeat 监听');
  if (ipCameraSocket && ipCameraSocket.hasListeners(HeartbeatEvent) && lastHeartbeatCB) {
    ipCameraSocket.off(HeartbeatEvent, lastHeartbeatCB);
  }
};

const AlarmInfoEvent = 'alarmInfoPlate';
let lastAlarmInfoCB: any = null;
export const ipCameraSocketCar = (cb: (e: IAlarmInfoPlate) => void) => {
  if (!ipCameraSocket) return;
  // console.log('add allarm');
  ipCameraSocketCarRemove();
  lastAlarmInfoCB = cb;
  ipCameraSocket.on(AlarmInfoEvent, cb);
};

export const ipCameraSocketCarRemove = () => {
  // console.log('解除上一个 alarmInfoPlate 监听');
  if (ipCameraSocket && ipCameraSocket.hasListeners(AlarmInfoEvent) && lastAlarmInfoCB) {
    ipCameraSocket.off(AlarmInfoEvent, lastAlarmInfoCB);
  }
};

const onGateOpen = async (
  num: string,
  val: IResEventRes,
  resolve: (val?: IResEventRes) => void,
) => {
  if (num === val.serialno) {
    resolve(val);
  }
};

export const ipCameraSocketOpenGate = (num: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!ipCameraSocket) {
      return reject();
    }
    ipCameraSocket.emit('gateOpen', num);
    // ipCameraSocket.once('res', resolve);
    const onRes = async (res: IResEventRes) => {
      ipCameraSocket && ipCameraSocket.off('res', onRes);
      if (!res) {
        reject(new Error('开门响应无返回值'));
      } else {
        await onGateOpen(num, res, resolve);
      }
    };
    ipCameraSocket.on('res', onRes);
    ipCameraSocket.once('connect_timeout', reject);
    ipCameraSocket.once('disconnect', reject);
    ipCameraSocket.once('error', reject);
  });
};

export const removeCameraSocketListener = () => {
  ipCameraSocket && ipCameraSocket.removeAllListeners();
};

export default ipCameraSocket;
