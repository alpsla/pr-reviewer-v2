import React, { useRef, useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface StyledSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: Option[];
}

const StyledSelect: React.FC<StyledSelectProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  options
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [showCustomDropdown, setShowCustomDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    options.find(option => option.value === value)
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option);
  }, [value, options]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCustomDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleOptionClick = (option: Option) => {
    if (selectRef.current) {
      selectRef.current.value = option.value;
      
      // Create a synthetic event
      const event = new Event('change', { bubbles: true });
      selectRef.current.dispatchEvent(event);
      
      // Call the onChange handler with a synthetic React event
      onChange({
        target: selectRef.current,
        currentTarget: selectRef.current,
        preventDefault: () => {},
        stopPropagation: () => {},
        nativeEvent: event,
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: true,
        timeStamp: Date.now(),
        type: 'change',
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
      } as unknown as React.ChangeEvent<HTMLSelectElement>);
    }
    
    setSelectedOption(option);
    setShowCustomDropdown(false);
  };
  
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      
      {/* Hidden native select (for form submission) */}
      <select
        ref={selectRef}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="sr-only"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom select UI */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          onClick={() => setShowCustomDropdown(!showCustomDropdown)}
        >
          <div className="flex justify-between items-center">
            <span>{selectedOption?.label || 'Select an option'}</span>
            <svg 
              className={`h-5 w-5 text-slate-500 transition-transform ${showCustomDropdown ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {showCustomDropdown && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
            <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
              {options.map(option => (
                <li
                  key={option.value}
                  className={`cursor-pointer select-none px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 ${
                    option.value === value 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyledSelect;