import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    materialName: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;
}
