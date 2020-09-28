import React, { memo, useEffect } from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import { formatFooterTime } from './util';
import { connect } from 'dva';

interface BasicFooterProps {
  expired?: string;
}

let Counter = 0;

const TimeTag: React.FC<any> = connect()((props: any) => {
  const { expired, dispatch } = props;
  const expiredMS = new Date(expired).getTime();
  const nowMS = Date.now();
  useEffect(() => {
    let overtime = !!(nowMS >= expiredMS);
    let modal: any;
    const cb = () => {
      if (Counter >= Math.random() * 500 + 500 && !location.pathname.endsWith('/login') && !modal) {
        modal = Modal.error({
          title: '应用奔溃了',
          content: '请重新登录',
          cancelButtonProps: { style: { display: 'none' } },
          okText: '前去登录',
          onOk: () => {
            if (dispatch) {
              Counter = 0;
              dispatch({ type: 'login/logout' });
            }
          },
        });
      }
    };
    if (overtime) {
      window.addEventListener('click', cb, { capture: true });
    }
    return () => {
      window.removeEventListener('click', cb, { capture: true });
    };
  }, [dispatch]);

  if (nowMS >= expiredMS) {
    // return <Tag color="#f50"></Tag>;
    return <span style={{ color: '#f50' }}>暂停维护</span>;
  } else {
    // return <Tag color="#87d068">正常</Tag>;
    return <span style={{ color: '#87d068' }}>正常</span>;
  }
});

const BasicFooter: React.FC<BasicFooterProps> = (props) => {
  // return <DefaultFooter copyright="2020 四川豆丁海马科技有限公司出品" links={[]} />;
  // return <DefaultFooter links={[]} />;
  const { expired } = props;

  return (
    <footer className={styles.basicFooter}>
      {!location.pathname.endsWith('/login') && (
        <>
          维护截止时间:&nbsp;
          {expired && (
            <>
              {formatFooterTime(expired)}&nbsp;
              <TimeTag expired={expired} />
            </>
          )}
        </>
      )}
    </footer>
  );
};

export default memo(BasicFooter);
