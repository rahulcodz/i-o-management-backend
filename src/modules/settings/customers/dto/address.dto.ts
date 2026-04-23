import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
    @ApiPropertyOptional({ description: 'Unique address id (auto-generated if omitted)' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({ description: 'Address name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Mark this address as default', default: false })
    @IsOptional()
    @IsBoolean()
    markDefault?: boolean;
}
