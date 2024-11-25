import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, deleteDoc, updateDoc, collectionData, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    // Initialize the collection reference for Firestore
    this.todosCollection = collection(this.firestore, 'todos');
  }

  // Fetch all todos as an observable
  getTodos(): Observable<any[]> {
    return collectionData(this.todosCollection, { idField: 'id' });
  }

  // Add a new todo to the collection
  addTodo(title: string): Promise<any> {
    const newTodo = { title, completed: false };
    return addDoc(this.todosCollection, newTodo);
  }

  // Delete a todo by its document ID
  deleteTodo(id: string): Promise<void> {
    const todoDocRef = doc(this.firestore, `todos/${id}`);
    return deleteDoc(todoDocRef);
  }

  // Update the completed status of a todo
  updateTodo(id: string, completed: boolean): Promise<void> {
    const todoDocRef = doc(this.firestore, `todos/${id}`);
    return updateDoc(todoDocRef, { completed });
  }
}
