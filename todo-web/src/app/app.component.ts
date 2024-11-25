import { Component } from '@angular/core';
import { InputComponent } from './input/input.component';
import { TodosListComponent } from './todos-list/todos-list.component';
import { TodoService } from './todo.service';
import { SharedModule } from './shared.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [SharedModule,InputComponent, TodosListComponent],
  providers: [TodoService],
})
export class AppComponent {
  todos: any[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    // Charger les tâches depuis Firestore
    this.todoService.getTodos().subscribe((data) => {
      console.log(data);
      
      this.todos = data;
    });
  }

  addTask(title: string) {
    this.todoService.addTodo(title).then(() => {
      console.log('Tâche ajoutée!');
    });
  }

  deleteTask(id: string) {
    this.todoService.deleteTodo(id).then(() => {
      console.log('Tâche supprimée!');
    });
  }
}
