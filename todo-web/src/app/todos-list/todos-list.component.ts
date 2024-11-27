import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TodoComponent } from '../todo/todo.component';
import { SharedModule } from '../shared.module';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss'],
  standalone: true,
  imports: [SharedModule, TodoComponent, CardModule,TableModule],
})
export class TodosListComponent {
  @Input() todos: any[] = [];
  @Output() deleteTask = new EventEmitter<string>();

  onDeleteTask(id: string) {
    this.deleteTask.emit(id);
  }
}
