import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('UsersService - Transactions', () => {
  let service: UsersService;
  let userModel: any;

  const mockUser = {
    _id: 'mockUserId',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
    age: 25,
  };

  const mockTransactions = [
    { _id: 'txn1', amount: 100, user: 'mockUserId' },
    { _id: 'txn2', amount: 200, user: 'mockUserId' },
  ];

  const mockAggregationResult = [
    {
      username: 'testuser',
      transactionCount: 2,
      transactions: mockTransactions,
    },
  ];

  beforeEach(async () => {
    const mockUserModel = {
      aggregate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken('User'));
  });

  it('should return user with transactions and transaction count', async () => {
    const query = { userId: '64a9a9b53c529644dc13c5c8', page: 1, limit: 2 }; // Must use a valid ObjectId
  
    const mockTransactions = [
      { _id: 'txn1', amount: 100, user: '64a9a9b53c529644dc13c5c8' },
      { _id: 'txn2', amount: 200, user: '64a9a9b53c529644dc13c5c8' },
    ];
  
    const mockAggregationResult = [
      {
        username: 'testuser',
        transactionCount: 2,
        transactions: mockTransactions,
      },
    ];
  
    userModel.aggregate.mockResolvedValue(mockAggregationResult);
  
    const result = await service.getUserTransactionCounts(query);
  
    // Assertions
    expect(userModel.aggregate).toHaveBeenCalledWith([
      { $match: { _id: new mongoose.Types.ObjectId(query.userId) } },
      {
        $lookup: {
          from: 'convtransactions',
          localField: '_id',
          foreignField: 'user',
          as: 'transactions',
        },
      },
      {
        $addFields: {
          transactionCount: { $size: '$transactions' },
        },
      },
      {
        $project: {
          username: 1,
          transactionCount: 1,
          transactions: {
            $slice: ['$transactions', 0, query.limit], 
          },
        },
      },
    ]);
    expect(result).toEqual(mockAggregationResult[0]);
  });

  it('should return user with no transactions', async () => {
    const query = { userId: '64a9a9b53c529644dc13c5c8', page: 1, limit: 2 };

    const mockEmptyResult = [
      {
        username: 'testuser',
        transactionCount: 0,
        transactions: [],
      },
    ];

    userModel.aggregate.mockResolvedValue(mockEmptyResult);

    const result = await service.getUserTransactionCounts(query);

    expect(result).toEqual(mockEmptyResult[0]);
  });

  it('should throw NotFoundException if user is not found', async () => {
    const query = { userId: '64a9a9b53c529644dc13c5c9', page: 1, limit: 2 };

    userModel.aggregate.mockResolvedValue([]);

    await expect(service.getUserTransactionCounts(query)).rejects.toThrow(NotFoundException);
  });
});
