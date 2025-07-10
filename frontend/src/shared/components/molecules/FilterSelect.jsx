import React from 'react'
import Select from "../atoms/Select";
import Label from "../atoms/Label";
function FilterSelect({ label, id, value, onChange, options }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text)]">{label}</Label>
      <Select id={id} value={value} onChange={onChange}>
        <option>All</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.label}>{opt.label}</option>
        ))}
      </Select>
    </div>
  )
}

export default FilterSelect