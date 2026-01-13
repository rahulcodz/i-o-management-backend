import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInternationalInvoiceConfigurationDto {
    @ApiProperty({ required: false, description: 'PIN Code' })
    @IsOptional()
    @IsString()
    pinCode?: string;

    @ApiProperty({ required: false, description: 'Declaration Export' })
    @IsOptional()
    @IsString()
    declarationExport?: string;

    @ApiProperty({ required: false, description: 'Declaration Domestic' })
    @IsOptional()
    @IsString()
    declarationDomestic?: string;

    @ApiProperty({ required: false, description: 'Invoice Series Setting Based On' })
    @IsOptional()
    @IsString()
    invoiceSeriesSettingBasedOn?: string;

    @ApiProperty({ required: false, description: 'PI Series Setting Based On' })
    @IsOptional()
    @IsString()
    piSeriesSettingBasedOn?: string;

    @ApiProperty({ required: false, description: 'Invoice Prefix' })
    @IsOptional()
    @IsString()
    invoicePrefix?: string;

    @ApiProperty({ required: false, description: 'Invoice Start From' })
    @IsOptional()
    @IsInt()
    @Min(0)
    invoiceStartFrom?: number;

    @ApiProperty({ required: false, description: 'Invoice Suffix' })
    @IsOptional()
    @IsString()
    invoiceSuffix?: string;

    @ApiProperty({ required: false, description: 'PI Prefix' })
    @IsOptional()
    @IsString()
    piPrefix?: string;

    @ApiProperty({ required: false, description: 'PI Start From' })
    @IsOptional()
    @IsInt()
    @Min(0)
    piStartFrom?: number;

    @ApiProperty({ required: false, description: 'PI Suffix' })
    @IsOptional()
    @IsString()
    piSuffix?: string;

    @ApiProperty({ required: false, description: 'Quotation Prefix' })
    @IsOptional()
    @IsString()
    quotationPrefix?: string;

    @ApiProperty({ required: false, description: 'Quotation Start From' })
    @IsOptional()
    @IsInt()
    @Min(0)
    quotationStartFrom?: number;

    @ApiProperty({ required: false, description: 'Quotation Suffix' })
    @IsOptional()
    @IsString()
    quotationSuffix?: string;

    @ApiProperty({ required: false, description: 'P.O. Prefix' })
    @IsOptional()
    @IsString()
    poPrefix?: string;

    @ApiProperty({ required: false, description: 'P.O. Start From' })
    @IsOptional()
    @IsInt()
    @Min(0)
    poStartFrom?: number;

    @ApiProperty({ required: false, description: 'P.O. Suffix' })
    @IsOptional()
    @IsString()
    poSuffix?: string;

    @ApiProperty({ required: false, description: 'Service P.O. Prefix' })
    @IsOptional()
    @IsString()
    servicePoPrefix?: string;

    @ApiProperty({ required: false, description: 'Service P.O. Start From' })
    @IsOptional()
    @IsInt()
    @Min(0)
    servicePoStartFrom?: number;

    @ApiProperty({ required: false, description: 'Service P.O. Suffix' })
    @IsOptional()
    @IsString()
    servicePoSuffix?: string;

    @ApiProperty({ required: false, description: 'PI/Invoice No. Editing' })
    @IsOptional()
    @IsBoolean()
    piInvoiceNoEditing?: boolean;
}
