import { IsNotEmpty, IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePreShipmentDto {
    @ApiProperty({ description: 'Invoice ID' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    invoiceId: number;

    @ApiProperty({ description: 'Document Template ID' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    documentTemplateId: number;

    @ApiProperty({ description: 'Number of Containers' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    numberOfContainer: number;

    @ApiProperty({ description: 'Product ID' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    productId: number;

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
