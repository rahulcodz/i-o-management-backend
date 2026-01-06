import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentTermDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    term?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;
}
