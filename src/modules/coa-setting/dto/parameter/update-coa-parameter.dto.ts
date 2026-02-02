import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCOAParameterDto {
    @ApiPropertyOptional({ description: 'Parameter Name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Method' })
    @IsOptional()
    @IsString()
    method?: string;

    @ApiPropertyOptional({ description: 'Limit' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ description: 'Result' })
    @IsOptional()
    @IsString()
    result?: string;

    @ApiPropertyOptional({ description: 'Unit' })
    @IsOptional()
    @IsString()
    unit?: string;
}
