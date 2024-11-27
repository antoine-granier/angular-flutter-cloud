import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../todo.service';
import { SharedModule } from '../shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  imports: [SharedModule, CheckboxModule, ButtonModule],
  standalone: true,
})
export class TodoComponent {
  @Input() todo!: { id: string; title: string; completed: boolean };
  @Output() deleteTask = new EventEmitter<string>();

  isEditing = false;

  constructor(private todoService: TodoService,private toastr: ToastrService) {}

  onDelete() {
    this.deleteTask.emit(this.todo.id);
  }

  onToggleCompleted() {
    this.todoService.updateTodo(this.todo.id, this.todo.completed).then(() => {
      this.toastr.success('Tâche mise à jour', "Succès")

    }).catch(error => {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      this.toastr.error('Erreur lors de la mise à jour de la tâche', "Erreur")
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveEdit() {
    this.isEditing = false;
    this.todoService.updateTodo(this.todo.id, this.todo.completed, this.todo.title)
      .then(() => {
        this.toastr.success('Tâche mise à jour', "Succès")
      })
      .catch(error => {
        this.toastr.error('Erreur lors de la mise à jour de la tâche', "Erreur")
      });
  }
}
