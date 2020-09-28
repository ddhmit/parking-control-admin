import React from 'react';
import StackTrace from 'stacktrace-js';
import reportError from '@/services/reportError';
import env from '@/utils/env';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.log(' error boundary => ', error);
    // 你同样可以将错误日志上报给服务器
    if (!env.isProd()) return;
    StackTrace.fromError(error)
      .then((res) => {
        reportError({ type: error.name, details: error.message, content: res.slice(0, 3) });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>应用出现问题，请刷新页面后重新尝试</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
