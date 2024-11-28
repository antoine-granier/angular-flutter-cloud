import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosListComponent } from './todos-list.component';
import { TodoComponent } from '../todo/todo.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SharedModule } from '../shared.module';
import { By } from '@angular/platform-browser';

describe('TodosListComponent', () => {
  let component: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, TodoComponent, CardModule, TableModule],
      declarations: [TodosListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the todos', () => {
    const todos = [
      { id: '1', title: 'Test Todo 1', completed: false },
      { id: '2', title: 'Test Todo 2', completed: true },
    ];
    component.todos = todos;
    fixture.detectChanges();

    const renderedTodos = fixture.debugElement.queryAll(By.css('app-todo'));
    expect(renderedTodos.length).toBe(todos.length);
  });

  it('should emit deleteTask when onDeleteTask is called', () => {
    spyOn(component.deleteTask, 'emit');
    const todoId = '1';

    component.onDeleteTask(todoId);
    expect(component.deleteTask.emit).toHaveBeenCalledWith(todoId);
  });

  it('should return the user email from localStorage', () => {
    const user = { email: 'test@example.com' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

    const email = component.getUser();
    expect(email).toBe(user.email);
  });

  it('should handle localStorage without user data gracefully', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const email = component.getUser();
    expect(email).toBeUndefined();
  });
});
