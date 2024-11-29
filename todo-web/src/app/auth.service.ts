import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  Firestore,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: CollectionReference;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: Firestore,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  async signUp(email: string, password: string) {
    const signUp = await this.afAuth.createUserWithEmailAndPassword(email, password);
    this.toastr.success('Inscription réussie', `Bienvenue ${email}`);
    return addDoc(this.usersCollection, { email: signUp.user?.email });
  }

  async signIn(email: string, password: string) {
    const signIn = await this.afAuth.signInWithEmailAndPassword(email, password);
    const users: { email: string }[] = await firstValueFrom(
      collectionData(this.usersCollection, { idField: 'id' })
    );
    const user = users.find((user) => user.email === signIn.user?.email);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.toastr.success('Connexion réussie', `Bonjour ${user.email}`);
      this.router.navigate(['/home']);
    } else {
      this.toastr.error('Utilisateur non trouvé');
    }
  }

  signOut() {
    localStorage.clear();
    return this.afAuth.signOut();
  }
}
