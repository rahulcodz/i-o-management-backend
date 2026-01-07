import { IsOptional, IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePackageDto {
    @ApiProperty({ required: false, description: 'Package name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, description: 'HSN/SAC code' })
    @IsOptional()
    @IsString()
    hsnSac?: string;

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
