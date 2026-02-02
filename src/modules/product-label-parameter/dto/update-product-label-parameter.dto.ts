import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductLabelParameterDto {
    @ApiPropertyOptional({ description: 'Parameter Name' })
    @IsOptional()
    @IsString()
    parameterName?: string;

    @ApiPropertyOptional({ description: 'Default Value' })
    @IsOptional()
    @IsString()
    defaultValue?: string;
}
