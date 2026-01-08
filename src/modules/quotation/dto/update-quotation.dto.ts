import { IsOptional, IsString, IsBoolean, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ConsigneeDetailsDto } from './consignee-details.dto';
import { ShipmentDetailsDto } from './shipment-details.dto';
import { ProductDetailsDto } from './product-details.dto';

export class UpdateQuotationDto {
    @ApiPropertyOptional({ description: 'Quotation Number (must be unique)' })
    @IsOptional()
    @IsString()
    quotationNumber?: string;

    @ApiPropertyOptional({ description: 'Quotation Date' })
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

    @ApiPropertyOptional({ description: 'Sales Broker' })
    @IsOptional()
    @IsBoolean()
    salesBroker?: boolean;

    @ApiPropertyOptional({ description: 'Remark' })
    @IsOptional()
    @IsString()
    remark?: string;

    @ApiPropertyOptional({ description: 'Product Details Array', type: [ProductDetailsDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailsDto)
    productDetails?: ProductDetailsDto[];
}
