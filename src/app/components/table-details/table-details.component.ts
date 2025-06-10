// src/app/components/table-details/table-details.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableMetadata } from '../../models/table-metadata.model';
import { ColumnMetadata } from '../../models/column-metadata.model';
import { ColumnMetadataService } from '../../services/column-metadata.service';
import { ColumnFormComponent } from '../column-form/column-form.component';

@Component({
  selector: 'app-table-details',
  standalone: true,
  imports: [CommonModule, ColumnFormComponent],
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.css']
})
export class TableDetailsComponent implements OnInit {
  @Input() table!: TableMetadata;
  @Output() tableUpdated = new EventEmitter<void>();

  columns: ColumnMetadata[] = [];
  loading = false;
  error: string | null = null;
  showAddColumnForm = false;
  editingColumn: ColumnMetadata | null = null;

  constructor(private columnService: ColumnMetadataService) {}

  ngOnInit(): void {
    this.loadColumns();
  }

  loadColumns(): void {
    if (!this.table.tableName) return;

    this.loading = true;
    this.error = null;

    this.columnService.getColumnsByTable(this.table.tableName).subscribe({
      next: (columns) => {
        this.columns = columns;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load columns';
        this.loading = false;
        console.error('Error loading columns:', error);
      }
    });
  }

  showAddColumn(): void {
    this.showAddColumnForm = true;
    this.editingColumn = null;
  }

  editColumn(column: ColumnMetadata): void {
    this.editingColumn = column;
    this.showAddColumnForm = true;
  }

  deleteColumn(columnId: number): void {
    const column = this.columns.find(c => c.id === columnId);
    const columnName = column ? column.columnName : 'this column';

    if (confirm(`Are you sure you want to delete "${columnName}"?`)) {
      this.columnService.deleteColumn(columnId).subscribe({
        next: () => {
          this.loadColumns();
        },
        error: (error) => {
          this.error = 'Failed to delete column';
          console.error('Error deleting column:', error);
        }
      });
    }
  }

  hideColumnForm(): void {
    this.showAddColumnForm = false;
    this.editingColumn = null;
  }

  onColumnSaved(): void {
    this.hideColumnForm();
    this.loadColumns();
  }

  getDataTypeIcon(dataType: string): string {
    const type = dataType.toLowerCase();
    if (type.includes('varchar') || type.includes('text') || type.includes('char')) {
      return '📝';
    }
    if (type.includes('int') || type.includes('number') || type.includes('decimal')) {
      return '🔢';
    }
    if (type.includes('date') || type.includes('time')) {
      return '📅';
    }
    if (type.includes('bool')) {
      return '✅';
    }
    return '📄';
  }
}
