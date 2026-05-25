import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { WorkTypesService } from './work-types.service.js';

@ApiTags('work-types')
@Controller('work-types')
export class WorkTypesController {
  constructor(
    @Inject(WorkTypesService)
    private readonly workTypesService: WorkTypesService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Список видов работ' })
  findAll() {
    return this.workTypesService.findAll();
  }
}
