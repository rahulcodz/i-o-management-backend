import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryOrganizationComboDto {
    @ApiProperty({ required: false, description: 'Search organizations by name' })
    @IsOptional()
    @IsString()
    search?: string;
}
