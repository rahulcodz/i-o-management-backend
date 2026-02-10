import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVendorDto {
    @ApiPropertyOptional({ description: 'Vendor category' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Vendor name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'GSTIN number' })
    @IsOptional()
    @IsString()
    gstin?: string;

    @ApiPropertyOptional({ description: 'State' })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional({ description: 'Licence number' })
    @IsOptional()
    @IsString()
    licenceNumber?: string;

    @ApiPropertyOptional({ description: 'Email address' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'Address' })
    @IsOptional()
    @IsString()
    address?: string;
}
