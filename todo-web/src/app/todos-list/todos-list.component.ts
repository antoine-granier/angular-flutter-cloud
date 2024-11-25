import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoComponent } from '../todo/todo.component';
import { SharedModule } from '../shared.module';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss'],
  standalone: true,
  imports: [SharedModule, TodoComponent, CardModule],
})
export class TodosListComponent {
  @Input() todos: any[] = [];
  @Output() deleteTask = new EventEmitter<string>();

  onDeleteTask(id: string) {
    this.deleteTask.emit(id);
  }
}
