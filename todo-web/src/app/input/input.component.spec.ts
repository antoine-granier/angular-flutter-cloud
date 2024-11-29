import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty taskTitle', () => {
    expect(component.taskTitle).toBe('');
  });

  it('should emit addTask event with taskTitle and reset taskTitle after adding a task', () => {
    spyOn(component.addTask, 'emit');
    component.taskTitle = 'New Task';

    component.addNewTask();

    expect(component.addTask.emit).toHaveBeenCalledWith('New Task');
    expect(component.taskTitle).toBe('');
  });

  it('should not emit addTask event if taskTitle is empty or only whitespace', () => {
    spyOn(component.addTask, 'emit');

    // Empty string
    component.taskTitle = '';
    component.addNewTask();
    expect(component.addTask.emit).not.toHaveBeenCalled();

    // Whitespace string
    component.taskTitle = '   ';
    component.addNewTask();
    expect(component.addTask.emit).not.toHaveBeenCalled();
  });

  it('should call addNewTask when the add button is clicked', () => {
    spyOn(component, 'addNewTask');

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click();

    expect(component.addNewTask).toHaveBeenCalled();
  });

  it('should bind input field to taskTitle', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    inputElement.value = 'Test Task';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.taskTitle).toBe('Test Task');
  });
});
