import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { AutocompleteOption, AutocompleteConfig } from './autocomplete.interface';

@Component({
    selector: 'app-base-autocomplete',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    template: `
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>{{ config.label || 'Select option' }}</mat-label>
      <input
        matInput
        [formControl]="searchControl"
        [matAutocomplete]="auto"
        [placeholder]="config.placeholder || 'Type to search...'"
        autocomplete="off"
      >
      <mat-icon matSuffix>{{ selectedOption() ? 'check' : 'search' }}</mat-icon>
      <mat-autocomplete 
        #auto="matAutocomplete" 
        [displayWith]="displayFn"
        (optionSelected)="onOptionSelected($event)"
        class="autocomplete-panel"
      >
        <div class="autocomplete-options-container">
          <mat-option 
            *ngFor="let option of filteredOptions(); trackBy: trackByFn" 
            [value]="option"
            class="autocomplete-option"
          >
            <div class="option-content">
              <div class="primary-text">{{ option.displayText }}</div>
              <div 
                *ngIf="config.showSecondaryText && option.secondaryText" 
                class="secondary-text"
              >
                {{ option.secondaryText }}
              </div>
            </div>
          </mat-option>
          
          <mat-option 
            *ngIf="filteredOptions().length === 0 && !isLoading" 
            disabled
            class="no-options"
          >
            {{ config.noOptionsText || 'No options found' }}
          </mat-option>
          
          <div 
            *ngIf="isLoading" 
            class="loading-indicator"
          >
            <mat-spinner diameter="24"></mat-spinner>
            <span>Loading...</span>
          </div>
        </div>
      </mat-autocomplete>
      
      <mat-error *ngIf="hasError">
        <ng-content select="[slot=error]"></ng-content>
      </mat-error>
    </mat-form-field>
  `,
    styleUrls: ['./base-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BaseAutocompleteComponent),
            multi: true
        }
    ]
})
export class BaseAutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() options: AutocompleteOption[] = [];
    @Input() config: AutocompleteConfig = {};
    @Input() isLoading = false;
    @Input() hasError = false;

    @Output() optionSelected = new EventEmitter<AutocompleteOption>();
    @Output() searchChanged = new EventEmitter<string>();

    searchControl = new FormControl('');
    selectedOption = signal<AutocompleteOption | null>(null);

    private destroy$ = new Subject<void>();
    private onChange = (value: any) => { };
    private onTouched = () => { };

    filteredOptions = computed(() => {
        const searchValue = this.searchControl.value?.toLowerCase() || '';
        const allOptions = this.options;

        if (!searchValue || searchValue.length < (this.config.minCharacters || 0)) {
            return allOptions.slice(0, this.config.maxOptions || 50);
        }

        const filtered = allOptions.filter((option: AutocompleteOption) =>
            option.displayText.toLowerCase().includes(searchValue) ||
            (option.secondaryText && option.secondaryText.toLowerCase().includes(searchValue))
        );

        return filtered.slice(0, this.config.maxOptions || 50);
    });

    ngOnInit() {
        this.searchControl.valueChanges
            .pipe(
                startWith(''),
                takeUntil(this.destroy$)
            )
            .subscribe(value => {
                if (typeof value === 'string') {
                    this.searchChanged.emit(value);

                    // Clear selection if user types something different
                    if (this.selectedOption() && value !== this.selectedOption()?.displayText) {
                        this.selectedOption.set(null);
                        this.onChange(null);
                    }
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // ControlValueAccessor implementation
    writeValue(value: any): void {
        if (value) {
            // Find the option that matches the value
            const option = this.options.find((opt: AutocompleteOption) => opt.id === value);
            if (option) {
                this.selectedOption.set(option);
                this.searchControl.setValue(option.displayText, { emitEvent: false });
            }
        } else {
            this.selectedOption.set(null);
            this.searchControl.setValue('', { emitEvent: false });
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.searchControl.disable();
        } else {
            this.searchControl.enable();
        }
    }

    displayFn = (option: AutocompleteOption): string => {
        return option ? option.displayText : '';
    };

    onOptionSelected(event: any): void {
        const option: AutocompleteOption = event.option.value;
        this.selectedOption.set(option);
        this.onChange(option.id);
        this.onTouched();
        this.optionSelected.emit(option);
    }

    trackByFn = (index: number, option: AutocompleteOption): number => {
        return option.id;
    };
}
