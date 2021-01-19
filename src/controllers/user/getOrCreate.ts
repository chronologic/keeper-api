import { RequestHandler } from 'express';
import Joi from '@hapi/joi';
import { getConnection } from 'typeorm';
import { BigNumber } from 'ethers';

import requestMiddleware from '../../middleware/request-middleware';
import { User } from '../../entities/User';

export const addUserSchema = Joi.object().keys({
  address: Joi.string().required(),
});

const getOrCreate: RequestHandler = async (req, res) => {
  const { address } = req.body;
  const manager = getConnection().createEntityManager();

  let user = await manager.findOne(User, { where: { address }, relations: ['operators'] });

  if (!user) {
    user = await getConnection()
      .createEntityManager()
      .save(User, {
        address,
        operators: [],
      } as User);
  }

  res.send({
    address: user.address,
    email: user.email,
    balanceEth: BigNumber.from(user.balanceEth || 0).toString(),
    operatorAddress: user.operators[0]?.address || null,
  });
};

export default requestMiddleware(getOrCreate, { validation: { body: addUserSchema } });
