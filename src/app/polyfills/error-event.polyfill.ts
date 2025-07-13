// Polyfill for ErrorEvent in server-side rendering environments

// Polyfill ErrorEvent for server-side rendering
if (typeof ErrorEvent === 'undefined') {
    (global as any).ErrorEvent = class ErrorEvent {
        type: string;
        message: string;
        filename: string;
        lineno: number;
        colno: number;
        error: any;

        constructor(type: string, eventInitDict?: {
            message?: string;
            filename?: string;
            lineno?: number;
            colno?: number;
            error?: any;
        }) {
            this.type = type;
            this.message = eventInitDict?.message || '';
            this.filename = eventInitDict?.filename || '';
            this.lineno = eventInitDict?.lineno || 0;
            this.colno = eventInitDict?.colno || 0;
            this.error = eventInitDict?.error;
        }
    };
}

export { };
