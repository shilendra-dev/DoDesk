import React from "react";
import { Search } from "lucide-react";
import Input from "../atoms/Input";
import Label from "../atoms/Label";
import HeadlessButton from "../atoms/headlessUI/HeadlessButton";
import HeadlessInput from "../atoms/headlessUI/HeadlessInput";


function SearchBar() {
  return (
    <div className="grow h-fit">
      <form>
        <Label htmlFor="default-search" className="sr-only" />

        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="text-[var(--color-text)] mrs-4" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <HeadlessInput
              type="search"
              id="default-search"
              className="bg-[var(--color-bg-secondary)] border-b-gray-950 dark:border-[var(--color-border)] dark:bg-[var(--color-bg-secondary)] focus:border-[var(--color-accent)] focus:outline-none dark:focus:border-[var(--color-accent)] border-0.5 rounded-lg pl-10 pr-4 text-sm"
              placeholder="Search in workspace..."
              required
            />
            <HeadlessButton
              className=""
              type="submit"
            >
              Search
            </HeadlessButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
