import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryBLDraftDto {
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

    @ApiPropertyOptional({ description: 'Search by shipping line, booking number, or vessel number' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by Invoice ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    invoiceId?: number;

    @ApiPropertyOptional({ description: 'Filter by Consignee ID (Customer ID)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    consigneeId?: number;

    @ApiPropertyOptional({ description: 'Filter by Notify Buyer ID (Customer ID)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    notifyBuyerId?: number;

    @ApiPropertyOptional({ description: 'Filter by Notify Other Party ID (Customer ID)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    notifyOtherPartyId?: number;
}
