import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ShipmentModelDto {
    @ApiPropertyOptional({ description: 'Shipment Mode' })
    @IsOptional()
    @IsString()
    shipmentMode?: string;

    @ApiPropertyOptional({ description: '20 ft FCL' })
    @IsOptional()
    @IsString()
    ft20FCL?: string;

    @ApiPropertyOptional({ description: '40 ft FCL' })
    @IsOptional()
    @IsString()
    ft40FCL?: string;

    @ApiPropertyOptional({ description: '40 HC' })
    @IsOptional()
    @IsString()
    ft40HC?: string;

    @ApiPropertyOptional({ description: '20 ft LCL' })
    @IsOptional()
    @IsString()
    ft20LCL?: string;

    @ApiPropertyOptional({ description: '40 ft LCL' })
    @IsOptional()
    @IsString()
    ft40LCL?: string;

    @ApiPropertyOptional({ description: 'Dry Bulk' })
    @IsOptional()
    @IsString()
    dryBulk?: string;

    @ApiPropertyOptional({ description: 'Liquid Bulk' })
    @IsOptional()
    @IsString()
    liquidBulk?: string;

    @ApiPropertyOptional({ description: 'ISO Tank' })
    @IsOptional()
    @IsString()
    isoTank?: string;

    @ApiPropertyOptional({ description: 'Flexi Tank' })
    @IsOptional()
    @IsString()
    flexiTank?: string;

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

    @ApiPropertyOptional({ description: 'Total' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    total?: number;

    @ApiPropertyOptional({ description: 'Freight' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    freight?: number;

    @ApiPropertyOptional({ description: 'Freight Include in Total' })
    @IsOptional()
    @IsBoolean()
    freightIncludeInTotal?: boolean;

    @ApiPropertyOptional({ description: 'Insurance' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    insurance?: number;

    @ApiPropertyOptional({ description: 'Insurance Include in Total' })
    @IsOptional()
    @IsBoolean()
    insuranceIncludeInTotal?: boolean;

    @ApiPropertyOptional({ description: 'Grand Total' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    grandTotal?: number;
}
