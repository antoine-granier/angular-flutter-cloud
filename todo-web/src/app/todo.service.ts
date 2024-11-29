import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, collection, doc, addDoc, deleteDoc, updateDoc, collectionData, CollectionReference, DocumentReference, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.todosCollection = collection(this.firestore, 'todos');
  }

  getTodos(): Observable<any[]> {
    const user = localStorage.getItem("user")

    if(!user) {
      return new Observable<any[]>(observer => {
        collectionData(this.todosCollection, { idField: 'id' }).subscribe((todos: any[]) => {
          const todosWithoutUser = todos.filter(todo => !todo.user);
          observer.next(todosWithoutUser);
        });
      });
    }

    const parsedUser: {email: string; id: string;} = JSON.parse(user)
    const userRef: DocumentReference = doc(this.firestore, `users/${parsedUser.id}`);

    const todosQuery = query(this.todosCollection, where('user', '==', userRef));
    return collectionData(todosQuery, { idField: 'id' });

  }

  addTodo(title: string) {
    const user = localStorage.getItem("user")
    const newTodo = { title, completed: false };

    if(!user) {
      return addDoc(this.todosCollection, newTodo);
    }

    const parsedUser: {email: string; id: string;} = JSON.parse(user)
    const userRef: DocumentReference = doc(this.firestore, `users/${parsedUser.id}`);
    return addDoc(this.todosCollection, {...newTodo, user: userRef});
  }

  deleteTodo(id: string) {
    const todoDocRef = doc(this.firestore, `todos/${id}`);
    return deleteDoc(todoDocRef);
  }

  updateTodo(id: string, completed: boolean, title?: string) {
    const todoDocRef = doc(this.firestore, `todos/${id}`);
    
    const updateData: any = { completed };
    if (title !== undefined) {
      updateData.title = title;
    }
  
    return updateDoc(todoDocRef, updateData);
  }
  
}
