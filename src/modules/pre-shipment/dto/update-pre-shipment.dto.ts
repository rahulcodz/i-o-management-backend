import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreShipmentDto {
    @ApiPropertyOptional({ description: 'Invoice ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    invoiceId?: number;

    @ApiPropertyOptional({ description: 'Document Template ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    documentTemplateId?: number;

    @ApiPropertyOptional({ description: 'Number of Containers' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    numberOfContainer?: number;

    @ApiPropertyOptional({ description: 'Product ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    productId?: number;

    @ApiPropertyOptional({ description: 'Vendor ID (User ID)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    vendorId?: number;

    @ApiPropertyOptional({ description: 'Gross Weight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    grossWeight?: number;

    @ApiPropertyOptional({ description: 'Net Weight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    netWeight?: number;

    @ApiPropertyOptional({ description: 'Tare Weight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    tareWeight?: number;

    @ApiPropertyOptional({ description: 'Country of Origin' })
    @IsOptional()
    @IsString()
    countryOfOrigin?: string;

    @ApiPropertyOptional({ description: 'Storage' })
    @IsOptional()
    @IsString()
    storage?: string;

    @ApiPropertyOptional({ description: 'Description' })
    @IsOptional()
    @IsString()
    description?: string;
}
