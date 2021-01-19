import { RequestHandler } from 'express';
import Joi from '@hapi/joi';
import { getConnection } from 'typeorm';

import requestMiddleware from '../../middleware/request-middleware';
import { User } from '../../entities/User';
import BadRequest from '../../errors/bad-request';
import { Operator } from '../../entities/Operator';
import { BigNumber } from 'ethers';

export const editSchema = Joi.object().keys({
  email: Joi.string().optional(),
  operatorAddress: Joi.string().optional(),
});

const edit: RequestHandler = async (req, res) => {
  const { address } = req.params;
  const { operatorAddress, email } = req.body;
  const manager = getConnection().createEntityManager();

  const user = await manager.findOne(User, { where: { address }, relations: ['operators'] });

  if (!user) {
    throw new BadRequest('User does not exist');
  }

  if (typeof email !== 'undefined') {
    user.email = email;
  }

  if (operatorAddress === null || operatorAddress === '') {
    user.operators = [];
  } else if (typeof operatorAddress !== 'undefined') {
    let operator = await manager.findOne(Operator, {
      where: { address: operatorAddress },
    });

    if (!operator) {
      operator = await manager.save(Operator, { address: operatorAddress } as Operator);
    }

    user.operators = [operator];
  }

  await manager.save(User, user);

  res.send({
    address: user.address,
    email: user.email,
    balanceEth: BigNumber.from(user.balanceEth || 0).toString(),
    operatorAddress: user.operators[0]?.address,
  });
};

export default requestMiddleware(edit, { validation: { body: editSchema } });
