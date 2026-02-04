# TravelDost - Component Reference Guide

## 📁 Component Structure

```
src/components/
├── Navbar.jsx              # Landing page navigation
├── HeroSection.jsx         # Landing hero with CTA
├── FeaturesSection.jsx     # 6 features grid
├── HowItWorksSection.jsx   # 3-step process
├── AboutContactSection.jsx # About & contact cards
├── Footer.jsx              # Footer with copyright
├── LoginPage.jsx           # Login form only (no toggle)
├── SignUpPage.jsx          # Sign up form only
├── Dashboard.jsx           # Main protected dashboard
├── MapWidget.jsx           # Leaflet map component
└── NotFound.jsx            # 404 error page
```

---

## 🎨 Component Details

### 1. **Navbar**
- Responsive sticky header
- Desktop nav links (Features, How It Works, About, Contact)
- Mobile hamburger menu
- Login/Signup buttons that navigate to correct pages
- **Props:** None
- **State:** `sidebarOpen` (mobile menu state)

### 2. **HeroSection**
- Large headline: "Explore the World Without Fear"
- Two CTA buttons: "Start Your Journey" (→ /signup) & "Learn More" (→ #features)
- Preview card showing location detection
- **Props:** None
- **State:** None

### 3. **FeaturesSection**
- 6 feature cards with icons
- Features: Location Detection, Emergency SOS, Uncommon Rules, Language Tools, Trip Checklist, Local Gems
- Hover effects
- **Props:** None
- **State:** None

### 4. **HowItWorksSection**
- 3-step process with numbered circles
- Steps: Create Account, Enable Location, Start Exploring
- Connecting line between steps (visible on desktop)
- **Props:** None
- **State:** None

### 5. **AboutContactSection**
- Two sections: About Us & Get in Touch
- Contact cards: Email, Phone, Address
- Uses dummy contact info (update in backend phase)
- **Props:** None
- **State:** None

### 6. **Footer**
- Dark themed footer
- Copyright with dynamic year
- "Made with love in India" tagline
- **Props:** None
- **State:** None

### 7. **LoginPage**
- Email/password form
- "Sign in" button
- Link to /signup for new users
- On submit: Logs to console, navigates to /dashboard
- **Props:** None
- **State:** `email`, `password`

### 8. **SignUpPage**
- Name/email/password form (all required)
- "Create Account" button
- Link to /login for existing users
- On submit: Logs to console, navigates to /dashboard
- **Props:** None
- **State:** `name`, `email`, `password`

### 9. **Dashboard** ⭐ MAIN COMPONENT
- Responsive sidebar + main content layout
- **Sidebar:** 
  - Navigation links (Dashboard, Emergency, Translator, Checklist, Settings)
  - User profile card
  - Logout button
  - Mobile toggle
- **Main Content:**
  - Welcome header with location badge
  - Grid layout (3 columns on desktop, 1 on mobile)
  - Emergency Numbers card
  - Regional Rules card
  - Quick Tools (Currency, Translator buttons)
  - Trip Checklist (functional checkboxes)
  - Map Widget (full width)
- **Props:** None
- **State:** `sidebarOpen`, `checklist`
- **Functions:** `toggleChecklistItem()`, `handleLogout()`

### 10. **MapWidget**
- Currently shows placeholder
- Instructions to uncomment for Leaflet integration
- Coordinates hardcoded: Rajkot, Gujarat [22.3039, 70.8022]
- **Props:** None
- **State:** None
- **TODO:** Uncomment Leaflet code after `npm install leaflet react-leaflet`

### 11. **NotFound**
- 404 error page
- Shows alert icon, error message
- "Back to Home" button (→ /)
- **Props:** None
- **State:** None

---

## 🎯 Routing Structure

```
/ ........................ Landing Page (Navbar + All Sections + Footer)
/login ................... Login Form
/signup .................. Sign Up Form
/dashboard ............... Main Dashboard (Protected route - needs auth)
/* ....................... Not Found Page (404)
```

---

## 🔧 Key Features Implemented

| Feature | Status | Location |
|---------|--------|----------|
| Responsive Design | ✅ Complete | All components |
| Navigation | ✅ Complete | Navbar.jsx, Routing |
| Authentication UI | ✅ Complete | LoginPage, SignUpPage |
| Dashboard Layout | ✅ Complete | Dashboard.jsx |
| Emergency Numbers | ✅ Complete | Dashboard.jsx (hardcoded) |
| Regional Rules | ✅ Complete | Dashboard.jsx (hardcoded) |
| Trip Checklist | ✅ Complete | Dashboard.jsx (functional) |
| Map Container | ✅ Complete | MapWidget.jsx (placeholder) |
| Logout | ✅ Complete | Dashboard.jsx |
| 404 Handling | ✅ Complete | NotFound.jsx |
| Design System | ✅ Complete | All components (Tailwind) |

---

## 🎨 Design System

### Colors
- **Primary:** Sky Blue (`bg-sky-600`, `text-sky-600`)
- **Secondary:** Teal (`bg-teal-600`, `text-teal-600`)
- **Danger:** Red (`bg-red-600`, `text-red-600`)
- **Alert:** Amber (`bg-amber-600`, `text-amber-600`)
- **Success:** Green (when used)

### Typography
- **Headings:** Font-bold, tracking-tight
- **Body:** Font-medium/regular
- **Small text:** Font-sm

### Spacing
- **Gap:** 2, 3, 4, 6, 8 units
- **Padding:** 4, 6, 8 units
- **Margin:** 2, 4, 6, 8 units

### Shadows
- `shadow-sm` - Light
- `shadow-lg` - Medium
- `shadow-2xl` - Large

### Rounded Corners
- `rounded-lg` - Moderate
- `rounded-xl` - Medium
- `rounded-2xl` - Large
- `rounded-full` - Circular

---

## 📱 Responsive Breakpoints

- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md, lg)
- **Desktop:** > 1024px (xl)

