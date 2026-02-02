import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBLDraftDto {
    @ApiPropertyOptional({ description: 'Invoice ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    invoiceId?: number;

    @ApiPropertyOptional({ description: 'Invoice Date' })
    @IsOptional()
    @IsDateString()
    invoiceDate?: string;

    @ApiPropertyOptional({ description: 'Shipping Line' })
    @IsOptional()
    @IsString()
    shippingLine?: string;

    @ApiPropertyOptional({ description: 'Booking Number' })
    @IsOptional()
    @IsString()
    bookingNumber?: string;

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

    @ApiPropertyOptional({ description: 'Consignee ID (Customer ID)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    consigneeId?: number;

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

    @ApiPropertyOptional({ description: 'Other Detail' })
    @IsOptional()
    @IsString()
    otherDetail?: string;
}
