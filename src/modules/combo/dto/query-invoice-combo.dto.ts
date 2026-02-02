import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryInvoiceComboDto {
    @ApiProperty({ required: false, description: 'Search invoices by PI No' })
    @IsOptional()
    @IsString()
    search?: string;
}
