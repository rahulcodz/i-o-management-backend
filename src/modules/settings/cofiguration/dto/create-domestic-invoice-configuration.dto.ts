import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDomesticInvoiceConfigurationDto {
    @ApiProperty({ required: false, description: 'Domestic Invoice Prefix' })
    @IsOptional()
    @IsString()
    domesticInvoicePrefix?: string;

    @ApiProperty({ required: false, description: 'Domestic Invoice Start From', default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    domesticInvoiceStartFrom?: number;

    @ApiProperty({ required: false, description: 'Domestic Invoice Suffix' })
    @IsOptional()
    @IsString()
    domesticInvoiceSuffix?: string;

    @ApiProperty({ required: false, description: 'Domestic PI Prefix' })
    @IsOptional()
    @IsString()
    domesticPiPrefix?: string;

    @ApiProperty({ required: false, description: 'Domestic PI Start From', default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    domesticPiStartFrom?: number;

    @ApiProperty({ required: false, description: 'Domestic PI Suffix' })
    @IsOptional()
    @IsString()
    domesticPiSuffix?: string;
}
