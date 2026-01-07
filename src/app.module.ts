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
import { PortModule } from './modules/settings/port/port.module';
import { UnitModule } from './modules/settings/unit/unit.module';
import { PackageModule } from './modules/settings/package/package.module';
import { PackageTypeModule } from './modules/settings/package-type/package-type.module';
import { PaymentTermModule } from './modules/settings/payment-term/payment-term.module';
import { ShipmentTermModule } from './modules/settings/shipment-term/shipment-term.module';
import { CurrencyModule } from './modules/settings/currency/currency.module';
import { BankDetailModule } from './modules/settings/bank-detail/bank-detail.module';
import { QualitySpeculationModule } from './modules/settings/quality-speculation/quality-speculation.module';
import { ProductModule } from './modules/settings/product/product.module';
import { UploadModule } from './modules/upload/upload.module';

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
    PortModule,
    UnitModule,
    PackageModule,
    PackageTypeModule,
    PaymentTermModule,
    ShipmentTermModule,
    CurrencyModule,
    BankDetailModule,
    QualitySpeculationModule,
    ProductModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
