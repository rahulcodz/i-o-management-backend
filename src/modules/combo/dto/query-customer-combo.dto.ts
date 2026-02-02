import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCustomerComboDto {
    @ApiProperty({ required: false, description: 'Search customers by customer name' })
    @IsOptional()
    @IsString()
    search?: string;
}
