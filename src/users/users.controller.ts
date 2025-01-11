import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserTransactionsDto } from './dto/find-user-transactions.dto';
import { UsersService } from './users.service';
import { AllowGuest } from 'src/auth/allow-guest.decorator';
import { ITokenPayload } from 'src/utils/interfaces';
import { User } from 'src/utils/user.decorator';
import { UserHistoryResponse } from './response-schemas/user-transactions-res-schema';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @AllowGuest()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ description: 'User registration details', type: CreateUserDto, required: true })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user transaction history' })
  @ApiResponse({
    status: 200,
    description: 'Transaction history retrieved successfully.',
    type: UserHistoryResponse, 
  })
  async getUserTransactions(@User() { id }: ITokenPayload, @Query() query: FindUserTransactionsDto) {
    query.userId = id;
    return this.userService.getUserTransactionCounts(query);
  }
}
