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
  import { DeleteTaskUseCase } from '@application/use-cases/delete-task.use-case';
  import { CreateTaskDto } from '../dto/create-task.dto';
  import { UpdateTaskDto } from '../dto/update-task.dto';
  import { CurrentUser } from '../../auth/decorators/current-user.decorator';
  
  @Controller('tasks')
  export class TasksController {
    constructor(
      private readonly createTaskUseCase: CreateTaskUseCase,
      private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
      private readonly listTasksUseCase: ListTasksUseCase,
      private readonly updateTaskUseCase: UpdateTaskUseCase,
      private readonly deleteTaskUseCase: DeleteTaskUseCase,
    ) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Body() createTaskDto: CreateTaskDto,
      @CurrentUser() user: { userId: string; email: string },
    ) {
      const task = await this.createTaskUseCase.execute({
        userId: user.userId,
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
    async findAll(@CurrentUser() user: { userId: string; email: string }) {
      const tasks = await this.listTasksUseCase.execute(user.userId);
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
    async findOne(
      @Param('id') id: string,
      @CurrentUser() user: { userId: string; email: string },
    ) {
      const task = await this.getTaskByIdUseCase.execute(id, user.userId);
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
    async update(
      @Param('id') id: string,
      @Body() updateTaskDto: UpdateTaskDto,
      @CurrentUser() user: { userId: string; email: string },
    ) {
      const task = await this.updateTaskUseCase.execute(id, user.userId, {
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

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
      @Param('id') id: string,
      @CurrentUser() user: { userId: string; email: string },
    ) {
      await this.deleteTaskUseCase.execute(id, user.userId);
    }
  }