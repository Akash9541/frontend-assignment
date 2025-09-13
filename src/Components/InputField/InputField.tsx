import React, { useState, forwardRef, useMemo, useCallback } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  showClearButton?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  value = '',
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  showClearButton = false,
  className = '',
  id,
  name,
  autoComplete,
  required = false,
  leftIcon,
  rightIcon,
  inputClassName = '',
  labelClassName = '',
  helperClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasError = invalid || !!errorMessage;
  const hasValue = value && value.length > 0;
  const hasLeftIcon = !!leftIcon;

  // Memoized size classes
  const sizeClasses = useMemo(() => ({
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-13 px-5 text-lg'
  }), []);

  const labelSizeClasses = useMemo(() => ({
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }), []);

  // Memoized variant classes
  const getVariantClasses = useCallback(() => {
    const baseClasses = `
      w-full rounded-lg font-medium transition-all duration-200
      placeholder:text-slate-400 dark:placeholder:text-slate-500
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:cursor-not-allowed disabled:opacity-60
    `;

    switch (variant) {
      case 'filled':
        return `${baseClasses}
          bg-slate-100 dark:bg-slate-800 border-2 border-transparent
          text-slate-900 dark:text-slate-100
          hover:bg-slate-200 dark:hover:bg-slate-700
          focus:bg-white dark:focus:bg-slate-900
          focus:border-blue-500 focus:ring-blue-500/20
          ${hasError ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}
        `;
      
      case 'ghost':
        return `${baseClasses}
          bg-transparent border-2 border-transparent
          text-slate-900 dark:text-slate-100
          hover:bg-slate-100 dark:hover:bg-slate-800
          focus:bg-slate-50 dark:focus:bg-slate-800
          focus:border-blue-500 focus:ring-blue-500/20
          ${hasError ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}
        `;
      
      default: // outlined
        return `${baseClasses}
          bg-white dark:bg-slate-900 border-2
          text-slate-900 dark:text-slate-100
          border-slate-300 dark:border-slate-600
          hover:border-slate-400 dark:hover:border-slate-500
          focus:border-blue-500 focus:ring-blue-500/20
          ${hasError ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}
        `;
    }
  }, [variant, hasError]);

  const handleClear = useCallback(() => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  }, [onChange]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Calculate padding based on icons
  const getPaddingClasses = useMemo(() => {
    let padding = '';
    
    if (hasLeftIcon) {
      padding = size === 'sm' ? 'pl-10' : size === 'lg' ? 'pl-12' : 'pl-11';
    }
    
    if (isPassword || showClearButton || loading || rightIcon) {
      padding += size === 'sm' ? ' pr-10' : size === 'lg' ? ' pr-12' : ' pr-11';
    }
    
    return padding;
  }, [hasLeftIcon, isPassword, showClearButton, loading, rightIcon, size]);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`
            block font-semibold text-slate-700 dark:text-slate-300
            ${labelSizeClasses[size]}
            ${hasError ? 'text-red-600 dark:text-red-400' : ''}
            ${disabled ? 'opacity-60' : ''}
            ${labelClassName}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={`
            absolute left-3 top-1/2 -translate-y-1/2 text-slate-400
            ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
            ${disabled ? 'opacity-50' : ''}
          `}>
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete={autoComplete}
          required={required}
          className={`
            ${sizeClasses[size]}
            ${getVariantClasses()}
            ${getPaddingClasses}
            ${loading ? 'cursor-wait' : ''}
            ${inputClassName}
          `}
          aria-invalid={hasError}
          aria-describedby={
            id
              ? hasError
                ? `${id}-error`
                : helperText
                ? `${id}-helper`
                : undefined
              : undefined
          }
          {...props}
        />

        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {/* Custom Right Icon */}
          {rightIcon && !loading && (
            <div className={`
              text-slate-400
              ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
              ${disabled ? 'opacity-50' : ''}
            `}>
              {rightIcon}
            </div>
          )}

          {/* Loading spinner */}
          {loading && (
            <Loader2 
              className={`
                animate-spin text-slate-400
                ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
              `}
              aria-label="Loading"
            />
          )}

          {/* Clear button */}
          {!loading && showClearButton && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={`
                text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                transition-colors duration-150 rounded-full p-0.5
                hover:bg-slate-200 dark:hover:bg-slate-700
                ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
              aria-label="Clear input"
            >
              <X className="w-full h-full" />
            </button>
          )}

          {/* Password toggle */}
          {!loading && isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={disabled}
              className={`
                text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                transition-colors duration-150 rounded-full p-0.5
                hover:bg-slate-200 dark:hover:bg-slate-700
                disabled:cursor-not-allowed disabled:opacity-50
                ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? 
                <EyeOff className="w-full h-full" /> : 
                <Eye className="w-full h-full" />
              }
            </button>
          )}
        </div>

        {/* Focus ring enhancement */}
        {isFocused && (
          <div className={`
            absolute inset-0 rounded-lg pointer-events-none
            ring-2 ring-blue-500/30 ring-offset-2 ring-offset-white dark:ring-offset-slate-900
            ${variant === 'ghost' ? 'ring-offset-transparent' : ''}
          `} />
        )}
      </div>

      {/* Helper text or error message */}
      {(helperText || errorMessage) && (
        <div
          id={hasError && id ? `${id}-error` : id && helperText ? `${id}-helper` : undefined}
          className={`
            text-xs font-medium flex items-start space-x-1
            ${hasError ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}
            ${helperClassName}
          `}
          role={hasError ? 'alert' : undefined}
        >
          {hasError && (
            <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
          )}
          <span>{errorMessage || helperText}</span>
        </div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;