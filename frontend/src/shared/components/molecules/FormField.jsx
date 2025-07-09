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
          options={options}
          placeholder={placeholder}
          {...rest}
        />
      );
    }
    
    return (
      <Input
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
    <div className="mb-4">
      {label && (
        <Label htmlFor={name}>
          {label}
        </Label>
      )}
      
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
            <Icon size={18} />
          </span>
        )}
        <div className="flex-1">
          {renderInput()}
        </div>
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