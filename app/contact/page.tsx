"use client";

import { useState } from "react";
import {
   Mail,
   Phone,
   MessageCircle,
   MapPin,
   Clock,
   Send,
   CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "",
   });
   const [isSubmitted, setIsSubmitted] = useState(false);

   const handleInputChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Implement form submission logic
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
   };

   const contactMethods = [
      {
         icon: Mail,
         title: "Email Support",
         description: "Get help via email",
         detail: "support@marketplace.com",
         subDetail: "Response within 24 hours",
      },
      {
         icon: Phone,
         title: "Phone Support",
         description: "Speak with our team",
         detail: "1-800-MARKETPLACE",
         subDetail: "Mon-Fri, 9AM-6PM EST",
      },
      {
         icon: MessageCircle,
         title: "Live Chat",
         description: "Instant messaging support",
         detail: "Available 24/7",
         subDetail: "Average response: 2 minutes",
      },
      {
         icon: MapPin,
         title: "Office Location",
         description: "Visit our headquarters",
         detail: "123 Commerce Street",
         subDetail: "New York, NY 10001",
      },
   ];

   const categories = [
      "General Inquiry",
      "Technical Support",
      "Account Issues",
      "Billing Questions",
      "Report a Problem",
      "Feature Request",
      "Partnership Inquiry",
      "Other",
   ];

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
         <div className="container mx-auto px-4 py-16 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-16">
               <h1 className="text-5xl font-bold text-foreground mb-6">
                  Contact Us
               </h1>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Have a question or need assistance? We're here to help you
                  succeed on our marketplace platform.
               </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
               {/* Contact Form */}
               <div className="bg-card rounded-2xl p-8 shadow-lg border">
                  <div className="flex items-center gap-2 mb-6">
                     <Send className="h-6 w-6 text-primary" />
                     <h2 className="text-2xl font-bold text-foreground">
                        Send us a Message
                     </h2>
                  </div>

                  {isSubmitted ? (
                     <div className="text-center py-8">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                           Message Sent Successfully!
                        </h3>
                        <p className="text-muted-foreground">
                           Thank you for contacting us. We'll get back to you
                           within 24 hours.
                        </p>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                           <div>
                              <Label
                                 htmlFor="name"
                                 className="text-sm font-medium mb-2 block"
                              >
                                 Full Name{" "}
                                 <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                 id="name"
                                 placeholder="Your full name"
                                 value={formData.name}
                                 onChange={(e) =>
                                    handleInputChange("name", e.target.value)
                                 }
                                 required
                              />
                           </div>
                           <div>
                              <Label
                                 htmlFor="email"
                                 className="text-sm font-medium mb-2 block"
                              >
                                 Email Address{" "}
                                 <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                 id="email"
                                 type="email"
                                 placeholder="your@email.com"
                                 value={formData.email}
                                 onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                 }
                                 required
                              />
                           </div>
                        </div>

                        <div>
                           <Label
                              htmlFor="category"
                              className="text-sm font-medium mb-2 block"
                           >
                              Category{" "}
                              <span className="text-destructive">*</span>
                           </Label>
                           <select
                              id="category"
                              value={formData.category}
                              onChange={(e) =>
                                 handleInputChange("category", e.target.value)
                              }
                              className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              required
                           >
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                 <option key={category} value={category}>
                                    {category}
                                 </option>
                              ))}
                           </select>
                        </div>

                        <div>
                           <Label
                              htmlFor="subject"
                              className="text-sm font-medium mb-2 block"
                           >
                              Subject{" "}
                              <span className="text-destructive">*</span>
                           </Label>
                           <Input
                              id="subject"
                              placeholder="Brief description of your inquiry"
                              value={formData.subject}
                              onChange={(e) =>
                                 handleInputChange("subject", e.target.value)
                              }
                              required
                           />
                        </div>

                        <div>
                           <Label
                              htmlFor="message"
                              className="text-sm font-medium mb-2 block"
                           >
                              Message{" "}
                              <span className="text-destructive">*</span>
                           </Label>
                           <textarea
                              id="message"
                              rows={5}
                              placeholder="Please provide details about your inquiry..."
                              value={formData.message}
                              onChange={(e) =>
                                 handleInputChange("message", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                              required
                           />
                        </div>

                        <Button type="submit" className="w-full h-12">
                           <Send className="h-4 w-4 mr-2" />
                           Send Message
                        </Button>
                     </form>
                  )}
               </div>

               {/* Contact Methods */}
               <div className="space-y-6">
                  <div>
                     <h2 className="text-2xl font-bold text-foreground mb-6">
                        Other Ways to Reach Us
                     </h2>
                     <div className="space-y-4">
                        {contactMethods.map((method, index) => (
                           <div
                              key={index}
                              className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow"
                           >
                              <div className="flex items-start gap-4">
                                 <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <method.icon className="h-6 w-6 text-primary" />
                                 </div>
                                 <div className="flex-1">
                                    <h3 className="font-semibold text-foreground mb-1">
                                       {method.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                       {method.description}
                                    </p>
                                    <p className="font-medium text-foreground">
                                       {method.detail}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                       {method.subDetail}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-card rounded-xl p-6 shadow-lg border">
                     <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">
                           Business Hours
                        </h3>
                     </div>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Monday - Friday
                           </span>
                           <span className="font-medium text-foreground">
                              9:00 AM - 6:00 PM EST
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Saturday
                           </span>
                           <span className="font-medium text-foreground">
                              10:00 AM - 4:00 PM EST
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">Sunday</span>
                           <span className="font-medium text-foreground">
                              Closed
                           </span>
                        </div>
                        <div className="pt-2 border-t border-border mt-3">
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                 Live Chat
                              </span>
                              <span className="font-medium text-green-600">
                                 24/7 Available
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* FAQ Link */}
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border">
                     <h3 className="text-lg font-semibold text-foreground mb-2">
                        Check Our FAQ
                     </h3>
                     <p className="text-sm text-muted-foreground mb-4">
                        Find quick answers to common questions about buying,
                        selling, and using our platform.
                     </p>
                     <Button variant="outline" className="w-full">
                        Visit FAQ Section
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
