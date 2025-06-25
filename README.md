# PMory - Product Management Hub for Emory Students

A comprehensive web platform designed to help Emory University students break into Product Management careers.

## Features

- **What is PM**: Educational resources about product management
- **Skillset Hub**: Curated learning materials for essential PM tools
- **Mentorship Network**: Connect with Emory PM alumni and current professionals
- **Job Alert Center**: Stay updated on PM opportunities with email notifications
- **Admin Panel**: Secure content management system

## Launch Setup Guide

### 1. EmailJS Configuration

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up your email service (Gmail, Outlook, etc.)
3. Create 2 email templates (free account limit):
   - **Job alerts** (`template_job_alert`) - for sending job notifications from Admin Panel
   - **Welcome emails** (`template_welcome`) - for welcome emails to new subscribers
4. Update `src/config/settings.json` with your actual EmailJS credentials:
   ```json
   {
     "emailjs": {
       "serviceId": "your_service_id",
       "templateIds": {
         "jobAlert": "your_job_alert_template_id",
         "welcomeJobAlert": "your_welcome_template_id"
       },
       "publicKey": "your_public_key"
     }
   }
   ```

### 2. EmailJS Template Setup

#### Template 1: `template_welcome` (Welcome Email)
- **Template ID**: `template_welcome`
- **Variables**: `{{to_email}}`, `{{from_name}}`, `{{subject}}`, `{{message}}`
- **Purpose**: Welcome new subscribers to job alerts

#### Template 2: `template_job_alert` (Job Notifications)
- **Template ID**: `template_job_alert`  
- **Variables**: `{{to_email}}`, `{{subject}}`, `{{message}}`, `{{job_title}}`, `{{company}}`
- **Purpose**: Send job updates and new postings to subscribers

### 3. Admin Panel Security

#### Current Setup (Development)
- **Password**: `pmory2025admin`
- **Access**: Click settings icon (⚙️) in navigation → Enter password
- **Session**: Authentication expires when browser closes
- **Storage**: Session-based authentication

#### For Production (Recommended)
- [ ] Implement proper user authentication system
- [ ] Use environment variables for admin credentials
- [ ] Add JWT token-based authentication
- [ ] Set up backend user management
- [ ] Implement role-based access control
- [ ] Add audit logging for admin actions
- [ ] Use HTTPS for all admin operations

### 4. Content Management

#### Adding/Editing Mentors
- Access Admin Panel → Mentors tab
- Add mentor details (name, role, company, email, etc.)
- Mentor emails are hidden from users but accessible for contact purposes
- Export mentor data as JSON for backup

#### Managing Job Listings
- Update job statuses in Admin Panel → Jobs tab
- Status changes can trigger email notifications to subscribers
- Edit `src/data/jobs.json` directly for permanent changes

#### External Links
- Update all external links through Admin Panel → External Links tab
- Links are centrally managed in `src/config/settings.json`

### 5. Email Notifications

The system supports:
- **Welcome emails** when users subscribe to job alerts (uses `template_welcome`)
- **Job status notifications** when positions are updated (uses `template_job_alert`)
- **New subscriber logging** (console only - no email due to template limit)

### 6. Data Persistence

**Current Setup (Development):**
- Subscriber data stored in localStorage
- Settings stored in localStorage
- Mentor/job data in JSON files
- Admin authentication in sessionStorage

**For Production:**
- Implement backend database (recommended: Supabase, Firebase, or similar)
- Set up proper user authentication
- Create API endpoints for data management
- Implement automated email scheduling
- Add data backup and recovery systems

### 7. Security Considerations

**Current Security Measures:**
- ✅ Password-protected admin panel
- ✅ Session-based authentication
- ✅ Hidden subscriber emails (masked display)
- ✅ Client-side validation

**Production Security Requirements:**
- [ ] Server-side authentication
- [ ] HTTPS enforcement
- [ ] Rate limiting for admin actions
- [ ] Input sanitization and validation
- [ ] SQL injection protection (if using database)
- [ ] CSRF protection
- [ ] Regular security audits

### 8. Deployment Checklist

- [ ] Configure EmailJS with real credentials
- [ ] **Change admin password** from default
- [ ] Test email functionality
- [ ] Update mentor information
- [ ] Verify all external links
- [ ] Set up analytics (Google Analytics recommended)
- [ ] Configure domain and hosting
- [ ] Set up SSL certificate
- [ ] Test responsive design on all devices
- [ ] Implement production security measures

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Admin Access

**Development Password**: `pmory2025admin`

**⚠️ IMPORTANT**: Change this password before deploying to production!

## File Structure

```
src/
├── components/          # Reusable components
│   ├── AdminPanel.tsx   # Secure admin management interface
│   ├── ContactModal.tsx # Mentor contact form
│   ├── Navigation.tsx   # Main navigation with admin access
│   └── Footer.tsx       # Site footer
├── pages/              # Main pages
├── data/               # JSON data files
├── config/             # Configuration files
└── assets/             # Static assets
```

## Security Notes

1. **Admin Panel**: Protected by password authentication
2. **Session Management**: Authentication expires when browser closes
3. **Data Protection**: Subscriber emails are masked in admin view
4. **Production Ready**: Requires backend authentication system

## Support

For technical support or questions about the platform, contact: martinoh0715@gmail.com

## License

This project is created for Emory University students and is not intended for commercial use.