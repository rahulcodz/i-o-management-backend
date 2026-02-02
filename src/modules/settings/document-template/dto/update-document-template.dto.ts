import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDocumentTemplateDto {
    @ApiPropertyOptional({ description: 'Document Name' })
    @IsOptional()
    @IsString()
    documentName?: string;

    @ApiPropertyOptional({ description: 'Document Content' })
    @IsOptional()
    @IsString()
    documentContent?: string;

    @ApiPropertyOptional({ description: 'User ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    userId?: number;
}
