import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation';
import { UserModule } from './modules/user/user.module';
import { PredictOsModule } from './modules/predict-os/predict-os.module';
import { UsersModule } from './modules/admin/users/users.module';
import { RoleModule } from './modules/admin/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/admin/organization/organization.module';
import { ComboModule } from './modules/combo/combo.module';
import { CustomersModule } from './modules/settings/customers/customers.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validationSchema,
  }),
    PrismaModule,
    AuthModule,
    UserModule,
    PredictOsModule,
    UsersModule,
    RoleModule,
    OrganizationModule,
    ComboModule,
    CustomersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
