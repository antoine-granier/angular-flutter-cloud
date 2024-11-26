import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collectionData, CollectionReference, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: CollectionReference;

  constructor(private afAuth: AngularFireAuth, private firestore: Firestore, private router: Router) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  // Inscription
  async signUp(email: string, password: string) {
    const signUp = await this.afAuth.createUserWithEmailAndPassword(email, password);
    return addDoc(this.usersCollection, {email: signUp.user?.email});
  }

  // Connexion
  async signIn(email: string, password: string) {
    const singIn = await this.afAuth.signInWithEmailAndPassword(email, password);
    const users: [{email: string}] = await firstValueFrom(collectionData(this.usersCollection, {idField: "id"}))
    const user = users.find(user => user.email === singIn.user?.email)
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(["/home"])
  }

  // Déconnexion
  signOut() {
    localStorage.clear()
    return this.afAuth.signOut();
  }
}