# Admin Navbar UI Documentation

## Overview

A modern, responsive admin navbar has been created specifically for the admin interface, separate from the main application navbar. This provides a dedicated, professional interface for administrators.

## Features

### 🎨 Design

-  **Modern UI**: Clean, professional design with proper spacing and typography
-  **Dark Mode Support**: Fully compatible with light and dark themes
-  **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
-  **Sticky Navigation**: Stays at the top of the page for easy access

### 🔍 Search Functionality

-  **Global Search**: Search across users, products, and orders from the navbar
-  **Responsive Search**: Full search bar on desktop, compact version on mobile
-  **Focus States**: Visual feedback when search is active

### 🔔 Notifications

-  **Real-time Alerts**: Notification bell with badge showing unread count
-  **Notification Center**: Dropdown showing recent admin notifications including:
   -  New orders received
   -  Products pending approval
   -  New user registrations
-  **Quick Actions**: Direct links to relevant admin pages from notifications

### 👤 User Management

-  **Admin Profile**: Shows current admin user with avatar and role badge
-  **Quick Actions**: Access to profile, settings, and sign out
-  **Role Indication**: Clear "Administrator" label in user dropdown
-  **Back to Store**: Easy navigation back to the main store

### 📱 Mobile Experience

-  **Mobile Menu**: Hamburger menu for sidebar toggle on mobile
-  **Touch-Friendly**: Optimized for touch interactions
-  **Compact Layout**: Efficiently uses mobile screen space

## Components

### AdminNavbar.tsx

Main navbar component with the following props:

-  `onMenuToggle?: () => void` - Function to toggle mobile sidebar
-  `title?: string` - Page title to display (defaults to "Admin Dashboard")

### AdminSidebar.tsx

Enhanced sidebar component with:

-  `collapsed: boolean` - Whether sidebar is collapsed
-  `onToggleCollapse: () => void` - Function to toggle collapse state
-  `isMobileMenuOpen: boolean` - Mobile menu visibility state
-  `onCloseMobileMenu: () => void` - Function to close mobile menu

## Integration

The admin navbar is integrated into the admin layout (`app/admin/layout.tsx`) and automatically:

-  Shows appropriate page titles based on current route
-  Handles mobile menu toggling
-  Manages sidebar collapse state
-  Provides proper authentication context

## Usage

The admin navbar automatically appears when accessing any `/admin/*` route. No additional setup is required beyond the existing authentication middleware.

### Accessing Admin Interface

1. Navigate to `/admin` or any admin route
2. Ensure you're logged in with admin privileges
3. The admin navbar will automatically load with full functionality

## Customization

### Adding New Navigation Items

To add new admin navigation items, modify the `navigation` array in `AdminSidebar.tsx`:

```tsx
const navigation = [
   { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
   { name: "Users", href: "/admin/users", icon: Users },
   { name: "Products", href: "/admin/products", icon: Package },
   { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
   { name: "Settings", href: "/admin/settings", icon: Settings },
   // Add new items here
];
```

### Customizing Notifications

Modify the notification dropdown in `AdminNavbar.tsx` to connect with your real notification system.

### Theming

The navbar uses Tailwind CSS classes and respects the application's theme system. Customize colors and styling by modifying the CSS classes in the components.

## Technical Details

-  **Framework**: Next.js 15 with React 18
-  **Styling**: Tailwind CSS with shadcn/ui components
-  **Icons**: Lucide React icons
-  **Authentication**: NextAuth.js integration
-  **Responsive**: Mobile-first design approach
-  **Accessibility**: Proper ARIA labels and keyboard navigation

## Browser Support

-  ✅ Chrome (latest)
-  ✅ Firefox (latest)
-  ✅ Safari (latest)
-  ✅ Edge (latest)
-  ✅ Mobile browsers (iOS Safari, Chrome Mobile)
