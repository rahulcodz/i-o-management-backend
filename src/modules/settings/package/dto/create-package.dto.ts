import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackageDto {
    @ApiProperty({ description: 'Unit ID' })
    @IsNotEmpty()
    @IsInt()
    unitId: number;

    @ApiProperty({ description: 'Net weight' })
    @IsNotEmpty()
    @IsNumber()
    netWeight: number;

    @ApiProperty({ description: 'Gross weight' })
    @IsNotEmpty()
    @IsNumber()
    grossWeight: number;
}
