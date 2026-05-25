import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MeasurementUnitsService } from './measurement-units.service.js';

@ApiTags('measurement-units')
@Controller('measurement-units')
export class MeasurementUnitsController {
  constructor(
    @Inject(MeasurementUnitsService)
    private readonly measurementUnitsService: MeasurementUnitsService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Список единиц измерения' })
  findAll() {
    return this.measurementUnitsService.findAll();
  }
}
