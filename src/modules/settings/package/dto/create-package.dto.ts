import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    unitId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    netWeight: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    grossWeight: number;
}
