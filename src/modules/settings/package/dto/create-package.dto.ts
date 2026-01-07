import { IsNotEmpty, IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackageDto {
    @ApiProperty({ description: 'Package name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'HSN/SAC code' })
    @IsNotEmpty()
    @IsString()
    hsnSac: string;

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
