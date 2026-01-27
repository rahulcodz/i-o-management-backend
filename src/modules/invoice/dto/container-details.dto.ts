import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ContainerDetailsDto {
    @ApiPropertyOptional({ description: 'Container No' })
    @IsOptional()
    @IsString()
    containerNo?: string;

    @ApiPropertyOptional({ description: 'Line Seal No' })
    @IsOptional()
    @IsString()
    lineSealNo?: string;

    @ApiPropertyOptional({ description: 'RFID Seal No' })
    @IsOptional()
    @IsString()
    rfidSealNo?: string;

    @ApiPropertyOptional({ description: 'Size/Type' })
    @IsOptional()
    @IsString()
    sizeType?: string;

    @ApiPropertyOptional({ description: 'Boxes' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    boxes?: number;

    @ApiPropertyOptional({ description: 'LOT NO' })
    @IsOptional()
    @IsString()
    lotNo?: string;

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
}
