import { IsOptional, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePackageDto {
    @ApiProperty({ required: false, description: 'Unit ID' })
    @IsOptional()
    @IsInt()
    unitId?: number;

    @ApiProperty({ required: false, description: 'Net weight' })
    @IsOptional()
    @IsNumber()
    netWeight?: number;

    @ApiProperty({ required: false, description: 'Gross weight' })
    @IsOptional()
    @IsNumber()
    grossWeight?: number;
}
