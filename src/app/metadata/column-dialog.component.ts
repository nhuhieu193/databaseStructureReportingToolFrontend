import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Column' : 'Add Column' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" style="padding: 20px">
      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Column Name</mat-label>
        <input matInput formControlName="columnName" />
      </mat-form-field>

      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Data Type</mat-label>
        <input matInput formControlName="dataType" />
      </mat-form-field>

      <mat-checkbox formControlName="isNullable">Is Nullable</mat-checkbox>

      <div style="text-align: right; margin-top: 10px;">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" [disabled]="form.invalid" type="submit">
          Save
        </button>
      </div>
    </form>
  `
})
export class ColumnDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      columnName: [this.data?.columnName || '', Validators.required],
      dataType: [this.data?.dataType || '', Validators.required],
      isNullable: [this.data?.isNullable ?? true],
    });
  }

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
