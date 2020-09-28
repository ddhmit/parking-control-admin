import env from '../utils/env';
const Timeout = 8000;
// let BaseUrl: string = '192.168.101.151:7002';
let BaseUrl: string = 'https://frp.bgonline.cn';
if (env.isProd()) {
  // 生成环境
  BaseUrl = 'https://park.ddhmit.com';
}
// 登录
const LoginUrl = '/api/access/login';
// refresh token
const RefreshTokenUrl = '/api/access/refreshToken';
//查询市场信息
const FindMarketDetail = '/api/market/staff/index';
//超管新增员工和修改员工
const UpdateStaff = '/api/market/staff/update';
//超管删除员工
const DeletStaff = '/api/market/staff/delete';

/* 商户部分 */
// 获取商户列表
const RequestShopListUrl = '/api/merchant/index';
// 删除商户
const DelShopUrl = '/api/merchant/delete';
// 审核商户
const ReviewShopUrl = '/api/merchant/audit';
// 获取商户职员列表
const RequestShopStaffUrl = '/api/merchant/staff/index';
// 审核商户职员
const ReviewShopStaffUrl = '/api/merchant/staff/audit';
// 获取市场数据
const RequestMarketInfoUrl = '/api/market/index';
// 获取用户数据
const RequestUserUrl = '/api/user/index';
// 积分修改
const changePointUrl = '/api/merchant/integral';

//商户绑定车辆
const ShopBindCards = '/api/merchant/car/update';
//删除商户车辆
const ClearShopCards = '/api/merchant/car/delete';
//市场绑定车辆
const MarketBindCars = '/api/market/car/update';
//市场删除车辆
const MarketClearCars = '/api/market/car/delete';
const VehicleAccessRecord = '/api/car/inAndOut/index';
//车辆的装卸货记录
const LoadingUnloadingRecords = '/api/car/loadAndUnload/index';
//收费标准的设置
const ChargingStandard = '/api/set';
const RequestChargingStandard = '/api/set/index';
// 错误上报
const ReportError = '/api/alarm/create';
//运维删除车辆
const Maintenance = '/api/car/delete';
//手动录入车牌
const InputCarID = '/api/car/inAndOut/manual';

// 超管修改密码
const ChangePWDUrl = '/api/user/changePwd';

export default {
  BaseUrl,
  LoginUrl,
  RefreshTokenUrl,
  FindMarketDetail,
  UpdateStaff,
  DeletStaff,
  Timeout,
  RequestShopListUrl,
  DelShopUrl,
  ReviewShopUrl,
  RequestShopStaffUrl,
  ReviewShopStaffUrl,
  RequestMarketInfoUrl,
  ShopBindCards,
  ClearShopCards,
  MarketBindCars,
  MarketClearCars,
  RequestUserUrl,
  VehicleAccessRecord,
  LoadingUnloadingRecords,
  ReportError,
  changePointUrl,
  ChargingStandard,
  RequestChargingStandard,
  Maintenance,
  InputCarID,
  ChangePWDUrl,
};
