// API utility functions for products
export interface Product {
   _id: string;
   name: string;
   description: string;
   price: number;
   category: string;
   brand: string;
   images: string[];
   countInStock: number;
   rating: number;
   numReviews: number;
   reviews?: Review[];
   createdAt: string;
   updatedAt: string;
}

export interface Review {
   _id: string;
   user: {
      _id: string;
      name: string;
      email: string;
   };
   rating: number;
   comment: string;
   createdAt: string;
}

export interface ProductsResponse {
   success: boolean;
   data: Product[];
   pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
   };
}

export interface ProductResponse {
   success: boolean;
   data: Product;
}

// Fetch all products with optional filters
export async function fetchProducts(params?: {
   page?: number;
   limit?: number;
   category?: string;
   brand?: string;
   search?: string;
   sort?: string;
   order?: "asc" | "desc";
}): Promise<ProductsResponse> {
   const searchParams = new URLSearchParams();

   if (params?.page) searchParams.set("page", params.page.toString());
   if (params?.limit) searchParams.set("limit", params.limit.toString());
   if (params?.category) searchParams.set("category", params.category);
   if (params?.brand) searchParams.set("brand", params.brand);
   if (params?.search) searchParams.set("search", params.search);
   if (params?.sort) searchParams.set("sort", params.sort);
   if (params?.order) searchParams.set("order", params.order);

   const url = `/api/products${
      searchParams.toString() ? "?" + searchParams.toString() : ""
   }`;

   const response = await fetch(url);

   if (!response.ok) {
      throw new Error("Failed to fetch products");
   }

   return response.json();
}

// Fetch single product by ID
export async function fetchProductById(id: string): Promise<ProductResponse> {
   const response = await fetch(`/api/products/${id}`);

   if (!response.ok) {
      throw new Error("Failed to fetch product");
   }

   return response.json();
}

// Transform API product to UI format for backward compatibility
export function transformProductForUI(product: Product) {
   return {
      id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.price * 1.2, // Assume 20% discount for UI
      discount: 20,
      rating: product.rating,
      reviewCount: product.numReviews,
      image: product.images[0] || "",
      images: product.images,
      category: product.category,
      inStock: product.countInStock > 0,
      stockCount: product.countInStock,
      description: product.description,
      reviews: product.reviews || [],
   };
}
