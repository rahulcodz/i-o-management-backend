import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryQuotationComboDto {
    @ApiProperty({ required: false, description: 'Search quotations by quotation number' })
    @IsOptional()
    @IsString()
    search?: string;
}
