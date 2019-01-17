export declare function serialize(form: HTMLFormElement): object;

interface ValidationRules {
    [key: string]: RegExp | ((val: string, data: object) => boolean | string);
}

export declare function validate(form: HTMLFormElement, rules: ValidationRules, toCheck?: string): object;

interface BindOptions {
    onSubmit(event: Event): boolean;
    onError(event: Event): boolean;
    rules?: ValidationRules;
}

export declare function bind(form: HTMLFormElement, opts: BindOptions): HTMLFormElement;

export {};
