import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { TodoService } from '../todo.service';
import { ToastrService } from 'ngx-toastr';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared.module';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Todo } from '../../type/todo';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todoServiceMock: any;
  let toastrServiceMock: any;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
  };

  beforeEach(async () => {
    // Mocking TodoService
    todoServiceMock = {
      updateTodo: jasmine.createSpy('updateTodo').and.returnValue(Promise.resolve()),
    };

    // Mocking ToastrService
    toastrServiceMock = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
    };

    await TestBed.configureTestingModule({
      imports: [SharedModule, CheckboxModule, ButtonModule],
      declarations: [TodoComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;

    // Set input
    component.todo = { ...mockTodo };

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deleteTask when onDelete is called', () => {
    spyOn(component.deleteTask, 'emit');
    component.onDelete();
    expect(component.deleteTask.emit).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should toggle completed status with onToggleCompleted', async () => {
    component.todo.completed = true;

    await component.onToggleCompleted();

    expect(todoServiceMock.updateTodo).toHaveBeenCalledWith(mockTodo.id, true);
    expect(toastrServiceMock.success).toHaveBeenCalledWith('Tâche mise à jour', 'Succès');
  });

  it('should handle errors in onToggleCompleted', async () => {
    todoServiceMock.updateTodo.and.returnValue(Promise.reject('Error'));

    await component.onToggleCompleted();

    expect(todoServiceMock.updateTodo).toHaveBeenCalledWith(mockTodo.id, true);
    expect(toastrServiceMock.error).toHaveBeenCalledWith('Erreur lors de la mise à jour de la tâche', 'Erreur');
  });

  it('should enable editing with enableEdit', () => {
    component.enableEdit();
    expect(component.isEditing).toBeTrue();
  });

  it('should save edited title with saveEdit', async () => {
    component.isEditing = true;
    component.todo.title = 'Updated Todo';

    await component.saveEdit();

    expect(component.isEditing).toBeFalse();
    expect(todoServiceMock.updateTodo).toHaveBeenCalledWith(mockTodo.id, false, 'Updated Todo');
    expect(toastrServiceMock.success).toHaveBeenCalledWith('Tâche mise à jour', 'Succès');
  });

  it('should handle errors in saveEdit', async () => {
    todoServiceMock.updateTodo.and.returnValue(Promise.reject('Error'));

    await component.saveEdit();

    expect(todoServiceMock.updateTodo).toHaveBeenCalledWith(mockTodo.id, false, 'Updated Todo');
    expect(toastrServiceMock.error).toHaveBeenCalledWith('Erreur lors de la mise à jour de la tâche', 'Erreur');
  });

  it('should render todo title', () => {
    const titleElement = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(titleElement.textContent).toContain(mockTodo.title);
  });

  it('should call enableEdit when double-clicking the title', () => {
    spyOn(component, 'enableEdit');
    const titleElement = fixture.debugElement.query(By.css('label'));
    titleElement.triggerEventHandler('dblclick', {});
    expect(component.enableEdit).toHaveBeenCalled();
  });
});
