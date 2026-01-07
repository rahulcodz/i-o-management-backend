import { IsNotEmpty, IsOptional, IsString, IsEmail, IsInt, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressDto } from './address.dto';

export class CreateCustomerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    customerName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiProperty({ description: 'Array of customer addresses', type: [AddressDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    addresses?: AddressDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    bankName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    beneficiaryName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    accountNo?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    accountType?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    other?: string;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    swiftcode?: string;
}
