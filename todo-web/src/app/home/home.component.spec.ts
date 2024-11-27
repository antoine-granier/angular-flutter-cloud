import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { InputComponent } from '../input/input.component';
import { TodosListComponent } from '../todos-list/todos-list.component';
import { SharedModule } from '../shared.module';
import { ButtonModule } from 'primeng/button';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let todoServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;
  let toastrServiceMock: any;

  beforeEach(async () => {
    // Mock TodoService
    todoServiceMock = {
      getTodos: jasmine.createSpy('getTodos').and.returnValue(of([{ id: '1', title: 'Test Todo', completed: false }])),
      addTodo: jasmine.createSpy('addTodo').and.returnValue(Promise.resolve()),
      deleteTodo: jasmine.createSpy('deleteTodo').and.returnValue(Promise.resolve()),
    };

    // Mock AuthService
    authServiceMock = {
      signOut: jasmine.createSpy('signOut'),
    };

    // Mock Router
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    // Mock ToastrService
    toastrServiceMock = {
      success: jasmine.createSpy('success'),
    };

    await TestBed.configureTestingModule({
      imports: [InputComponent, TodosListComponent, SharedModule, ButtonModule],
      declarations: [HomeComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on initialization', () => {
    component.ngOnInit();
    expect(todoServiceMock.getTodos).toHaveBeenCalled();
    expect(component.todos.length).toBe(1);
    expect(component.todos[0].title).toBe('Test Todo');
  });

  it('should check if a user is connected', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockUser');
    expect(component.checkUserConnected()).toBe('mockUser');
  });

  it('should log out and navigate to login page', () => {
    component.logout();
    expect(authServiceMock.signOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should navigate to login page when login is called', () => {
    component.login();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should add a task and show a success notification', async () => {
    await component.addTask('New Task');
    expect(todoServiceMock.addTodo).toHaveBeenCalledWith('New Task');
    expect(toastrServiceMock.success).toHaveBeenCalledWith('Tâche ajoutée', 'Succès');
  });

  it('should delete a task and show a success notification', async () => {
    await component.deleteTask('1');
    expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith('1');
    expect(toastrServiceMock.success).toHaveBeenCalledWith('Tâche supprimée', 'Succès');
  });
});
