import { IsOptional, IsString, IsInt, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryInvoiceDto {
    @ApiPropertyOptional({ description: 'Page number (default: 1)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page (default: 10)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit?: number;

    @ApiPropertyOptional({ description: 'Search by PI No' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by Quotation ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    quotationId?: number;

    @ApiPropertyOptional({ description: 'Filter by Sales Broker' })
    @IsOptional()
    @Type(() => Boolean)
    salesBroker?: boolean;

    @ApiPropertyOptional({ description: 'Filter by Is Proforma Invoice' })
    @IsOptional()
    @Type(() => Boolean)
    isProformaInvoice?: boolean;

    @ApiPropertyOptional({ description: 'Filter by date from' })
    @IsOptional()
    @IsDateString()
    dateFrom?: string;

    @ApiPropertyOptional({ description: 'Filter by date to' })
    @IsOptional()
    @IsDateString()
    dateTo?: string;
}
