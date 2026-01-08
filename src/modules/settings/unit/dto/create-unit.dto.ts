import { IsNotEmpty, IsString, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionalAdvancedDto } from './optional-advanced.dto';

export class CreateUnitDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    orderUnit: string;

    @ApiProperty({ default: false })
    @IsNotEmpty()
    @IsBoolean()
    default: boolean;

    @ApiPropertyOptional({ description: 'Advanced fields', type: OptionalAdvancedDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => OptionalAdvancedDto)
    advanced?: OptionalAdvancedDto;
}
