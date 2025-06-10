// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Database Reporting Tool</h1>
        <p>Manage database structure and metadata</p>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .app-header {
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 0;
    }

    .app-header h1 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .app-header p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .app-main {
      flex: 1;
    }
  `]
})
export class AppComponent {
  title = 'reporting-tool-frontend';
}
