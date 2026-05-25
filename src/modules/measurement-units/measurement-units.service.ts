import { Inject, Injectable } from '@nestjs/common';

import { DatabaseService } from '../../database/database.service.js';

@Injectable()
export class MeasurementUnitsService {
  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {}

  findAll() {
    return this.databaseService.measurementUnit.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
