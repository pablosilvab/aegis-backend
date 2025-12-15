import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { TaskEntity } from './task.entity';
  
  @Entity('task_analyses')
  export class TaskAnalysisEntity {
    @PrimaryColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    taskId: string;
  
    @ManyToOne(() => TaskEntity)
    @JoinColumn({ name: 'taskId' })
    task: TaskEntity;
  
    @Column({ type: 'varchar', length: 50 })
    status: string;
  
    @Column({ type: 'integer' })
    confidenceLevel: number;
  
    @Column({ type: 'text' })
    reason: string;
  
    @Column({ type: 'text' })
    recommendation: string;
  
    @CreateDateColumn()
    timestamp: Date;
  
    @Column({ type: 'text', nullable: true })
    rawResponse?: string;
  }