import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    _id: 'mockUserId',
    username: 'testuser',
    password: 'hashedPassword123',
  };

  const createUserDto = {
    username: 'testuser',
    password: 'password123',
  };

  const mockUserModel = jest.fn().mockImplementation((data) => ({
    save: jest.fn().mockResolvedValue({ ...data, _id: 'mockUserId' }),
  }));

  beforeEach(async () => {
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
  });

  it('should create a new user', async () => {
    const hashedPassword = 'hashedPassword123';
    (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);

    const result = await service.create(createUserDto);

    // Assertions
    expect(bcrypt.hashSync).toHaveBeenCalledWith(createUserDto.password, service.SALT_Rounds);
    expect(result).toEqual({
      ...createUserDto,
      password: hashedPassword,
      _id: 'mockUserId',
    });
  });
});
