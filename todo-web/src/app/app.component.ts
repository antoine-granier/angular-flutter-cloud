import { Component } from '@angular/core';
import { SharedModule } from './shared.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [SharedModule, RouterOutlet],
})
export class AppComponent {
}
