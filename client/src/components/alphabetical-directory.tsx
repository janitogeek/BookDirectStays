import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface DirectoryItem {
  name: string;
  slug: string;
  count: number;
  href: string;
}

interface AlphabeticalDirectoryProps {
  title: string;
  description: string;
  items: DirectoryItem[];
  searchPlaceholder: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
}

export default function AlphabeticalDirectory({
  title,
  description,
  items,
  searchPlaceholder,
  emptyStateTitle,
  emptyStateDescription,
}: AlphabeticalDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get available letters (only letters that have content)
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    items.forEach(item => {
      const firstLetter = item.name.charAt(0).toUpperCase();
      letters.add(firstLetter);
    });
    return Array.from(letters).sort();
  }, [items]);
  
  // Start with first available letter, fallback to 'A'
  const [selectedLetter, setSelectedLetter] = useState<string>(() => {
    const letters = new Set<string>();
    items.forEach(item => {
      const firstLetter = item.name.charAt(0).toUpperCase();
      letters.add(firstLetter);
    });
    const sortedLetters = Array.from(letters).sort();
    return sortedLetters.length > 0 ? sortedLetters[0] : "A";
  });

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);


  // Filter items by selected letter
  const itemsByLetter = useMemo(() => {
    if (!selectedLetter) return filteredItems;
    return filteredItems.filter(item => 
      item.name.charAt(0).toUpperCase() === selectedLetter
    );
  }, [filteredItems, selectedLetter]);

  // Handle search input with smart letter switching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      const firstLetter = value.charAt(0).toUpperCase();
      if (firstLetter >= 'A' && firstLetter <= 'Z') {
        setSelectedLetter(firstLetter);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedLetter(availableLetters.length > 0 ? availableLetters[0] : "A");
  };

  return (
    <div className="space-y-8">
      {/* Title and Description */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-xl text-gray-600">{description}</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-10 py-3"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Alphabetical Frieze */}
      {availableLetters.length > 0 && (
        <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
          <div className="flex flex-wrap justify-center gap-2">
            {availableLetters.map((letter) => (
              <Button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                variant={selectedLetter === letter ? "default" : "outline"}
                size="sm"
                className="min-w-[40px] h-10 font-semibold"
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {itemsByLetter.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p>Try searching for a different term.</p>
              <Button 
                variant="outline" 
                onClick={clearSearch}
                className="mt-4"
              >
                Clear search
              </Button>
            </div>
          </div>
        ) : itemsByLetter.length === 0 && selectedLetter ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <h3 className="text-xl font-semibold mb-2">No {selectedLetter} entries found</h3>
              <p>Try selecting a different letter or clearing your search.</p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedLetter(availableLetters.length > 0 ? availableLetters[0] : "A")}
                className="mt-4"
              >
                Back to {availableLetters.length > 0 ? availableLetters[0] : "A"}
              </Button>
            </div>
          </div>
        ) : itemsByLetter.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <h3 className="text-xl font-semibold mb-2">{emptyStateTitle}</h3>
              <p>{emptyStateDescription}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {itemsByLetter.map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <Link 
                  href={item.href}
                  className="block p-4 text-center hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {item.count} {item.count === 1 ? 'host' : 'hosts'}
                    </Badge>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Message */}
      <div className="text-center pt-8">
        <p className="text-gray-600">
          Don't see what you're looking for? <Link href="/submit" className="text-blue-600 hover:underline">Add your host site</Link> and we'll include it!
        </p>
      </div>
    </div>
  );
}
