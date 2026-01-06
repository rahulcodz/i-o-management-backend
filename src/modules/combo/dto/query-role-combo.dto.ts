import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryRoleComboDto {
    @ApiProperty({ required: false, description: 'Search roles by name' })
    @IsOptional()
    @IsString()
    search?: string;
}
