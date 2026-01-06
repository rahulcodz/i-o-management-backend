import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ComboService } from './combo.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Combo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('combo')
export class ComboController {
    constructor(private readonly comboService: ComboService) { }

    @Get('users')
    @ApiOperation({ summary: 'Get users combo - returns users in same organization with role name and id' })
    getUsersCombo(@Request() req) {
        return this.comboService.getUsersCombo(req.user);
    }
}
