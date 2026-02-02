import { IsNotEmpty, IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBLDraftDto {
    @ApiProperty({ description: 'Invoice ID' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    invoiceId: number;

    @ApiProperty({ description: 'Invoice Date' })
    @IsNotEmpty()
    @IsDateString()
    invoiceDate: string;

    @ApiProperty({ description: 'Shipping Line' })
    @IsNotEmpty()
    @IsString()
    shippingLine: string;

    @ApiProperty({ description: 'Booking Number' })
    @IsNotEmpty()
    @IsString()
    bookingNumber: string;

    @ApiPropertyOptional({ description: 'BL Type' })
    @IsOptional()
    @IsString()
    blType?: string;

    @ApiPropertyOptional({ description: 'Vessel Number' })
    @IsOptional()
    @IsString()
    vesselNumber?: string;

    @ApiPropertyOptional({ description: 'Freight' })
    @IsOptional()
    @IsString()
    freight?: string;

    @ApiProperty({ description: 'Consignee ID (Customer ID)' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    consigneeId: number;

    @ApiPropertyOptional({ description: 'Notify Buyer ID (Customer ID)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    notifyBuyerId?: number;

    @ApiPropertyOptional({ description: 'Notify Other Party ID (Customer ID)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    notifyOtherPartyId?: number;

    @ApiProperty({ description: 'Other Detail' })
    @IsNotEmpty()
    @IsString()
    otherDetail: string;
}
