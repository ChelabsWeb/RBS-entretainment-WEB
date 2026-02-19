"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Search, X, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Movie, searchMovie, searchLicensedMovies, getImageUrl } from "@/lib/tmdb";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsLoadingSuggestions(true);
        try {
          const results = await searchLicensedMovies(searchQuery);
          setSuggestions(results.slice(0, 5));
        } catch (error) {
          console.error("Suggestions error:", error);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && (suggestions.length > 0 || isLoadingSuggestions)) {
      router.push(`/peliculas?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const isDarkText = theme.text === "#000000";
  const logoSrc = isDarkText 
    ? "/assets/Logos/RBS logo negro.png" 
    : "/assets/Logos/RBS logo blanco footer.png";

  return (
    <header className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="relative flex flex-col w-full max-w-2xl pointer-events-auto">
        <div 
          className="absolute inset-0 -z-10 rounded-sm transition-colors duration-500 shadow-2xl"
          style={{ backgroundColor: theme.primary }}
        />

        <div className="flex h-12 w-full items-center justify-between px-4 relative" style={{ color: theme.text }}>
          {/* Menu Button - Hidden when search is open */}
          <div className={clsx(
            "flex items-center transition-all duration-300 z-10",
            isSearchOpen ? "w-0 opacity-0 pointer-events-none" : "w-10 opacity-100"
          )}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 hover:opacity-70 transition-opacity">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          {/* Logo - Hidden when search is open */}
          <div className={clsx(
            "flex-1 flex justify-center transition-all duration-300 z-10",
            isSearchOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
          )}>
            <Link href="/" className="relative h-10 w-48 cursor-pointer flex items-center justify-center">
              <Image 
                src={logoSrc} 
                alt="RBS Entertainment" 
                fill 
                className={clsx(
                  "object-contain",
                  isDarkText ? "scale-140 translate-y-[2px]" : "scale-100"
                )}
                priority
              />
            </Link>
          </div>
          
          {/* Search Container - Centered when open */}
          <div className={clsx(
            "absolute inset-x-0 mx-auto flex items-center justify-center transition-all duration-500 pointer-events-none z-20",
            isSearchOpen ? "w-[80%] max-w-md opacity-100" : "w-0 opacity-0"
          )}>
            <div className={clsx(
              "flex items-center bg-black/5 rounded-full px-4 py-2 transition-all duration-500 h-9 relative pointer-events-auto",
              isSearchOpen ? "w-full" : "w-0 overflow-hidden"
            )}>
              <form onSubmit={handleSearch} className="flex items-center w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="BUSCAR PELÍCULA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-black tracking-[0.2em] focus:ring-0 w-full placeholder:text-current/30 uppercase outline-none text-center"
                />
              </form>

              {/* Suggestions Dropdown */}
              {isSearchOpen && (searchQuery.length > 1) && (suggestions.length > 0 || isLoadingSuggestions) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-[60]">
                  {isLoadingSuggestions ? (
                    <div className="p-4 flex justify-center">
                      <Loader2 className="h-5 w-5 text-theme-primary animate-spin" />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {suggestions.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => {
                            router.push(`/peliculas?q=${encodeURIComponent(movie.title)}`);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors text-left group"
                        >
                          <div className="relative h-12 w-8 flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={getImageUrl(movie.poster_path, 'w92')}
                              alt={movie.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-[10px] font-black tracking-widest uppercase text-white group-hover:text-theme-primary transition-colors truncate">
                              {movie.title}
                            </span>
                            <span className="text-[8px] font-bold text-white/30 truncate">
                              {movie.release_date?.split('-')[0]}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search/Close Button */}
          <div className="flex items-center z-30">
            <button 
              onClick={() => {
                if (isSearchOpen) {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSuggestions([]);
                } else {
                  setIsSearchOpen(true);
                }
              }}
              className="p-2 hover:opacity-70 transition-opacity"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={clsx(
          "fixed inset-0 z-[100] bg-black transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            {[
              { name: "INICIO", href: "/" },
              { name: "PELÍCULAS", href: "/peliculas" },
              { name: "LICENCIAS", href: "/licensing" },
              { name: "QUIÉNES SOMOS", href: "/about" },
              { name: "CONTACTO", href: "/contact" }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-white hover:text-theme-primary transition-all duration-300 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}
