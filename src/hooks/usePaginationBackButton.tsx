import { useState, useEffect } from 'react';
import { ActionType } from '@ant-design/pro-table';

export default function usePaginationBackButton(
  actionRef: React.MutableRefObject<ActionType | undefined>,
) {
  const [backButton, setBackButton] = useState<HTMLButtonElement>();
  /**
   * 获取自定义的返回首页按钮
   *
   * @param {HTMLButtonElement} ele
   */
  const getButton = (ele: HTMLButtonElement) => {
    setBackButton(ele);
  };
  /**
   * 返回首页按钮的点击事件
   *
   */
  const onClick = () => {
    actionRef.current && actionRef.current.reload(true);
  };
  /**
   * 添加点击事件监听
   */
  if (backButton) {
    backButton.addEventListener('click', onClick);
  }
  /**
   * 组件卸载和 onClick 变动时，卸载上一次监听
   */
  useEffect(() => {
    return () => {
      backButton && backButton.removeEventListener('click', onClick);
    };
  }, [backButton, onClick]);

  return getButton;
}
