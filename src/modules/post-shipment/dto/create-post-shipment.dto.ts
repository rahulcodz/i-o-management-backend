import { IsNotEmpty, IsOptional, IsString, IsInt, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ListItemDto {
    @ApiPropertyOptional({ description: 'Name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Method' })
    @IsOptional()
    @IsString()
    method?: string;

    @ApiPropertyOptional({ description: 'Value' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    value?: number;

    @ApiPropertyOptional({ description: 'Result' })
    @IsOptional()
    @IsString()
    result?: string;

    @ApiPropertyOptional({ description: 'Unit ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    unitId?: number;
}

export class CreatePostShipmentDto {
    @ApiProperty({ description: 'Invoice ID' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    invoiceId: number;

    @ApiProperty({ description: 'Product ID' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    productId: number;

    @ApiPropertyOptional({ description: 'Grade' })
    @IsOptional()
    @IsString()
    grade?: string;

    @ApiPropertyOptional({ description: 'Raw Material' })
    @IsOptional()
    @IsString()
    rawMaterial?: string;

    @ApiPropertyOptional({ description: 'List of items', type: [ListItemDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ListItemDto)
    list?: ListItemDto[];
}
