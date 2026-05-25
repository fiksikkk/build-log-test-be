import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateWorkLogEntryDto } from './dto/create-work-log-entry.dto.js';
import { QueryWorkLogEntriesDto } from './dto/query-work-log-entries.dto.js';
import { UpdateWorkLogEntryDto } from './dto/update-work-log-entry.dto.js';
import { WorkLogService } from './work-log.service.js';

@ApiTags('work-log-entries')
@Controller('work-log-entries')
export class WorkLogController {
  constructor(
    @Inject(WorkLogService)
    private readonly workLogService: WorkLogService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Список записей журнала работ' })
  findAll(@Query() query: QueryWorkLogEntriesDto) {
    return this.workLogService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Одна запись журнала работ' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workLogService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Запись журнала создана' })
  create(@Body() dto: CreateWorkLogEntryDto) {
    return this.workLogService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Запись журнала обновлена' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkLogEntryDto,
  ) {
    return this.workLogService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Удаленная запись журнала работ' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workLogService.remove(id);
  }
}
