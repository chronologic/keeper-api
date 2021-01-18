import { RequestHandler } from 'express';
import Joi from '@hapi/joi';
import { getConnection } from 'typeorm';

import requestMiddleware from '../../middleware/request-middleware';
import { User } from '../../entities/User';
import BadRequest from '../../errors/bad-request';
import { Operator } from '../../entities/Operator';

export const editSchema = Joi.object().keys({
  address: Joi.string().required(),
  email: Joi.string().optional(),
  operatorAddress: Joi.string().optional(),
});

const edit: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { address, operatorAddress, email } = req.body;
  const manager = getConnection().createEntityManager();

  const user = await manager.findOne(User, { where: { id, address }, relations: ['operators'] });

  if (!user) {
    throw new BadRequest('User does not exist');
  }

  if (typeof email !== 'undefined') {
    user.email = email;
  }

  if (typeof operatorAddress !== 'undefined') {
    const operator = new Operator();
    operator.address = operatorAddress;
    user.operators = [operator];
  }

  await manager.save(User, user);

  res.send({
    id: user.id,
    address: user.address,
    email: user.email,
    operatorAddress: operatorAddress || user.operators[0]?.address,
  });
};

export default requestMiddleware(edit, { validation: { body: editSchema } });
