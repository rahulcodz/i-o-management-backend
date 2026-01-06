import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQualitySpeculationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Rich text specification content (HTML supported)' })
    @IsNotEmpty()
    @IsString()
    specification: string;
}
