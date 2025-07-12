export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface ErrorResponse {
    message: string;
    errors?: ValidationError[];
}
