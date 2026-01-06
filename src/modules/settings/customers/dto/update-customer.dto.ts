import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    customerName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address?: string;

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
}
