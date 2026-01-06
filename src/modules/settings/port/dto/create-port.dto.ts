import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    portName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    portCode?: string;
}
