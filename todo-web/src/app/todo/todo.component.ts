import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../todo.service';
import { SharedModule } from '../shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  imports:[SharedModule, CheckboxModule, ButtonModule],
  standalone: true,
})
export class TodoComponent {
  @Input() todo!: { id: string; title: string; completed: boolean };
  @Output() deleteTask = new EventEmitter<string>();

  constructor(private todoService: TodoService) {    
  }

  onDelete() {
    this.deleteTask.emit(this.todo.id);
  }

  onToggleCompleted() {
    this.todoService.updateTodo(this.todo.id, this.todo.completed).then(() => {
      console.log('Tâche mise à jour:', this.todo);
    }).catch(error => {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    });
  }
}
