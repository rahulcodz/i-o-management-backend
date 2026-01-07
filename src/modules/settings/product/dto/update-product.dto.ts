import { IsOptional, IsString, IsNumber, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductVariantDto, ProductSchemeDto } from './create-product.dto';

export class UpdateProductDto {
    // Product Detail fields
    @ApiPropertyOptional({ description: 'Product name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'GST percentage as string' })
    @IsOptional()
    @IsString()
    gst?: string;

    @ApiPropertyOptional({ description: 'Product description (rich text)' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'HSN/SAC code' })
    @IsOptional()
    @IsString()
    hsnSac?: string;

    @ApiPropertyOptional({ description: 'Product image file path or URL' })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({ description: 'Inventory type' })
    @IsOptional()
    @IsString()
    inventoryType?: string;

    @ApiPropertyOptional({ description: 'Product variants', type: [ProductVariantDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    variants?: ProductVariantDto[];

    // Advanced fields
    @ApiPropertyOptional({ description: 'Product tag for differentiation' })
    @IsOptional()
    @IsString()
    productTag?: string;

    @ApiPropertyOptional({ description: 'Unit ID' })
    @IsOptional()
    @IsInt()
    unitId?: number;

    @ApiPropertyOptional({ description: 'Net weight in KG' })
    @IsOptional()
    @IsNumber()
    netWeight?: number;

    @ApiPropertyOptional({ description: 'Gross weight in KG' })
    @IsOptional()
    @IsNumber()
    grossWeight?: number;

    @ApiPropertyOptional({ description: 'Dimension length in meters' })
    @IsOptional()
    @IsNumber()
    dimensionLength?: number;

    @ApiPropertyOptional({ description: 'Dimension width in meters' })
    @IsOptional()
    @IsNumber()
    dimensionWidth?: number;

    @ApiPropertyOptional({ description: 'Dimension height in meters' })
    @IsOptional()
    @IsNumber()
    dimensionHeight?: number;

    @ApiPropertyOptional({ description: 'Sell price in INR' })
    @IsOptional()
    @IsNumber()
    sellPrice?: number;

    // Scheme Details
    @ApiPropertyOptional({ description: 'Product schemes', type: [ProductSchemeDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductSchemeDto)
    schemes?: ProductSchemeDto[];
}
