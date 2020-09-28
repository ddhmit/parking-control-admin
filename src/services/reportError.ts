import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import { StackFrame } from 'stacktrace-js';

// `管理后台 TypeError`
interface IReportError {
  // 类型
  type: string;
  // 详细信息
  details: string;
  // 正文
  content: StackFrame[];
}
export default function reportError(reportMsg: IReportError) {
  request.post(appUrl.ReportError, {
    data: {
      ...reportMsg,
      type: 'Admin: ' + reportMsg.type,
    },
  });
}
