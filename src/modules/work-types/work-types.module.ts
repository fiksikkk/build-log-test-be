import { Module } from '@nestjs/common';

import { WorkTypesController } from './work-types.controller.js';
import { WorkTypesService } from './work-types.service.js';

@Module({
  controllers: [WorkTypesController],
  providers: [WorkTypesService],
})
export class WorkTypesModule {}
