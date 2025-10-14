# Testing Checklist - Bug Fixes

## Pre-Testing Setup

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### MongoDB
Ensure MongoDB is running on `localhost:27017`

---

## 🔍 Test 1: Send Message Form Auto-Fill

**Steps:**
1. ✅ Login with Google OAuth
2. ✅ Navigate to Lost or Found page
3. ✅ Click on any item card
4. ✅ Click "Send Message" button
5. ✅ **Verify**: Name field is auto-filled (non-editable)
6. ✅ **Verify**: Email field is auto-filled (non-editable)
7. ✅ **Verify**: "Auto-filled from your profile" text appears
8. ✅ Type a message and submit
9. ✅ **Verify**: Success toast appears

**Expected Result:** ✅ Name and email auto-filled, read-only, with visual indicator

---

## 📸 Test 2: Image Upload & Visibility

**Steps:**
1. ✅ Login with Google OAuth
2. ✅ Click "Report Lost" or "Report Found"
3. ✅ Fill in all required fields
4. ✅ Upload an image (JPG, PNG, or WebP)
5. ✅ **Verify**: Image preview appears
6. ✅ Submit the form
7. ✅ Navigate to Lost/Found page
8. ✅ **Verify**: Your item appears with the uploaded image
9. ✅ Click on the item card
10. ✅ **Verify**: Image is displayed in the modal
11. ✅ Navigate to Home page
12. ✅ **Verify**: Recent items show images

**Expected Result:** ✅ Images visible in all sections after upload

**Debug Steps if Images Don't Show:**
- Check browser console for 404 errors
- Verify `uploads/` directory exists in project root
- Check image URL starts with `http://localhost:8080/uploads/`
- Verify backend WebConfig is loaded

---

## 🔔 Test 3: Matching & Notifications

### Part A: Report Items
1. ✅ Login as User A
2. ✅ Report Lost: "AirPods Realme Air 6 Pro Black"
   - Description: "Lost my Realme AirPods, black color"
3. ✅ Logout

### Part B: Find Match
4. ✅ Login as User B
5. ✅ Report Found: "Realme AirPods Pro"
   - Description: "Found black airpods, looks like Realme brand"
6. ✅ **Verify**: Notification bell shows count (1)
7. ✅ Click notification bell
8. ✅ **Verify**: Match notification appears
9. ✅ Logout

### Part C: Check Lost User Notification
10. ✅ Login as User A
11. ✅ **Verify**: Notification bell shows count (1)
12. ✅ Click notification bell
13. ✅ **Verify**: Match notification appears
14. ✅ Navigate to Lost page
15. ✅ **Verify**: Your item shows status "POSSIBLE_MATCH"

### Part D: Email Notification (if configured)
16. ✅ Check User A's email
17. ✅ **Verify**: Email with subject "Possible Match Found"

**Expected Result:** ✅ Both users notified, status updated, email sent

---

## 🚪 Test 4: Logout Functionality

**Steps:**
1. ✅ Login with Google OAuth
2. ✅ Navigate to different pages (Home, Lost, Found)
3. ✅ Note current theme (light/dark)
4. ✅ Click logout button
5. ✅ **Verify**: Immediately redirected to login page
6. ✅ **Verify**: No delay or stuck state
7. ✅ **Verify**: Theme preference is maintained
8. ✅ Try navigating to `/home` directly
9. ✅ **Verify**: Redirected back to login

**Expected Result:** ✅ Clean logout, theme preserved, protected routes inaccessible

---

## 👑 Test 5: Admin Report Generation

### Setup Admin User
```javascript
// In MongoDB
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "ADMIN" } }
);
```

**Steps:**
1. ✅ Login as admin user
2. ✅ **Verify**: "Admin" link visible in navbar
3. ✅ Click "Admin" in navbar
4. ✅ **Verify**: Admin Dashboard opens
5. ✅ **Verify**: Statistics cards display correctly
6. ✅ Select month and year
7. ✅ Click "Generate Report"
8. ✅ **Verify**: PDF downloads automatically
9. ✅ Open PDF
10. ✅ **Verify**: Report contains:
    - Title "FindX Monthly Report"
    - Summary statistics
    - Lost items table
    - Found items table
11. ✅ Navigate to Profile page
12. ✅ **Verify**: No redundant "Generate Report" button
13. ✅ **Verify**: "Admin Dashboard" button present
14. ✅ **Verify**: "View Reports" button present

**Expected Result:** ✅ PDF generates successfully, no redundant buttons in profile

---

## 🔄 Test 6: Dark Mode Compatibility

