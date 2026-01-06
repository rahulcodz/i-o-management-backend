import { IsOptional, IsString, IsInt, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto {
    @ApiProperty({ required: false, default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ required: false, default: 10, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiProperty({ required: false, description: 'Search by name or email' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false, description: 'Filter by role ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    roleId?: number;

    @ApiProperty({ required: false, description: 'Filter by created date from (ISO date string)' })
    @IsOptional()
    @IsDateString()
    createdFrom?: string;

    @ApiProperty({ required: false, description: 'Filter by created date to (ISO date string)' })
    @IsOptional()
    @IsDateString()
    createdTo?: string;
}
