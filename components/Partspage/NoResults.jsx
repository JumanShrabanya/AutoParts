import { Search } from "lucide-react";

export default function NoResults({ clearSearch }) {
  return (
    <div className="text-center py-16">
      <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          No Results Found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Try adjusting your search criteria or browse by category to find what
          you're looking for
        </p>
        <button
          onClick={clearSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Search
        </button>
      </div>
    </div>
  );
}
