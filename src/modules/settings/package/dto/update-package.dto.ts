import { IsOptional, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePackageDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    unitId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    netWeight?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    grossWeight?: number;
}
