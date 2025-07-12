export interface AutocompleteOption {
    id: number;
    displayText: string;
    secondaryText?: string;
    data?: any;
}

export interface AutocompleteConfig {
    placeholder?: string;
    label?: string;
    noOptionsText?: string;
    showSecondaryText?: boolean;
    maxOptions?: number;
    minCharacters?: number;
}
