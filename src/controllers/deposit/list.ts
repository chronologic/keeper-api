/* eslint-disable indent */
import { BigNumber, ethers } from 'ethers';
import { RequestHandler } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import { getConnection } from 'typeorm';
import { Deposit, User } from '../../entities';

import requestMiddleware from '../../middleware/request-middleware';
import { RequestWithAuth } from '../../types';

interface IDepositResponse {
  id: number;
  depositAddress: string;
  status: string;
  redemptionCost: string;
  createdAt: string;
}

const deposits: IDepositResponse[] = [];
const depositStatuses = ['ACTIVE', 'REDEEMED', 'KEEPER_REDEEMED', 'KEEPER_REDEEMING', 'KEEPER_QUEUED_FOR_REDEMPTION'];

function makeFakeDeposits() {
  for (let i = 1; i <= 47; i++) {
    const status = faker.random.arrayElement(depositStatuses);
    const redemptionCost =
      status === depositStatuses[2]
        ? BigNumber.from(faker.random.number({ min: 100000, max: 10000000 }))
            .mul(BigNumber.from(10).pow(11))
            .toString()
        : null;
    const depositAddress = ethers.Wallet.createRandom().address;

    deposits.push({
      id: i,
      status,
      redemptionCost,
      depositAddress,
      createdAt: faker.date.recent(30).toISOString(),
    });
  }
}

makeFakeDeposits();

// const list: RequestHandler = async (req, res) => {
//   const { page = 1, limit = 20 } = req.query;
//   const start = (limit as number) * ((page as number) - 1);
//   const end = (limit as number) * (page as number);
//   const items = deposits.slice(start, end);
//   const total = deposits.length;

//   res.send({
//     items,
//     total,
//   });
// };
const list: RequestHandler = async (req: RequestWithAuth, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { items, total } = await getDepositsForAddress(req.authenticatedAddress, Number(page), Number(limit));

  res.send({
    items,
    total,
  });
};

async function getDepositsForAddress(
  address: string,
  page = 1,
  limit = 20
): Promise<{ items: Deposit[]; total: number }> {
  const connection = getConnection();
  const q = connection.createQueryBuilder().select('*').from(Deposit, 'd');
  const subq = q
    .subQuery()
    .select('1')
    .from(User, 'u')
    .innerJoin('u.operators', 'o')
    .innerJoin('o.deposits', 'd2')
    .where('d.id = d2.id')
    .andWhere('(d.status in (:...statuses) OR d."systemStatus" is not null)', {
      statuses: [Deposit.Status[Deposit.Status.ACTIVE]],
    })
    .andWhere('u.address = :address', { address });

  const offset = limit * (page - 1);

  const items = await q
    .andWhere(`exists ${subq.getQuery()}`)
    .addOrderBy('d."systemStatus"', 'DESC', 'NULLS LAST')
    .addOrderBy('d.status', 'DESC')
    .addOrderBy('d."createdAt"', 'DESC')
    .limit(limit)
    .offset(offset)
    .execute();
  const total = await q.andWhere(`exists ${subq.getQuery()}`).getCount();

  return { items, total };
}

export default requestMiddleware(list);
