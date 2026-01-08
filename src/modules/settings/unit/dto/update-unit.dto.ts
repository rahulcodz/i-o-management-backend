import { IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionalAdvancedDto } from './optional-advanced.dto';

export class UpdateUnitDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    orderUnit?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    default?: boolean;

    @ApiPropertyOptional({ description: 'Advanced fields', type: OptionalAdvancedDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => OptionalAdvancedDto)
    advanced?: OptionalAdvancedDto;
}
