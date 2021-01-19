/* eslint-disable indent */
import { BigNumber, ethers } from 'ethers';
import { RequestHandler } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';

import requestMiddleware from '../../middleware/request-middleware';

interface IDepositResponse {
  id: number;
  depositAddress: string;
  status: string;
  redemptionCost: string;
  createdAt: string;
}

const deposits: IDepositResponse[] = [];
const depositStatuses = ['ACTIVE', 'REDEEMED', 'KEEPER_REDEEMED'];

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

const list: RequestHandler = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const start = (limit as number) * ((page as number) - 1);
  const end = (limit as number) * (page as number);
  const items = deposits.slice(start, end);
  const total = deposits.length;

  res.send({
    items,
    total,
  });
};

export default requestMiddleware(list);
