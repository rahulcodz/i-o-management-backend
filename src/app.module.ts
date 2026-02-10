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
import { VendorsModule } from './modules/settings/vendors/vendors.module';
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
import { MaterialModule } from './modules/settings/material/material.module';
import { ConfigurationModule } from './modules/settings/cofiguration/configuration.module';
import { DocumentTemplateModule } from './modules/settings/document-template/document-template.module';
import { QuotationModule } from './modules/quotation/quotation.module';
import { ProformaInvoiceModule } from './modules/proforma-invoice/proforma-invoice.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PreShipmentModule } from './modules/pre-shipment/pre-shipment.module';
import { BLDraftModule } from './modules/bl-draft/bl-draft.module';
import { COASettingModule } from './modules/coa-setting/coa-setting.module';
import { ProductLabelParameterModule } from './modules/product-label-parameter/product-label-parameter.module';
import { UploadModule } from './modules/upload/upload.module';
import { PackagingListModule } from './modules/packaging-list/packaging-list.module';
import { PostShipmentModule } from './modules/post-shipment/post-shipment.module';

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
    VendorsModule,
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
    MaterialModule,
    ConfigurationModule,
    DocumentTemplateModule,
    QuotationModule,
    ProformaInvoiceModule,
    InvoiceModule,
    PreShipmentModule,
    BLDraftModule,
    COASettingModule,
    ProductLabelParameterModule,
    UploadModule,
    PackagingListModule,
    PostShipmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
