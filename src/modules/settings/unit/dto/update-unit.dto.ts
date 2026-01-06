import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUnitDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    orderUnit?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    default?: boolean;
}
