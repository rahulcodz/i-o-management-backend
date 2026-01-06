import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    mobile?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    roleId: number;

    @ApiProperty({ required: false, description: 'Organization ID (required for non-Super Admin users)' })
    @IsOptional()
    @IsInt()
    organizationId?: number;
}
