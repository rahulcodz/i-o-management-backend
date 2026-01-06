import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackageTypeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    packageType: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    markAsDefault?: boolean;
}
