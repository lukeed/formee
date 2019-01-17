export declare function serialize(form: HTMLFormElement): object;

export interface ValidationRules {
    [key: string]: RegExp | ((val: string, data: object) => boolean | string);
}

export declare function validate(form: HTMLFormElement, rules: ValidationRules, toCheck?: string): object;

export interface BindOptions {
    onSubmit(event: Event): boolean;
    onError(event: Event): boolean;
    rules?: ValidationRules;
}

export declare function bind(form: HTMLFormElement, opts: BindOptions): HTMLFormElement;
