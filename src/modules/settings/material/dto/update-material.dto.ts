import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMaterialDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    materialName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;
}
