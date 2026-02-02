import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GroupItemDto {
    @ApiPropertyOptional({ description: 'Group Name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Method' })
    @IsOptional()
    @IsString()
    method?: string;

    @ApiPropertyOptional({ description: 'Result' })
    @IsOptional()
    @IsString()
    result?: string;
}
