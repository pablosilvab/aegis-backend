import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('tasks')
  export class TaskEntity {
    @PrimaryColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 200 })
    title: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column({ type: 'varchar', length: 50 })
    status: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    dueDate?: Date;
  }