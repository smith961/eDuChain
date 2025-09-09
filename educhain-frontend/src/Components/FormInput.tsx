import React from 'react';

interface FormInputProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  min?: string | number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  className = '',
  children,
  min,
}) => {
  const baseInputClasses = `w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${className}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`${baseInputClasses} resize-vertical min-h-[100px]`}
          rows={4}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseInputClasses} pr-10 text-gray-900 bg-white`}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={baseInputClasses}
          min={min}
        />
      )}

      {children && type !== 'select' && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormInput;