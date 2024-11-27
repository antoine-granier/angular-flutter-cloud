import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TodoComponent } from '../todo/todo.component';
import { SharedModule } from '../shared.module';
import { CardModule } from 'primeng/card';
import { User } from '../../type/user';

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

  onDeleteTask(id: string):void {
    this.deleteTask.emit(id);
  }

  getUser():string{
    return (JSON.parse(localStorage.getItem('user')??'') as User)?.email;
  }
}
