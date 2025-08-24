"use client";

import { useState, useEffect } from "react";
import {
  HeroSection,
  SearchSection,
  CategoryCards,
  SearchResults,
  NoResults,
  StartSearch,
  defaultCategoryIcons,
  defaultCategoryColors,
} from "@/components/Partspage";

export default function PartsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [brand, setBrand] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // API data states
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);

  // Fetch categories and brands on component mount
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchBrands = async () => {
    try {
      setIsLoadingBrands(true);
      const response = await fetch("/api/brands");
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      if (selectedCategory) params.append("category", selectedCategory);
      if (brand) params.append("brand", brand);
      if (priceRange[0] > 0) params.append("minPrice", priceRange[0]);
      if (priceRange[1] < 10000) params.append("maxPrice", priceRange[1]);
      params.append("limit", "50"); // Show more results

      const response = await fetch(`/api/parts/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data.parts);

        // Scroll to results section after search
        if (data.data.parts.length > 0) {
          setTimeout(() => {
            const resultsSection = document.getElementById("search-results");
            if (resultsSection) {
              resultsSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }
      } else {
        console.error("Search failed:", data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySelect = async (categoryId) => {
    const newCategory = categoryId === selectedCategory ? "" : categoryId;
    setSelectedCategory(newCategory);

    // Auto-search when category is selected
    if (newCategory) {
      setSearchQuery("");
      setBrand("");
      setPriceRange([0, 10000]);

      try {
        setIsSearching(true);
        const params = new URLSearchParams();
        params.append("category", newCategory);
        params.append("limit", "50");

        const response = await fetch(`/api/parts/search?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setSearchResults(data.data.parts);

          // Scroll to results section after category selection
          if (data.data.parts.length > 0) {
            setTimeout(() => {
              const resultsSection = document.getElementById("search-results");
              if (resultsSection) {
                resultsSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          }
        }
      } catch (error) {
        console.error("Category search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleBrowseAll = async () => {
    try {
      setIsSearching(true);
      const response = await fetch("/api/parts/search?limit=50");
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data.parts);
        setSearchQuery("");
        setSelectedCategory("");
        setBrand("");
        setPriceRange([0, 10000]);
      }
    } catch (error) {
      console.error("Browse all error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setBrand("");
    setPriceRange([0, 10000]);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          brand={brand}
          setBrand={setBrand}
          showAdvancedSearch={showAdvancedSearch}
          setShowAdvancedSearch={setShowAdvancedSearch}
          categories={categories}
          brands={brands}
          handleSearch={handleSearch}
          isSearching={isSearching}
          isLoadingCategories={isLoadingCategories}
          isLoadingBrands={isLoadingBrands}
        />

        <CategoryCards
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
        />

        {/* Search Results Section */}
        {searchResults.length > 0 && (
          <SearchResults
            searchResults={searchResults}
            categories={categories}
            clearSearch={clearSearch}
            isLoading={isSearching}
          />
        )}

        {/* No Results Message */}
        {searchResults.length === 0 &&
          (searchQuery ||
            selectedCategory ||
            brand ||
            priceRange[0] > 0 ||
            priceRange[1] < 10000) && <NoResults clearSearch={clearSearch} />}

        {/* Start Your Search Section (when no search has been performed) */}
        {searchResults.length === 0 &&
          !searchQuery &&
          !selectedCategory &&
          !brand &&
          priceRange[0] === 0 &&
          priceRange[1] === 10000 && (
            <StartSearch
              setShowAdvancedSearch={setShowAdvancedSearch}
              handleBrowseAll={handleBrowseAll}
            />
          )}
      </div>
    </div>
  );
}
