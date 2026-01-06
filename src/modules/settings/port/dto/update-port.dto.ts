import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePortDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    portName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    portCode?: string;
}
