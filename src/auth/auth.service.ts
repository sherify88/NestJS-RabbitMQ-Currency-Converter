import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { ITokenPayload } from 'src/utils/interfaces';
import { BadRequest } from 'src/utils/enums';
@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) { }

	public async validateUser(username: string, plainTextPassword: string) {

		try {
			const user = await this.usersService.findByUsername(username);

			 await this.verifyPassword(plainTextPassword, user.password);
			return user;
		} catch (error) {
			throw BadRequest.INVALID_LOGIN();
		}
	}

	private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
		const isPasswordMatching = await bcrypt.compareSync(plainTextPassword, hashedPassword);
		if (!isPasswordMatching) {
			throw BadRequest.INVALID_LOGIN();
		}
	}

	async login(user: User) {
		const payload: ITokenPayload = {
			id: user.id
		
		};

		return {
			...payload,
			access_token: this.jwtService.sign(payload)
		};
	}
}
