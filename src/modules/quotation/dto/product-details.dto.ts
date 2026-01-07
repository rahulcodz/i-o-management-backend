import { IsOptional, IsInt, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductDetailsDto {
    @ApiPropertyOptional({ description: 'Product ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    productId?: number;

    @ApiPropertyOptional({ description: 'Unit ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    unitId?: number;

    @ApiPropertyOptional({ description: 'Quantity' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    quantity?: number;

    @ApiPropertyOptional({ description: 'Price' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    price?: number;

    @ApiPropertyOptional({ description: 'Total (calculated: quantity * price)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    total?: number;

    @ApiPropertyOptional({ description: 'Package' })
    @IsOptional()
    @IsString()
    package?: string;

    @ApiPropertyOptional({ description: 'Product Description' })
    @IsOptional()
    @IsString()
    productDescription?: string;

    @ApiPropertyOptional({ description: 'Net Weight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    netWeight?: number;

    @ApiPropertyOptional({ description: 'Gross Weight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    grossWeight?: number;

    @ApiPropertyOptional({ description: 'Total Packages' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    totalPackages?: number;

    @ApiPropertyOptional({ description: 'Package Type ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    packageTypeId?: number;

    @ApiPropertyOptional({ description: 'Quality Spec' })
    @IsOptional()
    @IsString()
    qualitySpec?: string;

    @ApiPropertyOptional({ description: 'Material ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    materialId?: number;

    @ApiPropertyOptional({ description: 'Marking' })
    @IsOptional()
    @IsString()
    marking?: string;

    @ApiPropertyOptional({ description: 'Marking File Path' })
    @IsOptional()
    @IsString()
    markingFile?: string;

    @ApiPropertyOptional({ description: 'Total Net Weight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    totalNetWeight?: number;

    @ApiPropertyOptional({ description: 'Total Gross Weight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    totalGrossWeight?: number;
}
