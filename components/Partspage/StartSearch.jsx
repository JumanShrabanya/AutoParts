import { Search } from "lucide-react";

export default function StartSearch({
  setShowAdvancedSearch,
  setSearchResults,
  dummyParts,
  setSearchQuery,
  setSelectedCategory,
  setBrand,
  setPriceRange,
}) {
  const handleBrowseAll = () => {
    setSearchResults(dummyParts);
    setSearchQuery("");
    setSelectedCategory("");
    setBrand("");
    setPriceRange([0, 10000]);
  };

  return (
    <div className="text-center py-16">
      <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Start Your Search
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Use the search bar above to find specific parts, or browse by category
          to discover new options
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowAdvancedSearch(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Advanced Search
          </button>
          <button
            onClick={handleBrowseAll}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Browse All Parts
          </button>
        </div>
      </div>
    </div>
  );
}
