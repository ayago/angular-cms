import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {}
