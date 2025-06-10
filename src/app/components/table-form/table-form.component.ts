// src/app/components/table-form/table-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableMetadata } from '../../models/table-metadata.model';
import { TableMetadataService } from '../../services/table-metadata.service';

@Component({
  selector: 'app-table-form',
  standalone: true, // ✅ Thêm standalone: true
  imports: [CommonModule, ReactiveFormsModule], // ✅ Thêm imports với ReactiveFormsModule
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.css']
})
export class TableFormComponent implements OnInit {
  @Input() table: TableMetadata | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  tableForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tableService: TableMetadataService
  ) {
    this.tableForm = this.fb.group({
      tableName: ['', [Validators.required, Validators.minLength(1)]],
      schemaName: ['', [Validators.required, Validators.minLength(1)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.table) {
      this.tableForm.patchValue({
        tableName: this.table.tableName,
        schemaName: this.table.schemaName,
        description: this.table.description || ''
      });
    }
  }

  get isEditing(): boolean {
    return !!this.table;
  }

  onSubmit(): void {
    if (this.tableForm.valid) {
      this.loading = true;
      this.error = null;

      const formData = this.tableForm.value;
      const tableData: TableMetadata = {
        tableName: formData.tableName,
        schemaName: formData.schemaName,
        description: formData.description || null
      };

      const operation = this.isEditing
        ? this.tableService.updateTable(this.table!.tableName, tableData)
        : this.tableService.createTable(tableData);

      operation.subscribe({
        next: () => {
          this.loading = false;
          this.saved.emit();
        },
        error: (error) => {
          this.loading = false;
          this.error = this.isEditing ? 'Failed to update table' : 'Failed to create table';
          console.error('Error saving table:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getFieldError(fieldName: string): string | null {
    const field = this.tableForm.get(fieldName);
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
}
