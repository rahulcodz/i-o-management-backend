import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryVendorComboDto {
    @ApiPropertyOptional({ description: 'Search vendors by name, category, GSTIN, or state' })
    @IsOptional()
    @IsString()
    search?: string;
}