**Tailwind Prefixes:**
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

---

## 🚀 Common Customizations

### Change Primary Color
Replace `sky-600` with your color across all components:
```javascript
// Before
className="bg-sky-600"

// After
className="bg-blue-600"  // or your preferred color
```

### Add New Menu Items
Edit Dashboard.jsx menu:
```javascript
const menuItems = [
  // ... existing items
  { name: 'New Feature', icon: NewIcon, href: '/dashboard#new-feature' },
]
```

### Update Contact Info
Edit AboutContactSection.jsx:
```javascript
<p className="mt-2 text-sm text-slate-600">your-email@example.com</p>
```

### Change Checklist Items
Edit Dashboard.jsx useState:
```javascript
const [checklist, setChecklist] = useState([
  { id: 1, label: 'Your item', checked: false },
])
```

---

## 🐛 Debugging Tips

1. **Component not showing?**
   - Check if route is registered in App.jsx
   - Check if component is imported

2. **Styling issues?**
   - Clear browser cache (Ctrl+Shift+R)
   - Check Tailwind CSS is loaded (index.css)

3. **Navigation not working?**
   - Verify Link/Route paths match
   - Check useNavigate hook is imported

4. **Map not showing?**
   - Uncomment MapWidget.jsx code after npm install
   - Check browser console for errors

5. **Layout broken on mobile?**
   - Check responsive classes (sm:, md:, lg:)
   - Use Firefox DevTools device simulation

---

## 📦 Dependencies Used

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "tailwindcss": "^4.x",
  "lucide-react": "latest",
  "leaflet": "^1.9.x",
  "react-leaflet": "^4.x"
}
```

---

## ✅ Validation Checklist

- [x] All pages responsive
- [x] Navigation working
- [x] Forms functional
- [x] Buttons have onClick/Link
- [x] No console errors
- [x] Design system consistent
- [x] Mobile menu working
- [x] Color scheme applied
- [x] Icons displaying
- [x] Logout functionality works

---

Last Updated: February 4, 2026
