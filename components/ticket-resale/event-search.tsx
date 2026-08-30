"use client";

import { useState } from "react";
import { Search } from "lucide-react";

/**
 * Uncontrolled input, committed on submit rather than on every keystroke —
 * the parent only needs to know the query once the user actually searches.
 */
export function EventSearch({
  onSearch,
  placeholder,
}: {
  onSearch: (query: string) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
      className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-ds-pill border border-canvas-border bg-surface py-1.5 pl-5 pr-1.5 shadow-[0_20px_45px_-30px_rgba(23,23,22,0.28)] transition-shadow duration-300 focus-within:border-champagne/50"
    >
      <Search className="h-4 w-4 shrink-0 text-taupe" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.9375rem] text-canvas-text placeholder:text-taupe/70 focus:outline-none"
      />
      <button type="submit" className="ds-btn-primary shrink-0">
        Search
      </button>
    </form>
  );
}
