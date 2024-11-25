import { Component, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports:[SharedModule],
  standalone: true,
})
export class InputComponent {
  taskTitle: string = '';

  @Output() addTask = new EventEmitter<string>();

  addNewTask() {
    if (this.taskTitle.trim()) {
      this.addTask.emit(this.taskTitle);
      this.taskTitle = ''; // Réinitialise l’input
    }
  }
}
