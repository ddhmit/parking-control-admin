export interface IHeartbeatRes {
  countid: number;
  serialno: string;
  timeStamp: { Timeval: { sec: number; usec: number } };
}

export interface IAlarmInfoPlate {
  channel: number;
  deviceName: string;
  ipaddr: string;
  result: {
    PlateResult: {
      bright: number;
      carBright: number;
      carColor: number;
      colorType: number;
      colorValue: number;
      confidence: number;
      direction: number;
      // 车辆图片渲染 base64
      imageFragmentFile: string;
      imageFragmentFileLen: number;
      imageFile: string;
      imageFileLen: number;
      imagePath: string;
      // 车牌号
      license: string;
      location: {
        RECT: { top: number; left: number; right: number; bottom: number };
      };
      timeUsed: number;
      triggerType: number;
      type: number;
      timeStamp: {
        Timeval: {
          // 拍摄时间
          sec: number;
          usec: number;
        };
      };
    };
  };

  serialno: string;
}

export interface IResEventRes {
  serialno: string;
  msg: string;
}
