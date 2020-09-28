// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
// @ts-ignore
import { Dispatch, AnyAction, Link, connect } from 'umi';
import { StateType } from '@/models/login';
import styles from './style.less';
import { LoginParamsType } from '@/services/login';
import LoginFrom from './components/Login';

const { Tab, UserName, Password, Submit } = LoginFrom;
interface LoginProps {
  // @ts-ignore
  dispatch: Dispatch<AnyAction>;
  login: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { login = {}, submitting } = props;
  const { status, type: loginType, msg } = login;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: {
        ...values,
        type,
        autoLogin,
      },
    });
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && loginType === 'account' && !submitting && (
            // <LoginMessage content="账户或密码错误" />
            <LoginMessage content={msg || '登录出现异常，请重新尝试'} />
          )}

          <UserName
            name="account"
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        {/* 关闭手机号验证码登录 */}
        {/*  <Tab key="mobile" tab="手机号登录">
      {status === 'error' && loginType === 'mobile' && !submitting && (
        <LoginMessage content="验证码错误" />
      )}
      <Mobile
        name="mobile"
        placeholder="手机号"
        rules={[
          {
            required: true,
            message: '请输入手机号！',
          },
          {
            pattern: /^1\d{10}$/,
            message: '手机号格式错误！',
          },
        ]}
      />
      <Captcha
        name="captcha"
        placeholder="验证码"
        countDown={120}
        getCaptchaButtonText=""
        getCaptchaSecondText="秒"
        rules={[
          {
            required: true,
            message: '请输入验证码！',
          },
        ]}
      />
    </Tab> */}
        <div className="clear-fix">
          <Checkbox
            className={styles.autoLogin}
            checked={autoLogin}
            onChange={(e) => setAutoLogin(e.target.checked)}
          >
            自动登录
            <Tooltip
              placement="topRight"
              title={
                <p>
                  为确保账户安全，自动登录不会保存您的账号密码信息，可放心使用。
                  <br />
                  开启：开启后30天内使用过系统，将无需再次登录。
                  <br />
                  关闭：关闭后需手动输入账号密码进行登录。
                </p>
              }
            >
              <InfoCircleOutlined style={{ paddingLeft: '3px' }} />
            </Tooltip>
          </Checkbox>
          {/* 关闭忘记密码 */}
          {/* <a
        style={{
          float: 'right',
        }}
      >
        忘记密码
      </a> */}
        </div>
        <Submit className={styles.loginBtn} loading={submitting}>
          登录
        </Submit>
        {/* <p style={{ textAlign: 'center' }}>
          等待支付系统接入
          <br />
          涉及出入场、装卸货、充值、支付,车辆出入记录相关功能暂不可用
        </p> */}
        {/* 关闭其他登录方式和注册账户 */}
        {/* <div className={styles.other}>
      其他登录方式
      <AlipayCircleOutlined className={styles.icon} />
      <TaobaoCircleOutlined className={styles.icon} />
      <WeiboCircleOutlined className={styles.icon} />
      <Link className={styles.register} to="/user/register">
        注册账户
      </Link>
    </div> */}
      </LoginFrom>
    </div>
  );
};

export default connect(
  ({
    login,
    loading,
  }: {
    login: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    login,
    submitting: loading.effects['login/login'],
  }),
)(Login);
