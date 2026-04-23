import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePackageTypeDto {
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
}
