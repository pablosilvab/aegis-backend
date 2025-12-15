import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { RegisterTaskEventUseCase } from '@application/use-cases/register-task-event.use-case';
  import { GetTaskEventsUseCase } from '@application/use-cases/get-task-events.use-case';
  import { RegisterTaskEventDto } from '../dto/register-task-event.dto';
  
  @Controller('tasks/:taskId/events')
  export class TaskEventsController {
    constructor(
      private readonly registerTaskEventUseCase: RegisterTaskEventUseCase,
      private readonly getTaskEventsUseCase: GetTaskEventsUseCase,
    ) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Param('taskId') taskId: string,
      @Body() registerTaskEventDto: RegisterTaskEventDto,
    ) {
      const event = await this.registerTaskEventUseCase.execute({
        taskId,
        type: registerTaskEventDto.type,
        content: registerTaskEventDto.content,
        metadata: registerTaskEventDto.metadata,
      });
  
      return {
        id: event.getId(),
        taskId: event.getTaskId().toString(),
        type: event.getType().getValue(),
        content: event.getContent(),
        timestamp: event.getTimestamp(),
        metadata: event.getMetadata(),
      };
    }
  
    @Get()
    async findAll(@Param('taskId') taskId: string) {
      const events = await this.getTaskEventsUseCase.execute(taskId);
      return events.map((event) => ({
        id: event.getId(),
        taskId: event.getTaskId().toString(),
        type: event.getType().getValue(),
        content: event.getContent(),
        timestamp: event.getTimestamp(),
        metadata: event.getMetadata(),
      }));
    }
  }