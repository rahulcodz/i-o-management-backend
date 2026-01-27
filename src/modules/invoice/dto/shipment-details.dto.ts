import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ShipmentDetailsDto {
    @ApiPropertyOptional({ description: 'Country of Origin' })
    @IsOptional()
    @IsString()
    countryOfOrigin?: string;

    @ApiPropertyOptional({ description: 'Pre Carriage By' })
    @IsOptional()
    @IsString()
    preCarriageBy?: string;

    @ApiPropertyOptional({ description: 'Country of Loading' })
    @IsOptional()
    @IsString()
    countryOfLoading?: string;

    @ApiPropertyOptional({ description: 'Country of Discharge' })
    @IsOptional()
    @IsString()
    countryOfDischarge?: string;

    @ApiPropertyOptional({ description: 'Port of Discharge' })
    @IsOptional()
    @IsString()
    portOfDischarge?: string;

    @ApiPropertyOptional({ description: 'Currency ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    currencyId?: number;

    @ApiPropertyOptional({ description: 'Conversion Rate' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    conversionRate?: number;

    @ApiPropertyOptional({ description: 'Bank Details ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    bankId?: number;

    @ApiPropertyOptional({ description: 'Payment Term ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    paymentTermId?: number;

    @ApiPropertyOptional({ description: 'Shipment Term ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    shipmentTermId?: number;

    @ApiPropertyOptional({ description: 'Shipment Period' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    shipmentPeriod?: number;

    @ApiPropertyOptional({ description: 'Order Type' })
    @IsOptional()
    @IsString()
    orderType?: string;
}
