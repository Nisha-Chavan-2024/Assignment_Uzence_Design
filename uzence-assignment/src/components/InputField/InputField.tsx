import React, { useState } from 'react';

export type InputFieldProps = {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  type?: 'text' | 'password';
  disabled?: boolean;
  invalid?: boolean;
  isLoading?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  showPasswordToggle?: boolean;
  theme?: 'light' | 'dark';
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  helperText,
  errorMessage,
  type = 'text',
  disabled = false,
  invalid = false,
  isLoading = false,
  value,
  onChange,
  variant = 'outlined',
  size = 'md',
  clearable = false,
  showPasswordToggle = false,
  theme = 'light'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const sizeStyles = {
    sm: { fontSize: '14px', padding: '6px 8px' },
    md: { fontSize: '16px', padding: '8px 10px' },
    lg: { fontSize: '18px', padding: '10px 12px' }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    filled: {
      backgroundColor: theme === 'dark' ? '#333' : '#f3f4f6',
      border: '1px solid transparent'
    },
    outlined: {
      border: `1px solid ${invalid ? 'red' : theme === 'dark' ? '#555' : '#ccc'}`,
      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff'
    },
    ghost: {
      border: 'none',
      backgroundColor: 'transparent',
      borderBottom: `1px solid ${invalid ? 'red' : theme === 'dark' ? '#555' : '#ccc'}`
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '6px',
    outline: 'none',
    ...sizeStyles[size],
    ...variantStyles[variant],
    color: theme === 'dark' ? '#fff' : '#000',
    paddingRight: clearable || showPasswordToggle ? '40px' : sizeStyles[size].padding,
    boxSizing: 'border-box'
  };

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '14px',
    color: theme === 'dark' ? '#ddd' : '#666'
  };

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      {label && (
        <label
          style={{
            marginBottom: '4px',
            display: 'block',
            fontWeight: 'bold',
            color: theme === 'dark' ? '#fff' : '#111'
          }}
        >
          {label}
        </label>
      )}

      <div style={wrapperStyle}>
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
          value={value}
          onChange={onChange}
        />

        {clearable && value && !isLoading && (
          <span
            style={{ ...iconStyle, right: showPasswordToggle ? '28px' : '8px' }}
            onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
          >
            ❌
          </span>
        )}

        {showPasswordToggle && (
          <span style={iconStyle} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        )}
      </div>

      {isLoading && <small style={{ color: 'gray' }}>Loading...</small>}
      {helperText && !invalid && <small style={{ color: theme === 'dark' ? '#ccc' : '#6b7280' }}>{helperText}</small>}
      {invalid && errorMessage && <small style={{ color: 'red' }}>{errorMessage}</small>}
    </div>
  );
};

export default InputField;
