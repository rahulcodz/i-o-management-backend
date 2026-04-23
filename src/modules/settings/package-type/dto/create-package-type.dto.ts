import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePackageTypeDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    unitName: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    is_default?: boolean;
}
