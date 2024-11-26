import { Component } from '@angular/core';
import { TodoService } from '../todo.service';
import { InputComponent } from '../input/input.component';
import { TodosListComponent } from '../todos-list/todos-list.component';
import { SharedModule } from '../shared.module';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputComponent, TodosListComponent, SharedModule, ButtonModule],
  providers: [TodoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  todos: any[] = [];

  constructor(private todoService: TodoService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  checkUserConnected() {
    return localStorage.getItem("user")
  }

  logout() {
    this.authService.signOut()
  }

  login(): void {
    this.router.navigate(['/login']);
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
