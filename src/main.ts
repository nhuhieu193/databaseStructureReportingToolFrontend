// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Import services
import { TableMetadataService } from './app/services/table-metadata.service';
import { ColumnMetadataService } from './app/services/column-metadata.service';
import { MetadataSyncService } from './app/services/metadata-sync.service';

// Import components for routing
import { TableListComponent } from './app/components/table-list/table-list.component';

// Define routes with proper typing
const routes: Routes = [
  { path: '', redirectTo: '/tables', pathMatch: 'full' },
  { path: 'tables', component: TableListComponent },
  { path: '**', redirectTo: '/tables' }
];

bootstrapApplication(AppComponent, {
  providers: [
    // Router configuration
    provideRouter(routes),

    // HTTP Client
    provideHttpClient(),

    // Forms support
    importProvidersFrom(ReactiveFormsModule),

    // Services
    TableMetadataService,
    ColumnMetadataService,
    MetadataSyncService
  ]
}).catch(err => console.error(err));
