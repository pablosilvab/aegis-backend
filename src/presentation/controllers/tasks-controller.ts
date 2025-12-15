import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { CreateTaskUseCase } from '@application/use-cases/create-task.use-case';
  import { GetTaskByIdUseCase } from '@application/use-cases/get-task-by-id.use-case';
  import { ListTasksUseCase } from '@application/use-cases/list-tasks.use-case';
  import { UpdateTaskUseCase } from '@application/use-cases/update-task.use-case';
  import { CreateTaskDto } from '../dto/create-task.dto';
  import { UpdateTaskDto } from '../dto/update-task.dto';
  
  @Controller('tasks')
  export class TasksController {
    constructor(
      private readonly createTaskUseCase: CreateTaskUseCase,
      private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
      private readonly listTasksUseCase: ListTasksUseCase,
      private readonly updateTaskUseCase: UpdateTaskUseCase,
    ) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createTaskDto: CreateTaskDto) {
      const task = await this.createTaskUseCase.execute({
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      });
  
      return {
        id: task.getId().toString(),
        title: task.getTitle(),
        description: task.getDescription(),
        status: task.getStatus().getValue(),
        createdAt: task.getCreatedAt(),
        updatedAt: task.getUpdatedAt(),
        dueDate: task.getDueDate(),
      };
    }
  
    @Get()
    async findAll() {
      const tasks = await this.listTasksUseCase.execute();
      return tasks.map((task) => ({
        id: task.getId().toString(),
        title: task.getTitle(),
        description: task.getDescription(),
        status: task.getStatus().getValue(),
        createdAt: task.getCreatedAt(),
        updatedAt: task.getUpdatedAt(),
        dueDate: task.getDueDate(),
        isOverdue: task.isOverdue(),
      }));
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      const task = await this.getTaskByIdUseCase.execute(id);
      return {
        id: task.getId().toString(),
        title: task.getTitle(),
        description: task.getDescription(),
        status: task.getStatus().getValue(),
        createdAt: task.getCreatedAt(),
        updatedAt: task.getUpdatedAt(),
        dueDate: task.getDueDate(),
        isOverdue: task.isOverdue(),
      };
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
      const task = await this.updateTaskUseCase.execute(id, {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
        dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
      });
  
      return {
        id: task.getId().toString(),
        title: task.getTitle(),
        description: task.getDescription(),
        status: task.getStatus().getValue(),
        createdAt: task.getCreatedAt(),
        updatedAt: task.getUpdatedAt(),
        dueDate: task.getDueDate(),
      };
    }
  }