**Steps:**
1. ✅ Login with Google OAuth
2. ✅ Click theme toggle (sun/moon icon)
3. ✅ **Verify**: All pages switch to dark mode:
   - Navbar
   - Home page
   - Lost/Found pages
   - Report forms
   - Profile page
   - Admin dashboard (if admin)
4. ✅ Click on an item, then "Send Message"
5. ✅ **Verify**: Contact form respects dark mode
6. ✅ Toggle theme back to light
7. ✅ **Verify**: All pages switch to light mode

**Expected Result:** ✅ Consistent theming across all pages and modals

---

## 🔍 Test 7: Search & Filters

**Steps:**
1. ✅ Navigate to Lost page
2. ✅ Type "pods" in search (partial keyword)
3. ✅ **Verify**: "AirPods" items appear in results
4. ✅ Click "Filters" button
5. ✅ **Verify**: Filter panel opens
6. ✅ Click "Matched" filter
7. ✅ **Verify**: Only items with matches show
8. ✅ Click "Open" filter
9. ✅ **Verify**: Only open items show
10. ✅ Repeat for Found page

**Expected Result:** ✅ Search and filters work correctly

---

## 🎨 Test 8: Responsive Design

**Steps:**
1. ✅ Open browser DevTools (F12)
2. ✅ Toggle device toolbar (mobile view)
3. ✅ Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. ✅ **Verify**: All pages are responsive
5. ✅ **Verify**: Mobile menu works
6. ✅ **Verify**: Forms are usable on mobile
7. ✅ **Verify**: Modals fit on small screens

**Expected Result:** ✅ Fully responsive on all devices

---

## 🚨 Common Issues & Solutions

### Issue: Images Not Showing
**Solution:**
1. Check backend console for file upload errors
2. Verify `uploads/` directory exists
3. Restart backend after creating WebConfig.java
4. Check browser Network tab for 404 errors

### Issue: Email Not Sending
**Solution:**
1. Configure SMTP in `application.properties`
2. Use Gmail App Password (not regular password)
3. Check backend console for email errors
4. System works without email (just shows console message)

### Issue: Matching Not Detecting
**Solution:**
1. Ensure items have descriptive text
2. Use at least 2 common keywords
3. Check both items in MongoDB
4. Verify matching service is running

### Issue: Logout Stuck
**Solution:**
1. Clear browser cache
2. Clear localStorage manually (F12 > Application > Local Storage)
3. Try incognito/private window

### Issue: Admin Features Not Visible
**Solution:**
1. Verify user role in MongoDB: `db.users.find({ email: "your-email" })`
2. Ensure role is exactly "ADMIN" (case-sensitive)
3. Logout and login again

---

## ✅ Final Verification Checklist

- [ ] All images display correctly after upload
- [ ] Contact form auto-fills name and email
- [ ] Matching detects partial keywords correctly
- [ ] Notifications appear in bell icon
- [ ] Email notifications sent (if configured)
- [ ] Logout redirects immediately
- [ ] Theme preference persists after logout
- [ ] Admin can generate PDF reports
- [ ] No redundant buttons in profile
- [ ] Dark mode works on all pages
- [ ] Search with debounce works
- [ ] Filters work correctly
- [ ] Responsive on mobile devices
- [ ] No console errors

---

## 📊 Performance Checks

### Page Load Times
- ✅ Home page: < 2 seconds
- ✅ Lost/Found pages: < 3 seconds
- ✅ Image load: < 1 second
- ✅ Search response: < 500ms (with debounce)

### API Response Times
- ✅ GET /api/lost: < 500ms
- ✅ GET /api/found: < 500ms
- ✅ POST /api/lost (with image): < 2 seconds
- ✅ GET /api/admin/statistics: < 1 second

---

## 🎉 Success Criteria

All tests pass when:
1. ✅ Contact form auto-fills correctly
2. ✅ Images are visible everywhere
3. ✅ Matching detects similar items
4. ✅ Notifications work (in-app + email)
5. ✅ Logout works smoothly
6. ✅ Admin reports generate successfully
7. ✅ No redundant UI elements
8. ✅ Dark mode works consistently
9. ✅ No console errors or warnings
10. ✅ Responsive on all devices

---

## 📝 Notes

- Email notifications require SMTP configuration (optional)
- Admin features require role: "ADMIN" in MongoDB
- Images stored in `uploads/` directory at project root
- Theme preference saved in localStorage
- JWT tokens used for authentication

---

## 🆘 Support

If any test fails:
1. Check `FIXES_APPLIED.md` for detailed solutions
2. Review backend console logs
3. Check browser console for errors
4. Verify all dependencies are installed
5. Ensure MongoDB is running
6. Try clearing cache and localStorage

