import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity.js';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto.js';
import { User } from '../users/user.entity.js';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);

    // Adds Relattion<User>
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    if (!report) {
      throw new NotFoundException('Report not found!');
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
