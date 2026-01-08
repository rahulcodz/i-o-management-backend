import { IsOptional, IsString, IsBoolean, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsigneeDetailsDto } from './consignee-details.dto';
import { ShipmentDetailsDto } from './shipment-details.dto';
import { ProductDetailsDto } from './product-details.dto';

export class CreateQuotationDto {
    @ApiProperty({ description: 'Quotation Number (must be unique)' })
    @IsString()
    quotationNumber: string;

    @ApiPropertyOptional({ description: 'Quotation Date' })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiProperty({ description: 'Consignee Details', type: ConsigneeDetailsDto })
    @ValidateNested()
    @Type(() => ConsigneeDetailsDto)
    consigneeDetails: ConsigneeDetailsDto;

    @ApiProperty({ description: 'Shipment Details', type: ShipmentDetailsDto })
    @ValidateNested()
    @Type(() => ShipmentDetailsDto)
    shipmentDetails: ShipmentDetailsDto;

    @ApiPropertyOptional({ description: 'Sales Broker', default: false })
    @IsOptional()
    @IsBoolean()
    salesBroker?: boolean;

    @ApiPropertyOptional({ description: 'Remark' })
    @IsOptional()
    @IsString()
    remark?: string;

    @ApiProperty({ description: 'Product Details Array', type: [ProductDetailsDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailsDto)
    productDetails: ProductDetailsDto[];
}
