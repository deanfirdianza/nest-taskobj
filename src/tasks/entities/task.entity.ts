export class TaskEntity {
  id: number;
  title: string;
  actionTime: string;
  createdTime: string;
  updatedTime: string;
  isFinished: boolean;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
