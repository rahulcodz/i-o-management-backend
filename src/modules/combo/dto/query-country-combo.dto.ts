import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCountryComboDto {
    @ApiProperty({ required: false, description: 'Search countries by name or ID' })
    @IsOptional()
    @IsString()
    search?: string;
}
