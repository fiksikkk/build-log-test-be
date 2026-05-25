import { Inject, Injectable } from '@nestjs/common';

import { DatabaseService } from '../../database/database.service.js';

@Injectable()
export class WorkTypesService {
  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {}

  findAll() {
    return this.databaseService.workType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
