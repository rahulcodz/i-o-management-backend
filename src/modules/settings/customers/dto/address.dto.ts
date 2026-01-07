import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
    @ApiProperty({ description: 'Address name' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
