import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module.js';
import { MeasurementUnitsModule } from './modules/measurement-units/measurement-units.module.js';
import { WorkLogModule } from './modules/work-log/work-log.module.js';
import { WorkTypesModule } from './modules/work-types/work-types.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    WorkTypesModule,
    MeasurementUnitsModule,
    WorkLogModule,
  ],
})
export class AppModule {}
