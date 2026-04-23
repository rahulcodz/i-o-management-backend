import { IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionalAdvancedDto } from './optional-advanced.dto';

export class UpdateUnitDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    unitName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_default?: boolean;

    @ApiPropertyOptional({ description: 'Advanced fields', type: OptionalAdvancedDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => OptionalAdvancedDto)
    advanced?: OptionalAdvancedDto;
}
