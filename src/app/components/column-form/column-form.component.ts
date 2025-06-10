// src/app/components/column-form/column-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMetadata } from '../../models/column-metadata.model';
import { ColumnMetadataService } from '../../services/column-metadata.service';

@Component({
  selector: 'app-column-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './column-form.component.html',
  styleUrls: ['./column-form.component.css']
})
export class ColumnFormComponent implements OnInit {
  @Input() column: ColumnMetadata | null = null;
  @Input() tableName!: string;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  columnForm: FormGroup;
  loading = false;
  error: string | null = null;

  dataTypes = [
    'VARCHAR',
    'TEXT',
    'INTEGER',
    'BIGINT',
    'DECIMAL',
    'FLOAT',
    'DOUBLE',
    'BOOLEAN',
    'DATE',
    'DATETIME',
    'TIMESTAMP',
    'TIME',
    'BLOB',
    'CLOB'
  ];

  constructor(
    private fb: FormBuilder,
    private columnService: ColumnMetadataService
  ) {
    this.columnForm = this.fb.group({
      columnName: ['', [Validators.required, Validators.minLength(1)]],
      dataType: ['VARCHAR', [Validators.required]],
      columnSize: [null],
      nullable: [true]
    });
  }

  ngOnInit(): void {
    if (this.column) {
      this.columnForm.patchValue({
        columnName: this.column.columnName,
        dataType: this.column.dataType,
        columnSize: this.column.columnSize,
        nullable: this.column.nullable
      });
    }
  }

  get isEditing(): boolean {
    return !!this.column;
  }

  onSubmit(): void {
    if (this.columnForm.valid) {
      this.loading = true;
      this.error = null;

      const formData = this.columnForm.value;
      const columnData: ColumnMetadata = {
        columnName: formData.columnName,
        dataType: formData.dataType,
        columnSize: formData.columnSize || null,
        nullable: formData.nullable
      };

      const operation = this.isEditing
        ? this.columnService.updateColumn(this.column!.id!, columnData)
        : this.columnService.createColumn(columnData);

      operation.subscribe({
        next: () => {
          this.loading = false;
          this.saved.emit();
        },
        error: (error) => {
          this.loading = false;
          this.error = this.isEditing ? 'Failed to update column' : 'Failed to create column';
          console.error('Error saving column:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getFieldError(fieldName: string): string | null {
    const field = this.columnForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors?.['minlength']) {
        return `${fieldName} must be at least 1 character`;
      }
    }
    return null;
  }

  onDataTypeChange(): void {
    const dataType = this.columnForm.get('dataType')?.value;
    const sizeControl = this.columnForm.get('columnSize');

    // Auto-suggest column sizes based on data type
    if (dataType === 'VARCHAR') {
      sizeControl?.setValue(255);
    } else if (dataType === 'INTEGER') {
      sizeControl?.setValue(null);
    } else if (dataType === 'DECIMAL') {
      sizeControl?.setValue(10);
    } else {
      sizeControl?.setValue(null);
    }
  }

  needsSize(dataType: string): boolean {
    return ['VARCHAR', 'CHAR', 'DECIMAL', 'NUMERIC'].includes(dataType);
  }
}
