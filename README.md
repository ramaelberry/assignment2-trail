# FitCRM - Fitness Client Management System

**Assignment #2 - CSCE 4502**

A modern, responsive Fitness Client Management System (CRM) built with vanilla JavaScript, HTML5, and CSS3. This application allows fitness professionals to manage client information, track training history, and fetch suggested exercises from workout APIs.

---

## 📋 Project Description

FitCRM is a client-side web application that provides a complete solution for managing fitness clients. The system allows trainers to:

- Add, edit, and delete client records
- View detailed client information and training history
- Search clients by name
- Fetch suggested exercises from workout APIs
- Store all data locally using browser localStorage

The application is fully responsive and works seamlessly across desktop and mobile devices.

---

## 🛠️ Tech Stack

| Layer | Technology Used |
|-------|------------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla JS - ES6+) |
| **Styling** | Custom CSS with CSS Grid & Flexbox |
| **Icons** | SVG Icons (Feather Icons style) |
| **Fonts** | Google Fonts - Poppins |
| **Storage** | Browser localStorage |
| **API Integration** | Wger Workout API (with fallback) |
| **Hosting** | GitHub Pages / Netlify |

---

## 📁 Project Structure

```
fitcrm/
├── index.html              # Client List View (Dashboard)
├── add-client.html         # Add/Edit Client Form
├── view-client.html        # Client Detail View
├── css/
│   └── styles.css          # All application styles
├── js/
│   ├── main.js            # Main dashboard logic
│   ├── storage.js          # localStorage helper functions
│   ├── validation.js      # Form validation utilities
│   ├── api.js             # Workout API integration
│   ├── add-client.js      # Add/Edit form handler
│   └── view-client.js     # Client view page logic
├── package.json           # Node.js dependencies (for optional server)
├── server.js              # Optional Express server
└── README.md              # This file
```

---

## 🚀 Deployment

### Live Application

**GitHub Pages:** [Your GitHub Pages URL here]  
**Netlify:** [Your Netlify URL here]

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd fitcrm
   ```

2. **Open in browser:**
   - Simply open `index.html` in a modern web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server
     
     # PHP
     php -S localhost:8000
     ```

3. **Access the application:**
   - Navigate to `http://localhost:8000` in your browser

### Optional: Running with Express Server

If you want to use the optional Express server for API validation:

```bash
npm install
npm start
```

The server will run on `http://localhost:3000`

---

## ✨ Features

### Client Management
- ✅ **Add Client**: Dedicated page (`add-client.html`) with full validation
- ✅ **Edit Client**: Reuse add-client.html with `?id=<clientId>` query parameter
- ✅ **Delete Client**: Confirmation dialog before deletion
- ✅ **View Client**: Detailed view with training history and exercises
- ✅ **Search**: Real-time search by name (case-insensitive, substring matching)

### Data Validation
- ✅ **Client-side validation**: Real-time field validation with error messages
- ✅ **Server-side validation**: Optional Express server with API endpoints
- ✅ **Validation rules**:
  - Name: Required, 2-100 characters
  - Email: Required, valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
  - Phone: Required, valid format (`/^\+?\d{7,15}$/`)
  - Age: Required, integer > 0
  - Membership Start Date: Required, valid date, cannot be in future
  - Fitness Goal: Required

### API Integration
- ✅ **Workout Exercises**: Fetches 5 suggested exercises from Wger API
- ✅ **Error Handling**: Graceful fallback to predefined exercises if API fails
- ✅ **Loading States**: Visual feedback during API calls

### User Experience
- ✅ **Toast Notifications**: Success/error messages for user actions
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Accessibility**: ARIA labels and semantic HTML
- ✅ **Navigation**: Smooth navigation between pages

---

## 📊 Data Model

Clients are stored in localStorage under the key `fitcrm_clients` as a JSON array:

```javascript
{
  "id": "client-12345",
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+201234567890",
  "age": 30,
  "gender": "Male|Female|Other",
  "fitnessGoal": "Weight Loss|Muscle Gain|General Fitness|Endurance",
  "membershipStart": "2025-09-01",
  "trainingHistory": [
    {
      "date": "2025-10-01",
      "notes": "Leg day - squat focus"
    },
    {
      "date": "2025-10-08",
      "notes": "Upper body - push"
    }
  ],
  "nextSessionExercises": [] // Fetched dynamically from API
}
```

---

## 🔧 API Integration

### Workout API (Wger)

The application integrates with the [Wger Workout API](https://wger.de/api/v2) to fetch exercise suggestions:

- **Endpoint**: `https://wger.de/api/v2/exercise/`
- **Fallback**: If API fails, displays predefined exercises
- **CORS Handling**: Graceful error handling for CORS issues

---

## 🧪 Testing

### Manual Test Cases

1. **Add Client**
   - Fill form with valid data → Should save and redirect
   - Leave fields empty → Should show validation errors
   - Enter invalid email → Should show email format error
   - Enter invalid phone → Should show phone format error

2. **Edit Client**
   - Click Edit on a client → Should load form with existing data
   - Modify and save → Should update and redirect

3. **Delete Client**
   - Click Delete → Should show confirmation
   - Confirm → Should remove client from list

4. **Search**
   - Type client name → Should filter list in real-time
   - Clear search → Should show all clients

5. **View Client**
   - Click on client row → Should navigate to detail page
   - Should display all client information
   - Should fetch and display exercises from API

---

## 📝 Known Issues

- **CORS with Wger API**: The Wger API may have CORS restrictions. The application includes fallback exercises to handle this gracefully.
- **Browser Compatibility**: Requires modern browser with localStorage support (IE11+)

---

## 🎯 Acceptance Criteria Checklist

- ✅ Add Client form is on a separate page (`add-client.html`)
- ✅ Saves to localStorage with key `fitcrm_clients`
- ✅ Client List supports Edit (prefill + update), Delete (with confirmation), Search (by name), and View navigation
- ✅ Client View displays all specified fields and fetches 5 exercises from workout API
- ✅ All form validations implemented as specified
- ✅ Styles moved to `css/styles.css` and app is responsive
- ✅ Code is modular, commented, and follows best practices
- ✅ Repository is public with deployment link

---

## 📄 License

MIT License - Feel free to use this project for educational purposes.

---

## 👤 Author

**Your Name**  
**Course**: CSCE 4502  
**Assignment**: #2 - FitCRM

---

## 🔗 Links

- **GitHub Repository**: [Your Repo URL]
- **Live Deployment**: [Your Deployment URL]
- **Course**: CSCE 4502

---

## 📸 Screenshots

_Add screenshots of your application here if deployment is not working_

1. Dashboard/Client List View
2. Add Client Form
3. Client Detail View with Exercises
4. Mobile Responsive View

---

**Note**: This application uses browser localStorage for data persistence. Data will persist across page refreshes but will be specific to each browser/device.
