import { IsNotEmpty, IsString, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionalAdvancedDto } from './optional-advanced.dto';

export class CreateUnitDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    unitName: string;

    @ApiProperty({ default: false })
    @IsNotEmpty()
    @IsBoolean()
    is_default: boolean;

    @ApiPropertyOptional({ description: 'Advanced fields', type: OptionalAdvancedDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => OptionalAdvancedDto)
    advanced?: OptionalAdvancedDto;
}
