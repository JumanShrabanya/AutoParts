import { defaultCategoryIcons, defaultCategoryColors } from "./data";

export default function CategoryCards({
  categories,
  selectedCategory,
  handleCategorySelect,
}) {
  const getCategoryIcon = (categoryName) => {
    // Try to find a matching icon from the category name
    const categoryKey = categoryName.toLowerCase().replace(/\s+/g, "");
    for (const [key, IconComponent] of Object.entries(defaultCategoryIcons)) {
      if (categoryKey.includes(key)) {
        return IconComponent;
      }
    }
    // Fallback to first icon if no match found
    return Object.values(defaultCategoryIcons)[0];
  };

  const getCategoryColor = (categoryName) => {
    // Try to find a matching color from the category name
    const categoryKey = categoryName.toLowerCase().replace(/\s+/g, "");
    for (const [key, color] of Object.entries(defaultCategoryColors)) {
      if (categoryKey.includes(key)) {
        return color;
      }
    }
    // Fallback to first color if no match found
    return Object.values(defaultCategoryColors)[0];
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Loading categories...
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl p-6 h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Browse by Category
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our comprehensive collection of automotive parts organized by
          category
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.name);
          const colorClass = getCategoryColor(category.name);

          return (
            <div
              key={category._id}
              onClick={() => handleCategorySelect(category._id)}
              className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedCategory === category._id
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : ""
              }`}
            >
              <div
                className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-white/80 text-sm">
                  {category.description || "Auto parts"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
