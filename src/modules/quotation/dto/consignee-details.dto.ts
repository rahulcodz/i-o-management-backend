import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConsigneeDetailsDto {
    @ApiPropertyOptional({ description: 'Buyer Order Number' })
    @IsOptional()
    @IsString()
    buyerOrderNo?: string;

    @ApiPropertyOptional({ description: 'Order Date' })
    @IsOptional()
    @IsDateString()
    orderDate?: string;

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

    @ApiPropertyOptional({ description: 'Notify Party / Buyer Customer ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    notifyPartyId?: number;

    @ApiPropertyOptional({ description: 'Other Notify Party Customer ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    otherNotifyPartyId?: number;

    @ApiProperty({ description: 'Country' })
    @IsString()
    country: string;

    @ApiPropertyOptional({ description: 'Port ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    portId?: number;
}
