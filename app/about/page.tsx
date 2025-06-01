export default function AboutPage() {
   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
         <div className="container mx-auto px-4 py-16 max-w-4xl">
            {/* Hero Section */}
            <div className="text-center mb-16">
               <h1 className="text-5xl font-bold text-foreground mb-6">
                  About Our Marketplace
               </h1>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Connecting buyers and sellers in a trusted, easy-to-use
                  platform where great deals meet great experiences.
               </p>
            </div>

            {/* Mission Section */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border mb-12">
               <h2 className="text-3xl font-bold text-foreground mb-6">
                  Our Mission
               </h2>
               <p className="text-lg text-muted-foreground mb-6">
                  We believe everyone should have access to a simple, secure,
                  and efficient way to buy and sell items online. Our platform
                  empowers individuals and small businesses to reach customers,
                  discover unique products, and build meaningful connections
                  through commerce.
               </p>
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🛡️</span>
                     </div>
                     <h3 className="font-semibold text-foreground mb-2">
                        Secure & Safe
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        Advanced security measures to protect your transactions
                     </p>
                  </div>
                  <div className="text-center p-4">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🌟</span>
                     </div>
                     <h3 className="font-semibold text-foreground mb-2">
                        Quality First
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        Curated listings with detailed descriptions and reviews
                     </p>
                  </div>
                  <div className="text-center p-4">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🤝</span>
                     </div>
                     <h3 className="font-semibold text-foreground mb-2">
                        Community
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        Building trust through genuine connections and feedback
                     </p>
                  </div>
               </div>
            </div>

            {/* Features Section */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border mb-12">
               <h2 className="text-3xl font-bold text-foreground mb-6">
                  Why Choose Us?
               </h2>
               <div className="grid md:grid-cols-2 gap-8">
                  <div>
                     <h3 className="text-xl font-semibold text-foreground mb-3">
                        For Sellers
                     </h3>
                     <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full"></span>
                           Easy listing creation with drag-and-drop photos
                        </li>
                        <li className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full"></span>
                           Real-time analytics and performance tracking
                        </li>
                        <li className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full"></span>
                           Multiple shipping and payment options
                        </li>
                        <li className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full"></span>
                           Direct messaging with potential buyers
                        </li>
                     </ul>
                  </div>
                  <div>
                     <h3 className="text-xl font-semibold text-foreground mb-3">
                        For Buyers
                     </h3>
                     <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full"></span>
                           Advanced search and filtering options
                        </li>
                        <li className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full"></span>
                           Detailed product descriptions and photos
                        </li>
                        <li className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full"></span>
                           Secure payment processing and buyer protection
                        </li>
                        <li className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full"></span>
                           User reviews and seller ratings
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border mb-12">
               <h2 className="text-3xl font-bold text-foreground text-center mb-8">
                  Our Growing Community
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                     <div className="text-3xl font-bold text-primary mb-2">
                        10K+
                     </div>
                     <div className="text-sm text-muted-foreground">
                        Active Users
                     </div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-primary mb-2">
                        50K+
                     </div>
                     <div className="text-sm text-muted-foreground">
                        Items Sold
                     </div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-primary mb-2">
                        98%
                     </div>
                     <div className="text-sm text-muted-foreground">
                        Satisfaction Rate
                     </div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-primary mb-2">
                        24/7
                     </div>
                     <div className="text-sm text-muted-foreground">
                        Support Available
                     </div>
                  </div>
               </div>
            </div>

            {/* Contact Section */}
            <div className="bg-card rounded-2xl p-8 shadow-lg border text-center">
               <h2 className="text-3xl font-bold text-foreground mb-4">
                  Questions? We're Here to Help
               </h2>
               <p className="text-muted-foreground mb-6">
                  Our dedicated support team is ready to assist you with any
                  questions or concerns you might have.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="bg-muted/50 rounded-lg p-4">
                     <h3 className="font-semibold text-foreground mb-1">
                        Email Support
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        support@marketplace.com
                     </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                     <h3 className="font-semibold text-foreground mb-1">
                        Phone Support
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        1-800-MARKETPLACE
                     </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                     <h3 className="font-semibold text-foreground mb-1">
                        Live Chat
                     </h3>
                     <p className="text-sm text-muted-foreground">
                        Available 24/7
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
