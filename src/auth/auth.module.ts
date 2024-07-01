import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {

        return {
          secret: configService.get('JWT_SEED'),
          signOptions: {
            expiresIn: '60s'
          }
        }

      }
    })
    // JwtModule.register({
    //   global: true,
    //   secret: 'HOLFDLFSKFLKFOS',
    //   signOptions: {
    //     expiresIn: '60s'
    //   }
    // })
  ]
})
export class AuthModule {}
