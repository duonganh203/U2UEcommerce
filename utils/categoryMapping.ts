// Category mapping: English value -> Vietnamese label
export const categoryLabels: Record<string, string> = {
   All: "Tất cả",
   Electronics: "Điện tử",
   Fashion: "Thời trang",
   "Home & Living": "Nhà cửa & Đời sống",
   "Sports & Outdoors": "Thể thao & Ngoài trời",
   "Books & Education": "Sách & Giáo dục",
   "Toys & Games": "Đồ chơi & Trò chơi",
   "Beauty & Health": "Làm đẹp & Sức khỏe",
   "Automotive & Motorcycles": "Ô tô & Xe máy",
   "Art & Collectibles": "Nghệ thuật & Sưu tầm",
   Other: "Khác",
};

// Available categories for selection (excluding "All")
export const availableCategories = [
   "Electronics",
   "Fashion",
   "Home & Living",
   "Sports & Outdoors",
   "Books & Education",
   "Toys & Games",
   "Beauty & Health",
   "Automotive & Motorcycles",
   "Art & Collectibles",
   "Other",
];

// All categories including "All"
export const allCategories = ["All", ...availableCategories];

// Helper function to get Vietnamese label
export const getCategoryLabel = (category: string): string => {
   return categoryLabels[category] || category;
};

// Helper function to get English value from Vietnamese label
export const getCategoryValue = (label: string): string => {
   const entry = Object.entries(categoryLabels).find(
      ([_, vietnameseLabel]) => vietnameseLabel === label
   );
   return entry ? entry[0] : label;
};
