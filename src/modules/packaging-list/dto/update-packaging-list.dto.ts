import { IsOptional, IsString, IsInt, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class CartonInfoDto {
    @ApiPropertyOptional({ description: 'From carton number' })
    @IsOptional()
    @IsString()
    from?: string;

    @ApiPropertyOptional({ description: 'To carton number' })
    @IsOptional()
    @IsString()
    to?: string;

    @ApiPropertyOptional({ description: 'Length' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    length?: number;

    @ApiPropertyOptional({ description: 'Breadth' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    breadth?: number;

    @ApiPropertyOptional({ description: 'Height' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    height?: number;

    @ApiPropertyOptional({ description: 'Gross Weight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    grossWeight?: number;
}

class GroupDto {
    @ApiPropertyOptional({ description: 'Batch Number' })
    @IsOptional()
    @IsString()
    batchNumber?: string;

    @ApiPropertyOptional({ description: 'Product ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    productId?: number;

    @ApiPropertyOptional({ description: 'Quantity in each carton' })
    @IsOptional()
    @IsString()
    qtyInEachCarton?: string;

    @ApiPropertyOptional({ description: 'Number of packen in each carton' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    numberOfPackenInEachCarton?: number;

    @ApiPropertyOptional({ description: 'From box number' })
    @IsOptional()
    @IsString()
    fromBox?: string;

    @ApiPropertyOptional({ description: 'To box number' })
    @IsOptional()
    @IsString()
    toBox?: string;

    @ApiPropertyOptional({ description: 'From carton number' })
    @IsOptional()
    @IsString()
    fromCarton?: string;

    @ApiPropertyOptional({ description: 'To carton number' })
    @IsOptional()
    @IsString()
    toCarton?: string;

    @ApiPropertyOptional({ description: 'Packed quantity' })
    @IsOptional()
    @IsString()
    packedQty?: string;

    @ApiPropertyOptional({ description: 'Sub packet size' })
    @IsOptional()
    @IsString()
    subPacketSize?: string;

    @ApiPropertyOptional({ description: 'Remark' })
    @IsOptional()
    @IsString()
    remark?: string;

    @ApiPropertyOptional({ description: 'Package Type ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    packageTypeId?: number;
}

export class UpdatePackagingListDto {
    @ApiPropertyOptional({ description: 'Invoice ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    invoiceId?: number;

    @ApiPropertyOptional({ description: 'Carton Count' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    cartonCount?: number;

    @ApiPropertyOptional({ description: 'Carton Info', type: [CartonInfoDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartonInfoDto)
    cartonInfo?: CartonInfoDto[];

    @ApiPropertyOptional({ description: 'Group information', type: [GroupDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GroupDto)
    group?: GroupDto[];

    @ApiPropertyOptional({ description: 'Is Wooden Box' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isWoodenbox?: boolean;
}
