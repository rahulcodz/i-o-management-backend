import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrencyDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    currencyName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    symbol?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    words?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;
}
