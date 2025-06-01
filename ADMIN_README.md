# Admin Interface Documentation

This document provides information about the admin interface for the U2U E-commerce platform.

## Accessing the Admin Interface

The admin interface can be accessed by logging in with an admin account. By default, the email `admin@gmail.com` is set up with admin privileges.

1. Navigate to the login page
2. Enter the admin credentials:
   -  Email: `admin@gmail.com`
   -  Password: (your admin password)
3. Upon successful login, you will be redirected to the admin dashboard

## Setting Admin Role for Development

If you need to set the admin role for an existing user with email `admin@gmail.com`, you can run the following script:

```bash
node scripts/set-admin-role.js
```

This script will update the user with email `admin@gmail.com` to have the admin role.

## Admin Features

The admin interface provides the following features:

### Dashboard

-  Overview of key statistics (users, products, revenue)
-  Quick access to recent user registrations
-  List of pending product approvals
-  Quick action links to common tasks

### User Management

-  View and search users
-  Filter users by role and status
-  Add new users
-  Edit existing user information
-  Activate/deactivate user accounts

### Product Management

-  View and search products
-  Filter products by category and status
-  Review product details
-  Approve or reject products submitted by sellers
-  Provide rejection reasons when declining products

### Order Management

-  View and search orders
-  Filter orders by status
-  Review order details
-  Update order status

### System Settings

-  Update general store information
-  Configure shipping options and rates
-  Set tax rates and rules
-  Manage notification preferences

## Customizing the Admin Interface

The admin interface is built with a modular approach, making it easy to extend with new features or modify existing functionality.

Components are located in:

-  Admin layout: `app/admin/layout.tsx`
-  Dashboard: `app/admin/page.tsx`
-  User management: `app/admin/users/page.tsx`
-  Product management: `app/admin/products/page.tsx`
-  Order management: `app/admin/orders/page.tsx`
-  Settings: `app/admin/settings/page.tsx`

## Development Notes

-  The admin interface is built using React with Next.js
-  The UI components utilize TailwindCSS for styling
-  The sidebar navigation is collapsible for better use of screen space
-  All data interactions are protected by authentication middleware
