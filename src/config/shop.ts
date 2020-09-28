/* 
          '审核不通过', '正常', '禁止登陆', '审核中'
        */
export enum ShopReviewStatus {
  Success = '正常',
  Refused = '审核不通过',
  Reviewing = '审核中',
  // Forbidden = '禁止登陆', // 该状态移除
}
