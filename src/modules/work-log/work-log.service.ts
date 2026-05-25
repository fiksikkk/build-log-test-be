import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma-client/client.js';

import { DatabaseService } from '../../database/database.service.js';
import { CreateWorkLogEntryDto } from './dto/create-work-log-entry.dto.js';
import { QueryWorkLogEntriesDto } from './dto/query-work-log-entries.dto.js';
import { UpdateWorkLogEntryDto } from './dto/update-work-log-entry.dto.js';

@Injectable()
export class WorkLogService {
  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {}

  findAll(query: QueryWorkLogEntriesDto) {
    const where: Prisma.WorkLogEntryWhereInput = {};

    if (query.dateFrom || query.dateTo) {
      where.workDate = {};

      if (query.dateFrom) {
        where.workDate.gte = new Date(query.dateFrom);
      }

      if (query.dateTo) {
        where.workDate.lte = new Date(query.dateTo);
      }
    }

    return this.databaseService.workLogEntry.findMany({
      where,
      include: {
        workType: true,
        measurementUnit: true,
      },
      orderBy: {
        workDate: query.sortOrder ?? 'desc',
      },
    });
  }

  async findOne(id: number) {
    const entry = await this.databaseService.workLogEntry.findUnique({
      where: { id },
      include: {
        workType: true,
        measurementUnit: true,
      },
    });

    if (!entry) {
      throw new NotFoundException(`Work log entry with id "${id}" not found`);
    }

    return entry;
  }

  async create(dto: CreateWorkLogEntryDto) {
    await this.ensureRelatedEntities(dto.workTypeId, dto.measurementUnitId);

    return this.databaseService.workLogEntry.create({
      data: {
        workDate: new Date(dto.workDate),
        workTypeId: dto.workTypeId,
        measurementUnitId: dto.measurementUnitId,
        volume: new Prisma.Decimal(dto.volume),
        workerName: dto.workerName,
      },
      include: {
        workType: true,
        measurementUnit: true,
      },
    });
  }

  async update(id: number, dto: UpdateWorkLogEntryDto) {
    await this.findOne(id);

    if (dto.workTypeId || dto.measurementUnitId) {
      const existing = await this.databaseService.workLogEntry.findUnique({
        where: { id },
        select: {
          workTypeId: true,
          measurementUnitId: true,
        },
      });

      if (!existing) {
        throw new NotFoundException(`Work log entry with id "${id}" not found`);
      }

      await this.ensureRelatedEntities(
        dto.workTypeId ?? existing.workTypeId,
        dto.measurementUnitId ?? existing.measurementUnitId,
      );
    }

    return this.databaseService.workLogEntry.update({
      where: { id },
      data: {
        workDate: dto.workDate ? new Date(dto.workDate) : undefined,
        workTypeId: dto.workTypeId,
        measurementUnitId: dto.measurementUnitId,
        volume:
          dto.volume !== undefined ? new Prisma.Decimal(dto.volume) : undefined,
        workerName: dto.workerName,
      },
      include: {
        workType: true,
        measurementUnit: true,
      },
    });
  }

  async remove(id: number) {
    const entry = await this.findOne(id);

    await this.databaseService.workLogEntry.delete({
      where: { id },
    });

    return entry;
  }

  private async ensureRelatedEntities(
    workTypeId: number,
    measurementUnitId: number,
  ) {
    if (!Number.isInteger(workTypeId) || workTypeId <= 0) {
      throw new BadRequestException({
        message: ['workTypeId must be a positive integer'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    if (!Number.isInteger(measurementUnitId) || measurementUnitId <= 0) {
      throw new BadRequestException({
        message: ['measurementUnitId must be a positive integer'],
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    const [workType, measurementUnit] = await Promise.all([
      this.databaseService.workType.findUnique({
        where: { id: workTypeId },
        select: { id: true },
      }),
      this.databaseService.measurementUnit.findUnique({
        where: { id: measurementUnitId },
        select: { id: true },
      }),
    ]);

    if (!workType) {
      throw new BadRequestException(
        `Work type with id "${workTypeId}" does not exist`,
      );
    }

    if (!measurementUnit) {
      throw new BadRequestException(
        `Measurement unit with id "${measurementUnitId}" does not exist`,
      );
    }
  }
}
