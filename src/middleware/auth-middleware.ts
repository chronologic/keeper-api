import { RequestHandler, Response, NextFunction } from 'express';
import auth from 'basic-auth';
import ethers from 'ethers';

import Unauthorized from '../errors/unauthorized';
import { RequestWithAuth } from '../types';
import { MESSAGE_TO_SIGN } from '../constants';
import logger from '../logger';

export const authMiddleware = (): RequestHandler => (req: RequestWithAuth, res: Response, next: NextFunction) => {
  const { name, pass } = auth(req) || {};

  logger.debug({ name, pass });

  if (!name || !pass) {
    return res.end(new Unauthorized());
  }

  const valid = ethers.utils.verifyMessage(MESSAGE_TO_SIGN, pass).toLowerCase() === name.toLowerCase();

  logger.debug(`Auth valid: ${valid}`);

  if (!valid) {
    return res.end(new Unauthorized());
  }

  req.authenticatedAddress = name.toLowerCase();
  return next();
};

export default authMiddleware;
