import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPreShipmentDto {
    @ApiPropertyOptional({ description: 'Page number (default: 1)', default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page (default: 10)', default: 10, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Search by description or country of origin' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by Invoice ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    invoiceId?: number;

    @ApiPropertyOptional({ description: 'Filter by Document Template ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    documentTemplateId?: number;

    @ApiPropertyOptional({ description: 'Filter by Product ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    productId?: number;

    @ApiPropertyOptional({ description: 'Filter by Vendor ID (User ID)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    vendorId?: number;
}
