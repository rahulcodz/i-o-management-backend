import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserComboDto {
    @ApiProperty({ required: false, description: 'Search users by name' })
    @IsOptional()
    @IsString()
    search?: string;
}
