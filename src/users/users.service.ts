import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user-dto';
import { FindUserTransactionsDto } from './dto/find-user-transactions.dto';
var bcrypt = require('bcryptjs');

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
	SALT_Rounds = 10;

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username,  password,  } = createUserDto;
    const hashedPassword = bcrypt.hashSync(password, this.SALT_Rounds);

    const newUser = new this.userModel({ username,  password: hashedPassword });

    try {
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`Duplicate key error: ${Object.keys(error.keyValue).join(', ')} already exists`);
      }
      throw new BadRequestException(); 
    }
  
}

  async getUserTransactionCounts(query: FindUserTransactionsDto) {
    const { userId, page, limit } = query;
  
    const skips = (page - 1) * limit;
  
    const result = await this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }, 
      },
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
            $slice: ['$transactions', skips, limit], 
          },
        },
      },
    ]);
  
    if (!result || result.length === 0) {
      throw new NotFoundException('User not found');
    }
  
    return result[0];
  }



  async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({
      username,
    });
  }
    

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }


}
