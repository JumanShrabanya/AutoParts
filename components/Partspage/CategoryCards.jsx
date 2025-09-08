import { defaultCategoryIcons, defaultCategoryColors } from "./data";

export default function CategoryCards({ categories, selectedCategory, onCategorySelect }) {
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
          Select a category to explore our wide range of automotive parts
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.name);
          const color = getCategoryColor(category.name);

          const isSelected = selectedCategory === category._id;
          
          return (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category._id)}
              className={`group block w-full text-left ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="h-full relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <IconComponent className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
