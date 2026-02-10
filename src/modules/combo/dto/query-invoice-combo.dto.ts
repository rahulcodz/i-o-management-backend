import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryInvoiceComboDto {
    @ApiPropertyOptional({ description: 'Search invoices by PI No' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by invoice type: true for proforma invoices, false for regular invoices' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    invoice?: boolean;
}
