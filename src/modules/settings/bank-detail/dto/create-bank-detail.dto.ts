import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankDetailDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bankName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    accountNo: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    swiftCode: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otherDetails?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    ifscCode: string;

    @ApiProperty({ required: false, default: 'N' })
    @IsOptional()
    @IsString()
    isVostroPayment?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    beneficiaryName: string;

    @ApiProperty({ required: false, default: 'CURRENT ACCOUNT' })
    @IsOptional()
    @IsString()
    accountType?: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    adCode: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    vostroType?: string;
}
