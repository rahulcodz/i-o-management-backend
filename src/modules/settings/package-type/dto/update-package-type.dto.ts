import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePackageTypeDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    packageType?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;
}
