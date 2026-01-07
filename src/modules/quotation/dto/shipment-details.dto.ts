import { IsOptional, IsString, IsInt, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShipmentDetailsDto {
    @ApiPropertyOptional({ description: 'Country of Origin of Goods' })
    @IsOptional()
    @IsString()
    countryOfOrigin?: string;

    @ApiPropertyOptional({ description: 'Pre Carriage By' })
    @IsOptional()
    @IsString()
    preCarriageBy?: string;

    @ApiPropertyOptional({ description: 'Place Of Receipt By Pre Carrier' })
    @IsOptional()
    @IsString()
    placeOfReceiptByPreCarrier?: string;

    @ApiPropertyOptional({ description: 'Vessel/Flight No.' })
    @IsOptional()
    @IsString()
    vesselFlightNo?: string;

    @ApiPropertyOptional({ description: 'Country Of Loading' })
    @IsOptional()
    @IsString()
    countryOfLoading?: string;

    @ApiPropertyOptional({ description: 'Place Of Loading' })
    @IsOptional()
    @IsString()
    placeOfLoading?: string;

    @ApiPropertyOptional({ description: 'Country Of Discharge' })
    @IsOptional()
    @IsString()
    countryOfDischarge?: string;

    @ApiPropertyOptional({ description: 'Port Of Discharge' })
    @IsOptional()
    @IsString()
    portOfDischarge?: string;

    // Fields when salesBroker is false
    @ApiPropertyOptional({ description: 'Currency ID (when salesBroker is false)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    currencyId?: number;

    @ApiPropertyOptional({ description: 'Conversion Rate (when salesBroker is false)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    conversionRate?: number;

    @ApiPropertyOptional({ description: 'Bank Detail ID (when salesBroker is false)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    bankId?: number;

    @ApiPropertyOptional({ description: 'Shipment Period' })
    @IsOptional()
    @IsString()
    shipmentPeriod?: string;

    @ApiPropertyOptional({ description: 'Shipment Term ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    shipmentTermId?: number;

    @ApiPropertyOptional({ description: 'Payment Term ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    paymentTermId?: number;

    @ApiPropertyOptional({ description: 'Salesperson User ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    salespersonId?: number;

    // Fields when salesBroker is true
    @ApiPropertyOptional({ description: 'Brokerage (when salesBroker is true)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    brokerage?: number;

    @ApiPropertyOptional({ description: 'Brokerage Unit (when salesBroker is true)', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    brokerageUnit?: number;

    @ApiPropertyOptional({ description: 'Sold By (when salesBroker is true)' })
    @IsOptional()
    @IsString()
    soldBy?: string;
}
