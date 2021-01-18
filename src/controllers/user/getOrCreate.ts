import { RequestHandler } from 'express';
import Joi from '@hapi/joi';
import { getConnection } from 'typeorm';

import requestMiddleware from '../../middleware/request-middleware';
import { User } from '../../entities/User';
import { Operator } from '../../entities/Operator';

export const addUserSchema = Joi.object().keys({
  address: Joi.string().required(),
  operatorAddress: Joi.string().optional(),
  email: Joi.string().optional(),
});

const getOrCreate: RequestHandler = async (req, res) => {
  const { address, operatorAddress, email } = req.body;
  const manager = getConnection().createEntityManager();

  let user = await manager.findOne(User, { where: { address }, relations: ['operators'] });

  if (!user) {
    const operator = new Operator();
    operator.address = operatorAddress;

    user = await getConnection()
      .createEntityManager()
      .save(User, {
        address,
        email,
        operators: [operator],
      } as User);
  }

  res.send({
    id: user.id,
    address: user.address,
    email: user.email,
    balanceEth: user.balanceEth,
    operatorAddress: operatorAddress || user.operators[0]?.address,
  });
};

export default requestMiddleware(getOrCreate, { validation: { body: addUserSchema } });
