import React from "react";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import TextArea from "../atoms/TextArea";
import Label from "../atoms/Label";
import HeadlessInput from "../atoms/headlessUI/HeadlessInput";

const FormField = ({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  options = [],
  rows = 4,
  ...rest
}) => {
  const renderInput = () => {
    if (type === "textarea") {
      return (
        <TextArea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          {...rest}
        />
      );
    }
    
    if (type === "select") {
      return (
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[var(--color-bg-secondary)]">
              {option.label}
            </option>
          ))}
        </Select>
      );
    }
    
    return (
      <HeadlessInput
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    );
  };

  return (
    <div className="flex items-center gap-4">
      {label && Icon && (
        <div className="flex items-center gap-2 text-[var(--color-text-secondary)] w-[140px] flex-shrink-0">
          <Icon size={16} />
          <label htmlFor={name} className="uppercase tracking-wide font-semibold text-xs select-none">
            {label}
          </label>
        </div>
      )}
      <div className="flex-1">
        {renderInput()}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;