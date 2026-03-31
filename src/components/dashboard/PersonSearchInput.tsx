"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { X, Search, Loader2 } from "lucide-react";
import Image from "next/image";

interface Person {
  id: number;
  name: string;
  photo: string | null;
  department: string;
}

interface PersonSearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mode: "single" | "multi";
  placeholder?: string;
}

export function PersonSearchInput({
  label,
  value,
  onChange,
  mode,
  placeholder,
}: PersonSearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = mode === "multi"
    ? value.split(",").map((n) => n.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/search-person?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectPerson = (person: Person) => {
    if (mode === "single") {
      onChange(person.name);
      setQuery("");
    } else {
      if (!selected.includes(person.name)) {
        const newList = [...selected, person.name];
        onChange(newList.join(", "));
      }
      setQuery("");
    }
    setShowDropdown(false);
    setResults([]);
  };

  const removePerson = (name: string) => {
    const newList = selected.filter((n) => n !== name);
    onChange(newList.join(", "));
  };

  const inputClass =
    "bg-black border-white/10 text-white placeholder:text-white/40 focus:border-[#4f5ea7] focus:ring-[#4f5ea7]";

  return (
    <div ref={containerRef} className="relative space-y-2">
      <label className="text-white/80 text-sm font-medium">{label}</label>

      {/* Selected tags (multi mode) */}
      {mode === "multi" && selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1 bg-[#4f5ea7]/20 text-[#4f5ea7] text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {name}
              <button
                type="button"
                onClick={() => removePerson(name)}
                className="hover:text-white transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <Input
          value={mode === "single" && !showDropdown ? value : query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (mode === "single") onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (mode === "single") setQuery(value);
            if (results.length > 0) setShowDropdown(true);
          }}
          className={`${inputClass} pl-9`}
          placeholder={placeholder || `Buscar ${label.toLowerCase()}...`}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 animate-spin" />
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-md shadow-xl max-h-64 overflow-y-auto">
          {results.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => selectPerson(person)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
            >
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-bold">
                    {person.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{person.name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  {person.department === "Acting" ? "Actor/Actriz" :
                   person.department === "Directing" ? "Director/a" :
                   person.department || ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
