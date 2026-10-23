import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto.js';
import { ReportsService } from './reports.service.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { User } from '../users/user.entity.js';
import { Serialize } from '../interceptors/serialize.interceptor.js';
import { ReportDto } from './dtos/report.dto.js';
import { ApproveReportDto } from './dtos/approve-report.dto.js';
import { AdminGuard } from '../guards/admin.guard.js';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
