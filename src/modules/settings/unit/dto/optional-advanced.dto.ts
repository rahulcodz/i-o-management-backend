import { IsString, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OptionalAdvancedDto {
    @ApiPropertyOptional({ description: 'Packaging Unit' })
    @IsOptional()
    @IsString()
    packagingUnit?: string;

    @ApiPropertyOptional({ description: 'Weight' })
    @IsOptional()
    @IsNumber()
    weight?: number;

    @ApiPropertyOptional({ description: 'Note' })
    @IsOptional()
    @IsString()
    note?: string;
}

export class OptionalDto {
    @ApiPropertyOptional({ description: 'Advanced options', type: OptionalAdvancedDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => OptionalAdvancedDto)
    advanced?: OptionalAdvancedDto;
}
