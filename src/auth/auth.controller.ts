import {
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  SerializeOptions,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from '../utils/interfaces';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import JwtAuthGuard from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AllowGuest } from './allow-guest.decorator';

@ApiTags('auth')
@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiBody({
    description: 'User login credentials',
    type: LoginUserDto, // Automatically generates the request body structure
    required: true,
  })
  @HttpCode(200)
  @AllowGuest()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: IRequestWithUser, @Body() body: LoginUserDto) {
    return this.authService.login(request.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiExcludeEndpoint()
  authenticate(@Req() request: IRequestWithUser) {
    const user = request.user;
    return user;
  }
}
