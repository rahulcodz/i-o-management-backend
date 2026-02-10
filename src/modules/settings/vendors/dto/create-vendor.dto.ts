import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorDto {
    @ApiProperty({ description: 'Vendor category' })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ description: 'Vendor name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'GSTIN number' })
    @IsNotEmpty()
    @IsString()
    gstin: string;

    @ApiProperty({ description: 'State' })
    @IsNotEmpty()
    @IsString()
    state: string;

    @ApiPropertyOptional({ description: 'Licence number' })
    @IsOptional()
    @IsString()
    licenceNumber?: string;

    @ApiPropertyOptional({ description: 'Email address' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ description: 'Address' })
    @IsNotEmpty()
    @IsString()
    address: string;
}
