import React from 'react'

const sizeVariants = {
  sm: {
    container: "w-9 h-5",
    knob: "after:w-4 after:h-4 after:top-0.5 after:left-0.5 peer-checked:after:translate-x-4",
  },
  md: {
    container: "w-11 h-6",
    knob: "after:w-5 after:h-5 after:top-0.5 after:left-0.5 peer-checked:after:translate-x-5",
  },
  lg: {
    container: "w-14 h-8",
    knob: "after:w-6 after:h-6 after:top-1 after:left-1 peer-checked:after:translate-x-6",
  }
}

const Toggle = ({
  id,
  label,
  checked,
  onChange,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = sizeVariants[size] || sizeVariants["md"];

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={id} className = "flex items-center cursor-pointer">
        <input
          id = {id}
          type = "checkbox"
          className = "sr-only peer"
          checked = {checked}
          onChange = {onChange}
          {...props}
        />
        <div
          className={`relative ml-2 ${sizeClasses.container} rounded-full peer-focus:outline-none peer dark:bg-gray-700 
            peer-checked:bg-blue-600 transition duration-300 ${className}
            after:content-[''] after:absolute after:bg-white ${sizeClasses.knob} after:rounded-full after:transition-all`}
        ></div>
      </label>
      {label && (
        <span className="text-sm font-medium text-gray-300 select-none">{label}</span>
      )}
    </div>
  )
}

export default Toggle