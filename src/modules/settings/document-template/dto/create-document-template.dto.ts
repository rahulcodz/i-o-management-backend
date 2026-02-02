import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentTemplateDto {
    @ApiProperty({ description: 'Document Name' })
    @IsNotEmpty()
    @IsString()
    documentName: string;

    @ApiProperty({ description: 'Document Content' })
    @IsNotEmpty()
    @IsString()
    documentContent: string;

    @ApiProperty({ description: 'User ID' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    userId: number;
}
