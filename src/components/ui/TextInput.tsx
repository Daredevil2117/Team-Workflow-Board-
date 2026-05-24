import { InputHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
};

type TextInputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;
type TextAreaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextInput({ label, error, hint, id, className = '', ...props }: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = [hint ? `${inputId}-hint` : '', error ? `${inputId}-error` : ''].filter(Boolean).join(' ');

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} aria-invalid={Boolean(error)} aria-describedby={describedBy || undefined} {...props} />
      {hint ? <span id={`${inputId}-hint`} className="field__hint">{hint}</span> : null}
      {error ? <span id={`${inputId}-error`} className="field__error" role="alert">{error}</span> : null}
    </div>
  );
}

export function TextArea({ label, error, hint, id, className = '', ...props }: TextAreaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = [hint ? `${inputId}-hint` : '', error ? `${inputId}-error` : ''].filter(Boolean).join(' ');

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={inputId}>{label}</label>
      <textarea id={inputId} aria-invalid={Boolean(error)} aria-describedby={describedBy || undefined} {...props} />
      {hint ? <span id={`${inputId}-hint`} className="field__hint">{hint}</span> : null}
      {error ? <span id={`${inputId}-error`} className="field__error" role="alert">{error}</span> : null}
    </div>
  );
}
