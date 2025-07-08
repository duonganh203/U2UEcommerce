"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
   ShoppingBag,
   Star,
   Shield,
   Truck,
   ArrowRight,
   Heart,
   Search,
   User,
   Menu,
} from "lucide-react";

export default function Home() {
   const { data: session, status } = useSession();
   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background">
         {/* Hero Section */}
         <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                     <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                        Khám phá những sản phẩm tuyệt vời cho phong cách sống của bạn
                     </h1>
                     <p className="text-xl mb-8 text-primary-foreground/80">
                        Mua sắm hàng ngàn sản phẩm với giao hàng nhanh, thanh toán an toàn và giá cả cạnh tranh.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                           href="/products"
                           className="bg-background text-primary px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors inline-flex items-center justify-center shadow-lg"
                        >
                           Mua ngay
                           <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>{" "}
                        <Link
                           href="/deals"
                           className="border-2 border-background text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background hover:text-primary transition-colors inline-flex items-center justify-center"
                        >
                           Xem ưu đãi
                        </Link>
                     </div>
                  </div>
                  <div className="relative">
                     <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-primary-foreground/20 rounded-lg p-4 backdrop-blur-sm">
                              <Image
                                 src="https://png.pngtree.com/png-clipart/20201208/original/pngtree-premium-quality-gold-label-png-image_5506471.jpg"
                                 alt="Premium Quality Gold Label"
                                 width="100"
                                 height="100"
                                 className="w-12 h-12 bg-primary-foreground/30 rounded-lg mb-3"
                              />
                              <h3 className="font-semibold mb-2">
                                 Chất lượng cao cấp
                              </h3>
                              <p className="text-sm text-primary-foreground/80">
                                 Sản phẩm được chọn lọc kỹ lưỡng
                              </p>
                           </div>
                           <div className="bg-primary-foreground/20 rounded-lg p-4 backdrop-blur-sm">
                              <Image
                                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdouSRQTfKW_fCZrsHIAbOsA5uNdSyI3sQFg&s"
                                 alt="Premium Quality Gold Label"
                                 width="100"
                                 height="100"
                                 className="w-12 h-12 bg-primary-foreground/30 rounded-lg mb-3"
                              />
                              <h3 className="font-semibold mb-2">
                                 Giao hàng nhanh chóng
                              </h3>
                              <p className="text-sm text-primary-foreground/80">
                                 Miễn phí vận chuyển toàn quốc
                              </p>
                           </div>
                           <div className="bg-primary-foreground/20 rounded-lg p-4 backdrop-blur-sm">
                              <Image
                                 alt="Premium Quality Gold Label"
                                 width="100"
                                 height="100"
                                 src="https://toppng.com/uploads/preview/if-you-have-any-questions-about-an-invoice-or-a-payment-secure-payment-logo-11563520223os4f9stg3c.png"
                                 className="w-12 h-12 bg-primary-foreground/30 rounded-lg mb-3"
                              />
                              <h3 className="font-semibold mb-2">
                                 Thanh toán an toàn
                              </h3>
                              <p className="text-sm text-primary-foreground/80">
                                 Giao dịch 100% bảo mật
                              </p>
                           </div>
                           <div className="bg-primary-foreground/20 rounded-lg p-4 backdrop-blur-sm">
                              <Image
                                 alt="Premium Quality Gold Label"
                                 width="100"
                                 height="100"
                                 src="https://img.freepik.com/premium-vector/24x7-design_1169008-876.jpg"
                                 className="w-12 h-12 bg-primary-foreground/30 rounded-lg mb-3"
                              />
                              <h3 className="font-semibold mb-2">
                                 Hỗ trợ 24/7
                              </h3>
                              <p className="text-sm text-primary-foreground/80">
                                 Luôn sẵn sàng hỗ trợ bạn
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>{" "}
         {/* Features Section */}
         <section className="py-20 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                     Vì sao chọn U2U?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                     Chúng tôi giúp việc mua sắm trực tuyến trở nên dễ dàng, an toàn và thú vị với cam kết về chất lượng và dịch vụ.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-8 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Truck className="h-8 w-8 text-primary" />
                     </div>
                     <h3 className="text-xl font-semibold text-foreground mb-4">
                        Miễn phí vận chuyển
                     </h3>
                     <p className="text-muted-foreground">
                        Miễn phí vận chuyển toàn quốc cho đơn hàng từ 50.000đ. Giao hàng nhanh chóng, đáng tin cậy.
                     </p>
                  </div>

                  <div className="text-center p-8 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="h-8 w-8 text-primary" />
                     </div>
                     <h3 className="text-xl font-semibold text-foreground mb-4">
                        Mua sắm an toàn
                     </h3>
                     <p className="text-muted-foreground">
                        Thông tin cá nhân và thanh toán của bạn luôn được bảo vệ với bảo mật cấp ngân hàng.
                     </p>
                  </div>

                  <div className="text-center p-8 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="h-8 w-8 text-primary" />
                     </div>
                     <h3 className="text-xl font-semibold text-foreground mb-4">
                        Đảm bảo chất lượng
                     </h3>
                     <p className="text-muted-foreground">
                        Tất cả sản phẩm đều được đảm bảo chất lượng. Không hài lòng? Hoàn tiền ngay.
                     </p>
                  </div>
               </div>
            </div>
         </section>{" "}
         {/* Featured Products */}
         <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                     Sản phẩm nổi bật
                  </h2>
                  <p className="text-xl text-muted-foreground">
                     Khám phá những sản phẩm xu hướng được chọn lọc
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((item) => (
                     <div key={item} className="group cursor-pointer">
                        <div className="bg-muted rounded-lg aspect-square mb-4 overflow-hidden border border-border">
                           <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 group-hover:scale-105 transition-transform duration-300"></div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">
                           Sản phẩm cao cấp {item}
                        </h3>
                        <p className="text-muted-foreground mb-2">
                           Mô tả sản phẩm chất lượng cao
                        </p>
                        <div className="flex items-center justify-between">
                           <span className="text-xl font-bold text-primary">
                              2.400.000₫
                           </span>
                           <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-muted-foreground ml-1">
                                 4.8
                              </span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="text-center mt-12">
                  <Link
                     href="/products"
                     className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center shadow-lg"
                  >
                     Xem tất cả sản phẩm
                     <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
               </div>
            </div>
         </section>{" "}
         {/* Testimonials */}
         <section className="py-20 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                     Khách hàng nói gì về chúng tôi
                  </h2>
                  <p className="text-xl text-muted-foreground">
                     Tham gia cùng hàng ngàn khách hàng hài lòng trên toàn thế giới
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     {
                        name: "Hưng Nguyễn",
                        review:
                           "Chất lượng tuyệt vời và giao hàng nhanh! Tôi đã mua sắm ở đây nhiều lần và luôn hài lòng.",
                        rating: 5,
                     },
                     {
                        name: "Đại Du",
                        review:
                           "Dịch vụ khách hàng tốt, giá cả cạnh tranh. Rất khuyến khích mọi người mua sắm tại đây.",
                        rating: 5,
                     },
                     {
                        name: "Tiến Tụt",
                        review:
                           "Yêu thích sự đa dạng sản phẩm và website dễ sử dụng. Mua sắm ở đây thật tuyệt vời!",
                        rating: 5,
                     },
                  ].map((testimonial, index) => (
                     <div
                        key={index}
                        className="bg-card p-8 rounded-xl shadow-sm border border-border"
                     >
                        <div className="flex items-center mb-4">
                           {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                 key={i}
                                 className="h-5 w-5 text-yellow-400 fill-current"
                              />
                           ))}
                        </div>
                        <p className="text-muted-foreground mb-6">
                           "{testimonial.review}"
                        </p>
                        <div className="flex items-center">
                           <div className="w-12 h-12 bg-muted rounded-full mr-4"></div>
                           <div>
                              <h4 className="font-semibold text-foreground">
                                 {testimonial.name}
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                 Khách hàng xác thực
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>{" "}
         {/* Newsletter */}
         <section className="py-20 bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                  Nhận thông tin ưu đãi mới nhất
               </h2>
               <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                  Đăng ký nhận bản tin để không bỏ lỡ sản phẩm mới, ưu đãi độc quyền và khuyến mãi hấp dẫn.
               </p>
               <div className="max-w-md mx-auto flex gap-4">
                  <input
                     type="email"
                     placeholder="Enter your email"
                     className="flex-1 px-4 py-3 rounded-lg text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button className="bg-card text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors border border-border">
                     Đăng ký
                  </button>
               </div>
            </div>
         </section>{" "}
         {/* Footer */}
         <footer className="bg-card text-foreground py-16 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                     <div className="flex items-center space-x-2 mb-6">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold">ShopHub</span>
                     </div>
                     <p className="text-muted-foreground mb-6">
                        Điểm đến mua sắm trực tuyến đáng tin cậy cho sản phẩm chất lượng và dịch vụ xuất sắc.
                     </p>
                     <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 cursor-pointer">
                           <span className="text-sm">f</span>
                        </div>
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 cursor-pointer">
                           <span className="text-sm">t</span>
                        </div>
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 cursor-pointer">
                           <span className="text-sm">in</span>
                        </div>
                     </div>
                  </div>
                  <div>
                     <h3 className="text-lg font-semibold mb-6">Liên kết nhanh</h3>
                     <ul className="space-y-3">
                        {" "}
                        <li>
                           <Link
                              href="/products"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Tất cả sản phẩm
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/categories"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Danh mục
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/deals"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Ưu đãi đặc biệt
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/new-arrivals"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Hàng mới về
                           </Link>
                        </li>
                     </ul>
                  </div>{" "}
                  <div>
                     <h3 className="text-lg font-semibold mb-6">
                       Dịch vụ khách hàng
                     </h3>
                     <ul className="space-y-3">
                        <li>
                           <Link
                              href="/contact"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Liên hệ
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/shipping"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Thông tin vận chuyển
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/returns"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Đổi trả
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/faq"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Câu hỏi thường gặp
                           </Link>
                        </li>
                     </ul>
                  </div>
                  <div>
                     <h3 className="text-lg font-semibold mb-6">Tài khoản</h3>
                     <ul className="space-y-3">
                        <li>
                           <Link
                              href="/login"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Đăng nhập
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/signup"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Tạo tài khoản
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/profile"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Tài khoản của tôi
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/orders"
                              className="text-muted-foreground hover:text-primary transition-colors"
                           >
                              Lịch sử đơn hàng
                           </Link>
                        </li>
                     </ul>
                  </div>
               </div>{" "}
               <div className="border-t border-border mt-12 pt-8 text-center">
                  <p className="text-muted-foreground">
                      © 2025 ShopHub. Đã đăng ký bản quyền. | Chính sách bảo mật | Điều khoản dịch vụ
                  </p>
               </div>
            </div>
         </footer>
      </div>
   );
}
