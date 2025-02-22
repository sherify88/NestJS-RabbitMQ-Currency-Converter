import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { ITokenPayload } from 'src/utils/interfaces';
import * as bcrypt from 'bcryptjs';
import { BadRequest } from 'src/utils/enums';

jest.mock('bcryptjs', () => ({
  compareSync: jest.fn(),
}));

jest.mock('src/utils/enums', () => ({
  BadRequest: {
    INVALID_LOGIN: jest.fn(() => new Error('Invalid login')),
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: JwtService;

  beforeEach(async () => {

    const mockUsersService: Partial<UsersService> = {
      findByUsername: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: {}, // Mock ConfigService if necessary
        },
        {
          provide: UsersService, 
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  const mockUser: User = {
    id: 'user123',
    username: 'testuser',
    password: 'hashedPassword123',
  } as User;

  it('should generate a JWT and return the payload', async () => {
    const payload: ITokenPayload = { id: mockUser.id };
    const mockToken = 'mockJwtToken';

    (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await authService.login(mockUser);

    expect(jwtService.sign).toHaveBeenCalledWith(payload);
    expect(result).toEqual({
      ...payload,
      access_token: mockToken,
    });
  });

  it('should throw an error if the password is incorrect', async () => {
    const username = 'testuser';
    const plainTextPassword = 'wrongPassword';

    usersService.findByUsername.mockResolvedValue(mockUser);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false); // Simulate incorrect password

    await expect(authService.validateUser(username, plainTextPassword)).rejects.toThrow(
      'Invalid login'
    );

    expect(usersService.findByUsername).toHaveBeenCalledWith(username);
    expect(bcrypt.compareSync).toHaveBeenCalledWith(plainTextPassword, mockUser.password);
  });

  it('should return the user if the password is correct', async () => {
    const username = 'testuser';
    const plainTextPassword = 'correctPassword';
  
    usersService.findByUsername.mockResolvedValue(mockUser);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true); // Simulate correct password
  
    const result = await authService.validateUser(username, plainTextPassword);
  
    expect(result).toEqual(mockUser);
    expect(usersService.findByUsername).toHaveBeenCalledWith(username);
    expect(bcrypt.compareSync).toHaveBeenCalledWith(plainTextPassword, mockUser.password);
  });
});
