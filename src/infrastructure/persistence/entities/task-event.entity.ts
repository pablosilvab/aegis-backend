import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { TaskEntity } from './task.entity';
  
  @Entity('task_events')
  export class TaskEventEntity {
    @PrimaryColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    taskId: string;
  
    @ManyToOne(() => TaskEntity)
    @JoinColumn({ name: 'taskId' })
    task: TaskEntity;
  
    @Column({ type: 'varchar', length: 50 })
    type: string;
  
    @Column({ type: 'text' })
    content: string;
  
    @CreateDateColumn()
    timestamp: Date;
  
    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, unknown>;
  }