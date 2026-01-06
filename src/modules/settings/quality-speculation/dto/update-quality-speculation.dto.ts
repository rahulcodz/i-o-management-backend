import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQualitySpeculationDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, description: 'Rich text specification content (HTML supported)' })
    @IsOptional()
    @IsString()
    specification?: string;
}
