const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = require('chai');
const Cache = require('../models/cache');

const { addCache } = require('./cache-controller');

describe('cache controller', () => {
  const sandbox = sinon.createSandbox();
  jest.mock('../../config', () => ({
    MONGO_LOCAL_URL: 'url',
    MAX_CACHE_ENTRIES: 2,
  }));
  let count;
  beforeEach(() => {
    sandbox.stub(Cache.prototype, 'save').returns({
      _id: mongoose.Types.ObjectId('62ee689f6aa8b1a0616b8173'),
      key: 'testey',
      value: 'defeated_moccasin_pig',
      createdDate: '2022-08-06T13:11:59.002Z',
      updatedDate: '2022-08-06T13:11:59.002Z',
      lastHit: '2022-08-06T13:11:59.002Z',
      ttl: 60,
      __v: 0,
    });
    count = sandbox.stub().returns(1);
    const limit = sandbox.stub().returns([{
      _id: mongoose.Types.ObjectId('62ee689f6aa8b1a0616b8173'),
      key: 'testey',
      value: 'defeated_moccasin_pig',
      createdDate: '2022-08-06T13:11:59.002Z',
      updatedDate: '2022-08-06T13:11:59.002Z',
      lastHit: '2022-08-06T13:11:59.002Z',
      ttl: 60,
      __v: 0,
    }]);
    const sort = sandbox.stub().returns({ limit });
    sandbox.stub(Cache, 'find').returns({
      count,
      sort,
    });
    sandbox.stub(Cache, 'deleteMany').returns({ acknowledged: true, deletedCount: 0 });
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('add entry when cache limit not reached', async () => {
    const result = await addCache({ key: 'testKey' });
    expect(result).to.deep.equal({
      _id: mongoose.Types.ObjectId('62ee689f6aa8b1a0616b8173'),
      key: 'testey',
      value: 'defeated_moccasin_pig',
      createdDate: '2022-08-06T13:11:59.002Z',
      updatedDate: '2022-08-06T13:11:59.002Z',
      lastHit: '2022-08-06T13:11:59.002Z',
      ttl: 60,
      __v: 0,
    });
  });

  it('add entry when cache limit reached', async () => {
    const result = await addCache({ key: 'testKey' });
    count.returns(2);
    expect(result).to.deep.equal({
      _id: mongoose.Types.ObjectId('62ee689f6aa8b1a0616b8173'),
      key: 'testey',
      value: 'defeated_moccasin_pig',
      createdDate: '2022-08-06T13:11:59.002Z',
      updatedDate: '2022-08-06T13:11:59.002Z',
      lastHit: '2022-08-06T13:11:59.002Z',
      ttl: 60,
      __v: 0,
    });
  });
});
