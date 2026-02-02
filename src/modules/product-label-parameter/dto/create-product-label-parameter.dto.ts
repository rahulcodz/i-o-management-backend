import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductLabelParameterDto {
    @ApiProperty({ description: 'Parameter Name' })
    @IsNotEmpty()
    @IsString()
    parameterName: string;

    @ApiPropertyOptional({ description: 'Default Value' })
    @IsOptional()
    @IsString()
    defaultValue?: string;
}
