import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryProductComboDto {
    @ApiProperty({ required: false, description: 'Search products by name' })
    @IsOptional()
    @IsString()
    search?: string;
}
