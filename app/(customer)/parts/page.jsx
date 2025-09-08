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

  // Fetch categories and brands on component mount and when category changes
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    
    // If there's a selected category, fetch its parts
    if (selectedCategory) {
      fetchPartsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

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
  
  const fetchPartsByCategory = async (categoryId) => {
    try {
      setIsSearching(true);
      const response = await fetch(`/api/categories/${categoryId}/parts`);
      const data = await response.json();
      if (data.data) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch parts by category:", error);
    } finally {
      setIsSearching(false);
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

  const handleCategorySelect = async (categoryId) => {
    try {
      // Toggle category selection
      const newCategoryId = selectedCategory === categoryId ? "" : categoryId;
      setSelectedCategory(newCategoryId);
      
      // Clear other filters
      setSearchQuery("");
      setBrand("");
      setPriceRange([0, 10000]);
      
      // If no category is selected, clear results and return
      if (!newCategoryId) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      
      // Try fetching parts using category-specific endpoint
      const response = await fetch(`/api/categories/${newCategoryId}/parts`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const parts = Array.isArray(data.data) ? data.data : [];
        setSearchResults(parts);
        
        // If no parts found, try the search endpoint as fallback
        if (parts.length === 0) {
          await fetchPartsBySearch(newCategoryId);
        } else {
          scrollToResults();
        }
      } else {
        // Fallback to search endpoint
        await fetchPartsBySearch(newCategoryId);
      }
    } catch (error) {
      console.error("Error in handleCategorySelect:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const fetchPartsBySearch = async (categoryId) => {
    try {
      const params = new URLSearchParams();
      params.append("category", categoryId);
      params.append("limit", "50");

      const response = await fetch(`/api/parts/search?${params.toString()}`);
      const data = await response.json();

      if (data.success && data.data?.parts) {
        setSearchResults(data.data.parts);
        scrollToResults();
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error in fetchPartsBySearch:", error);
      setSearchResults([]);
    }
  };
  
  const scrollToResults = () => {
    setTimeout(() => {
      const resultsSection = document.getElementById("search-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
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
      params.append("limit", "50");

      const response = await fetch(`/api/parts/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data.parts);
        if (data.data.parts.length > 0) {
          scrollToResults();
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
          onCategorySelect={handleCategorySelect}
        />

        {/* Search Results Section */}
        {searchResults.length > 0 ? (
          <SearchResults searchResults={searchResults} />
        ) : isSearching ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading parts...</p>
          </div>
        ) : selectedCategory ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No parts found in this category.</p>
            <button
              onClick={() => setSelectedCategory("")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Clear Category
            </button>
          </div>
        ) : searchQuery || brand || priceRange[0] > 0 || priceRange[1] < 10000 ? (
          <NoResults
            onReset={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setBrand("");
              setPriceRange([0, 10000]);
            }}
          />
        ) : (
          <StartSearch />
        )}

        {/* Start Your Search Section */}
        {/* {searchResults.length === 0 &&
          !searchQuery &&
          !selectedCategory &&
          !brand &&
          priceRange[0] === 0 &&
          priceRange[1] === 10000 && (
            <StartSearch
              setShowAdvancedSearch={setShowAdvancedSearch}
              handleBrowseAll={handleBrowseAll}
            />
          )} */}
      </div>
    </div>
  );
}
