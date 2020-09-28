// @ts-ignore
import manifestJson from '../manifest.json';
import env from '../utils/env';
// 5e984cff5a8eb643283c109f
// export const AppMarketId = '5e984cff5a8eb643283c109f';
// export const AppMarketId = env.isProd() ? '5eba3a8c835b0e003e8d7456' : '5e984cff5a8eb643283c109f';
export const AppMarketId = env.isProd() ? '5eba3a8c835b0e003e8d7456' : '5eba3a8c835b0e003e8d7456'; // 测试用
export const AppMarketName = manifestJson.name;
export const AppMaxMarketCameraNum = Infinity;
