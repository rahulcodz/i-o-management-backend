import { IsOptional, IsString, IsBoolean, IsDateString, IsArray, ValidateNested, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ConsigneeDetailsDto } from './consignee-details.dto';
import { ShipmentDetailsDto } from './shipment-details.dto';
import { ProductDetailsDto } from './product-details.dto';
import { ShipmentModelDto } from './shipment-model.dto';
import { ContainerDetailsDto } from './container-details.dto';

export class UpdateProformaInvoiceDto {
    @ApiPropertyOptional({ description: 'Quotation ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    quotationId?: number;

    @ApiPropertyOptional({ description: 'PI No (must be unique)' })
    @IsOptional()
    @IsString()
    piNo?: string;

    @ApiPropertyOptional({ description: 'Date' })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional({ description: 'Consignee Details', type: ConsigneeDetailsDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => ConsigneeDetailsDto)
    consigneeDetails?: ConsigneeDetailsDto;

    @ApiPropertyOptional({ description: 'Shipment Details', type: ShipmentDetailsDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => ShipmentDetailsDto)
    shipmentDetails?: ShipmentDetailsDto;

    @ApiPropertyOptional({ description: 'Product Details Array', type: [ProductDetailsDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailsDto)
    productDetails?: ProductDetailsDto[];

    @ApiPropertyOptional({ description: 'Shipment Model', type: ShipmentModelDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => ShipmentModelDto)
    shipmentModel?: ShipmentModelDto;

    @ApiPropertyOptional({ description: 'Remarks' })
    @IsOptional()
    @IsString()
    remarks?: string;

    @ApiPropertyOptional({ description: 'Internal Note' })
    @IsOptional()
    @IsString()
    internalNote?: string;

    @ApiPropertyOptional({ description: 'Container Details Array', type: [ContainerDetailsDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContainerDetailsDto)
    containerDetails?: ContainerDetailsDto[];

    @ApiPropertyOptional({ description: 'Production Date' })
    @IsOptional()
    @IsDateString()
    productionDate?: string;

    @ApiPropertyOptional({ description: 'Production Expiry Date' })
    @IsOptional()
    @IsDateString()
    productionExpiryDate?: string;

    @ApiPropertyOptional({ description: 'Place Of Receipt By Pre Carrier' })
    @IsOptional()
    @IsString()
    placeOfReceiptByPreCarrier?: string;

    @ApiPropertyOptional({ description: 'Vessel/Flight No.' })
    @IsOptional()
    @IsString()
    vesselFlightNo?: string;

    @ApiPropertyOptional({ description: 'Sales Broker' })
    @IsOptional()
    @IsBoolean()
    salesBroker?: boolean;

    @ApiPropertyOptional({ description: 'Palletised' })
    @IsOptional()
    @IsBoolean()
    palletised?: boolean;

    @ApiPropertyOptional({ description: 'Brokerage' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    brokerage?: number;

    @ApiPropertyOptional({ description: 'Brokerage Percentage' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    brokeragePercentage?: number;

    @ApiPropertyOptional({ description: 'Sold By' })
    @IsOptional()
    @IsString()
    soldBy?: string;
}
