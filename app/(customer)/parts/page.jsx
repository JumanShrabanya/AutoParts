"use client";

import { useState } from "react";
import {
  HeroSection,
  SearchSection,
  CategoryCards,
  SearchResults,
  NoResults,
  StartSearch,
  categories,
  brands,
  dummyParts,
} from "@/components/Partspage";

export default function PartsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [brand, setBrand] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate API delay
    setTimeout(() => {
      let filteredResults = [...dummyParts];

      // Filter by search query
      if (searchQuery.trim()) {
        filteredResults = filteredResults.filter(
          (part) =>
            part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            part.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            part.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory) {
        filteredResults = filteredResults.filter(
          (part) => part.category === selectedCategory
        );
      }

      // Filter by brand
      if (brand) {
        filteredResults = filteredResults.filter(
          (part) => part.brand === brand
        );
      }

      // Filter by price range
      filteredResults = filteredResults.filter(
        (part) => part.price >= priceRange[0] && part.price <= priceRange[1]
      );

      setSearchResults(filteredResults);
      setIsSearching(false);

      // Scroll to results section after search
      if (filteredResults.length > 0) {
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
    }, 500);
  };

  const handleCategorySelect = (categoryId) => {
    const newCategory = categoryId === selectedCategory ? "" : categoryId;
    setSelectedCategory(newCategory);

    // Auto-search when category is selected
    if (newCategory) {
      setSearchQuery("");
      setBrand("");
      setPriceRange([0, 10000]);

      setTimeout(() => {
        const filteredResults = dummyParts.filter(
          (part) => part.category === newCategory
        );
        setSearchResults(filteredResults);

        // Scroll to results section after category selection
        if (filteredResults.length > 0) {
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
      }, 300);
    } else {
      setSearchResults([]);
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
              setSearchResults={setSearchResults}
              dummyParts={dummyParts}
              setSearchQuery={setSearchQuery}
              setSelectedCategory={setSelectedCategory}
              setBrand={setBrand}
              setPriceRange={setPriceRange}
            />
          )}
      </div>
    </div>
  );
}
