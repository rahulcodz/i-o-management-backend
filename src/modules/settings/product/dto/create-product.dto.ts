import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Variant DTO
export class ProductVariantDto {
    @ApiPropertyOptional({ description: 'Variant name' })
    @IsOptional()
    @IsString()
    variantName?: string;

    @ApiPropertyOptional({ description: 'Variant image file path or URL' })
    @IsOptional()
    @IsString()
    variantImage?: string;
}

// Scheme Detail DTO
export class ProductSchemeDto {
    @ApiPropertyOptional({ description: 'Scheme name (e.g., Drawback, RoDTEP, RoSCTL)' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Unit ID for the scheme (references Unit model)' })
    @IsOptional()
    @IsInt()
    unitId?: number;

    @ApiPropertyOptional({ description: 'Percentage value', default: 0 })
    @IsOptional()
    @IsNumber()
    percentageValue?: number;

    @ApiPropertyOptional({ description: 'Percentage unit (e.g., %, ₹)' })
    @IsOptional()
    @IsString()
    percentageUnit?: string;

    @ApiPropertyOptional({ description: 'Cap value', default: 0 })
    @IsOptional()
    @IsNumber()
    capValue?: number;

    @ApiPropertyOptional({ description: 'Cap unit' })
    @IsOptional()
    @IsString()
    capUnit?: string;
}

export class CreateProductDto {
    // Product Detail fields
    @ApiProperty({ description: 'Product name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'GST percentage as string', default: '0' })
    @IsOptional()
    @IsString()
    gst?: string;

    @ApiPropertyOptional({ description: 'Product description (rich text)' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'HSN/SAC code' })
    @IsNotEmpty()
    @IsString()
    hsnSac: string;

    @ApiPropertyOptional({ description: 'Product image file path or URL' })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({ description: 'Inventory type', default: 'Finished Goods' })
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

    @ApiProperty({ description: 'Unit ID' })
    @IsNotEmpty()
    @IsInt()
    unitId: number;

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
