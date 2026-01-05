import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation';
import { UserModule } from './modules/user/user.module';
import { PredictOsModule } from './modules/predict-os/predict-os.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validationSchema,
  }),
  PrismaModule,
  UserModule,
  PredictOsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
