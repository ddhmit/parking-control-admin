import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import moment from 'moment';
async function findMarketDetail(params: any) {
  let search = params.name ? { account: [params.name] } : {};
  let newParams = { page: params.current, limit: params.pageSize, search: search };
  try {
    let res: any = await request(appUrl.FindMarketDetail, {
      method: 'POST',
      data: newParams,
    });
    if (res) {
      let user = res.data.docs;
      let userData = user.map((item: any, index: any) => {
        return {
          key: index,
          role: item.role,
          name: item.account,
          createTime: moment(item.createdAt).format('YYYY-MM-DD'),
          updateTime: moment(item.updateAT).format('YYYY-MM-DD'),
          _id: item._id,
          operation: ['编辑', '删除'],
        };
      });
      return { data: userData, total: res.data.totalDocs, current: res.data.page };
    } else {
      return { data: [], total: 0, current: 1 };
    }
  } catch (err) {
    throw err;
  }
}
export { findMarketDetail };
