import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    currencyName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    symbol?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    words?: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;
}
