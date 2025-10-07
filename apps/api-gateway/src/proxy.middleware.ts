import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private authProxy = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
  });

  private userProxy = createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/user': '' },
  });

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/auth')) {
      this.authProxy(req, res, next);
    } else if (req.path.startsWith('/user')) {
      this.userProxy(req, res, next);
    } else {
      res.status(404).json({
        message: 'Not found',
      });
    }
  }
}
