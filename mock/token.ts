import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array

  'POST /testToken': (req: Request, res: Response) => {
    console.log('header --- ', req.headers);
    if (req.headers['authorization'] === 'Bearer 111111') {
      res.send({
        data: {
          tag: 'token 1 同时发送成功',
        },
        msg: 'success',
      });
    } else {
      res.status(401).send({
        msg: 'accessToken 过期',
      });
    }
  },
  'POST /testToken2': (req: Request, res: Response) => {
    if (req.headers['authorization'] === 'Bearer 111111') {
      res.send({
        data: {
          tag: 'token2 同时发送成功',
        },
        msg: 'success',
      });
    } else {
      res.status(401).send({ msg: 'accessToken 过期' });
    }
  },
  'POST /access/refreshToken': (req: Request, res: Response) => {
    // if (req.headers['Authorization'] === 'Bearer 111111') {
    //   res.send({ data: { accessToken: '111111', refreshToken: '22222' } });
    // } else {
    //   res.status(410).send({ msg: 'refreshToken 过期' });
    // }
    // res.status(410).send({ msg: 'refreshToken 过期' });
    res.send({ data: { accessToken: '111111', refreshToken: '22222' } });
  },
};
