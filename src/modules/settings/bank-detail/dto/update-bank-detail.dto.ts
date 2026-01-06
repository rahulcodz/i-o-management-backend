import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBankDetailDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    bankName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    accountNo?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    swiftCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otherDetails?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    ifscCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    isVostroPayment?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    beneficiaryName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    accountType?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    adCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    vostroType?: string;
}
