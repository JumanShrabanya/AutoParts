export default function CategoryCards({
  categories,
  selectedCategory,
  handleCategorySelect,
}) {
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
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedCategory === category.id
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : ""
              }`}
            >
              <div
                className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.count} parts</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
