import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ConsigneeDetailsDto {
    @ApiPropertyOptional({ description: 'Consignee Customer ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    consigneeId?: number;

    @ApiPropertyOptional({ description: 'Consignee Address ID (from customer addresses)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    consigneeAddressId?: number;

    @ApiPropertyOptional({ description: 'Country' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ description: 'Final Destination Port ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    finalDestinationPortId?: number;
}
