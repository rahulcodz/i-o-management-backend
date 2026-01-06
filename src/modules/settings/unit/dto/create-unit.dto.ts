import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    orderUnit: string;

    @ApiProperty({ default: false })
    @IsNotEmpty()
    @IsBoolean()
    default: boolean;
}
