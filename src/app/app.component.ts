// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ColumnFormComponent } from './components/column-form/column-form.component';
import { TableFormComponent } from './components/table-form/table-form.component';
import { TableMetadataService } from './services/table-metadata.service'; // ✅ ADD THIS

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ColumnFormComponent, TableFormComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1>Database Reporting Tool</h1>
          <p>Manage database structure and metadata</p>
        </div>
      </header>

      <main class="app-main">
        <div class="main-content">
          <!-- Dashboard Overview -->
          <div class="dashboard-section" *ngIf="!selectedTable">
            <div class="welcome-card">
              <h2>Welcome to Database Reporting Tool</h2>
              <p>Select a table from the list below to view and manage its columns</p>
              <div *ngIf="error" class="error-message">
                <i class="icon-warning"></i>
                {{error}}
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading...</p>
          </div>

          <!-- Main Layout -->
          <div class="layout-container">
            <!-- Tables List -->
            <div class="tables-panel" [class.collapsed]="selectedTable">
              <div class="panel-header">
                <h3>Database Tables</h3>
                <div class="panel-actions">
                  <button class="btn btn-primary" (click)="syncMetadata()" [disabled]="loading">
                    <i class="icon-sync"></i> Sync Metadata
                  </button>
                  <button class="btn btn-success" (click)="addTable()" [disabled]="loading">
                    <i class="icon-plus"></i> Add Table
                  </button>
                  <!-- ✅ NEW: Export PDF Button -->
                  <button
                    class="btn btn-secondary"
                    (click)="exportToPDF()"
                    [disabled]="isExporting || loading"
                    title="Export database metadata to PDF">
                    <i class="icon-file-pdf"></i>
                    <span *ngIf="!isExporting">Export PDF</span>
                    <span *ngIf="isExporting">
                      <i class="icon-spinner"></i> Exporting...
                    </span>
                  </button>
                </div>
              </div>

              <div class="tables-list">
                <div class="table-count">Tables ({{tables.length}})</div>
                <div *ngIf="!loading && tables.length === 0" class="empty-tables">
                  <i class="icon-database"></i>
                  <p>No tables found</p>
                  <button class="btn btn-primary" (click)="syncMetadata()">Sync Metadata</button>
                </div>
                <div
                  *ngFor="let table of tables"
                  class="table-item"
                  [class.selected]="selectedTable?.name === table.name"
                  (click)="selectTable(table)"
                >
                  <div class="table-info">
                    <div class="table-name">{{table.name}}</div>
                    <div class="table-schema">{{table.schema}}</div>
                  </div>
                  <button
                    class="btn-delete"
                    (click)="deleteTable(table, $event)"
                    title="Delete Table"
                  >
                    <i class="icon-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Table Details -->
            <div class="table-details-panel" *ngIf="selectedTable">
              <div class="panel-header">
                <div class="table-header-info">
                  <button class="btn-back" (click)="selectedTable = null">
                    <i class="icon-arrow-left"></i>
                  </button>
                  <div>
                    <h3>{{selectedTable.name}}</h3>
                    <span class="schema-badge">{{selectedTable.schema}}</span>
                  </div>
                </div>
                <button class="btn btn-success" (click)="addColumn()">
                  <i class="icon-plus"></i> Add Column
                </button>
              </div>

              <div class="columns-section">
                <div class="section-title">Columns ({{selectedTable.columns?.length || 0}})</div>

                <div class="columns-table">
                  <div class="table-header">
                    <div class="col-name">Column Name</div>
                    <div class="col-type">Data Type</div>
                    <div class="col-size">Size</div>
                    <div class="col-nullable">Nullable</div>
                    <div class="col-actions">Actions</div>
                  </div>

                  <div
                    *ngFor="let column of selectedTable.columns"
                    class="table-row"
                  >
                    <div class="col-name">
                      <i class="icon-column" [class]="getColumnIcon(column.dataType)"></i>
                      {{column.name}}
                    </div>
                    <div class="col-type">
                      <span class="type-badge" [class]="getTypeClass(column.dataType)">
                        {{column.dataType}}
                      </span>
                    </div>
                    <div class="col-size">{{column.size || '-'}}</div>
                    <div class="col-nullable">
                      <span class="nullable-badge" [class.nullable]="column.nullable" [class.not-nullable]="!column.nullable">
                        {{column.nullable ? 'Yes' : 'No'}}
                      </span>
                    </div>
                    <div class="col-actions">
                      <button class="btn-edit" (click)="editColumn(column)" title="Edit">
                        <i class="icon-edit"></i>
                      </button>
                      <button class="btn-delete" (click)="deleteColumn(column)" title="Delete">
                        <i class="icon-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div *ngIf="!selectedTable.columns?.length" class="empty-state">
                    <i class="icon-database"></i>
                    <p>No columns found</p>
                    <button class="btn btn-primary" (click)="addColumn()">Add First Column</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Table Form Overlay -->
      <div *ngIf="showAddTableForm" class="edit-form-overlay">
        <div class="edit-form-container">
          <app-table-form
            (saved)="onTableSaved()"
            (cancelled)="hideAddTableForm()">
          </app-table-form>
        </div>
      </div>

      <!-- Edit Column Form Overlay -->
      <div *ngIf="showEditForm && editingColumn" class="edit-form-overlay">
        <div class="edit-form-container">
          <app-column-form
            [column]="editingColumn"
            [tableName]="selectedTable.name"
            (saved)="onSaveEdit()"
            (cancelled)="onCancelEdit()">
          </app-column-form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'reporting-tool-frontend';
  selectedTable: any = null;
  tables: any[] = [];
  loading = false;
  error: string | null = null;

  // Properties for forms
  showAddTableForm = false;
  editingColumn: any = null;
  showEditForm = false;

  // ✅ NEW: Export PDF property
  isExporting = false;

  constructor(
    private http: HttpClient,
    private tableMetadataService: TableMetadataService // ✅ ADD THIS
  ) {}

  ngOnInit() {
    console.log('App initialized');
    this.loadTables();
  }

  loadTables() {
    this.loading = true;
    this.error = null;

    this.http.get<any[]>('http://localhost:8080/api/tables')
      .subscribe({
        next: (data) => {
          console.log('Raw API Response:', data);

          // Map API response to expected format
          this.tables = data.map(table => ({
            name: table.tableName,
            schema: table.schemaName || 'default',
            id: table.id,
            description: table.description,
            columns: table.columns?.map((column: any) => ({
              id: column.id,
              name: column.columnName,
              dataType: column.dataType,
              size: column.columnSize,
              nullable: column.nullable
            })) || []
          }));

          console.log('Mapped Tables:', this.tables);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading tables:', error);
          this.error = 'Failed to load tables. Please check your backend connection.';
          this.loading = false;
        }
      });
  }

  selectTable(table: any) {
    console.log('Selected table:', table);
    console.log('Table columns:', table.columns);
    this.selectedTable = table;
  }

  syncMetadata() {
    this.loading = true;
    this.http.post('http://localhost:8080/api/metadata/sync', {})
      .subscribe({
        next: () => {
          this.loadTables();
          console.log('Metadata synced successfully');
        },
        error: (error) => {
          console.error('Error syncing metadata:', error);
          this.error = 'Failed to sync metadata.';
          this.loading = false;
        }
      });
  }

  addTable() {
    console.log('Opening add table form...');
    this.showAddTableForm = true;
    this.selectedTable = null;
  }

  hideAddTableForm() {
    this.showAddTableForm = false;
  }

  onTableSaved() {
    this.showAddTableForm = false;
    this.loadTables();
  }

  deleteTable(table: any, event: Event) {
    event.stopPropagation();

    if (confirm(`Are you sure you want to delete table "${table.name}"?`)) {
      this.http.delete(`http://localhost:8080/api/tables/${table.name}`)
        .subscribe({
          next: () => {
            this.tables = this.tables.filter(t => t.name !== table.name);
            if (this.selectedTable?.name === table.name) {
              this.selectedTable = null;
            }
            console.log('Table deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting table:', error);
            this.error = 'Failed to delete table.';
          }
        });
    }
  }

  addColumn() {
    console.log('Opening add column form...');
  }

  editColumn(column: any) {
    console.log('Opening edit column form for:', column.name);

    this.editingColumn = {
      id: column.id,
      columnName: column.name,
      dataType: column.dataType,
      columnSize: column.size,
      nullable: column.nullable,
      table: { tableName: this.selectedTable.name }
    };

    this.showEditForm = true;
  }

  onSaveEdit() {
    this.showEditForm = false;
    this.editingColumn = null;
    this.loadTables();
  }

  onCancelEdit() {
    this.showEditForm = false;
    this.editingColumn = null;
  }

  deleteColumn(column: any) {
    if (!column?.id) {
      console.error('Column ID is missing');
      return;
    }

    if (confirm(`Are you sure you want to delete column "${column.name}"?`)) {
      this.http.delete(`http://localhost:8080/api/columns/${column.id}`)
        .subscribe({
          next: () => {
            if (this.selectedTable?.columns) {
              this.selectedTable.columns = this.selectedTable.columns.filter((c: any) => c.id !== column.id);
            }
            console.log('Column deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting column:', error);
            this.error = 'Failed to delete column.';
          }
        });
    }
  }

  // ✅ NEW: Export PDF method
  exportToPDF(): void {
    this.isExporting = true;

    this.tableMetadataService.exportMetadataToPDF().subscribe({
      next: (blob: Blob) => {
        const filename = `database-metadata-${new Date().toISOString().split('T')[0]}.pdf`;
        this.tableMetadataService.downloadPDF(blob, filename);
        this.isExporting = false;
        console.log('PDF exported successfully');
      },
      error: (error) => {
        console.error('Error exporting PDF:', error);
        this.error = 'Error exporting PDF. Please try again.';
        this.isExporting = false;
      }
    });
  }

  getColumnIcon(dataType: string): string {
    return `icon-column ${dataType.toLowerCase()}`;
  }

  getTypeClass(dataType: string): string {
    return dataType.toLowerCase();
  }
}
