import { RequestHandler, Response, NextFunction } from 'express';

import Unauthorized from '../errors/unauthorized';
import { RequestWithAuth } from '../types';
import logger from '../logger';

type AddrGetter = (req: RequestWithAuth) => string;

export const routeAuthMiddleware = (getter: AddrGetter): RequestHandler => (
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) => {
  const address = getter(req) || '';

  logger.debug({ address, authAddress: req.authenticatedAddress });

  if (address !== req.authenticatedAddress) {
    return res.end(new Unauthorized());
  }

  return next();
};

export default routeAuthMiddleware;
