import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShipmentTermDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    term: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;
}
