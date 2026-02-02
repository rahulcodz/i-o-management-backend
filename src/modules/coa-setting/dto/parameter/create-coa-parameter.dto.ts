import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCOAParameterDto {
    @ApiProperty({ description: 'Parameter Name' })
    @IsNotEmpty()
    @IsString()
    name: string;

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
