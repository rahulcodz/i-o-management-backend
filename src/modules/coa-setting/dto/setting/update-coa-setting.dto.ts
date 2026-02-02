import { IsOptional, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GroupItemDto } from './group-item.dto';

export class UpdateCOASettingDto {
    @ApiPropertyOptional({ description: 'Product ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    productId?: number;

    @ApiPropertyOptional({ description: 'Group Array', type: [GroupItemDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GroupItemDto)
    group?: GroupItemDto[];
}
