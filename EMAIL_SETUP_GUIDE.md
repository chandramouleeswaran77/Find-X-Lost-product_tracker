# Email Notification Setup Guide

## Overview
This guide will help you set up email notifications for the Find_X platform. Email notifications are sent when:
1. Items are matched based on keywords
2. Someone claims a found item
3. Someone sends a message about an item

---

## 📧 Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2FA (you'll need your phone)

### Step 2: Generate App Password

1. Still in **Security** settings
2. Under "Signing in to Google", click **App passwords**
   - If you don't see this option, make sure 2FA is enabled
3. Select **Mail** for the app
4. Select **Other (Custom name)** for the device
5. Enter "FindX Platform" as the name
6. Click **Generate**
7. **Copy the 16-character password** (format: xxxx xxxx xxxx xxxx)
   - You won't be able to see this again!

### Step 3: Configure Application

Open `backend/src/main/resources/application.properties` and add:

```properties
# Email Configuration for Gmail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

**Replace**:
- `your-email@gmail.com` with your Gmail address
- `xxxx xxxx xxxx xxxx` with the 16-character App Password

### Step 4: Test Configuration

1. Restart your Spring Boot application
2. Report a lost item and a found item with matching keywords
3. Check your email inbox (and spam folder)
4. You should receive a match notification

---

## 📮 Other Email Providers

### Outlook/Hotmail

```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Yahoo Mail

```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Note**: Yahoo also requires an app password. Generate one at:
https://login.yahoo.com/account/security/app-passwords

### Custom SMTP Server

```properties
spring.mail.host=smtp.your-domain.com
spring.mail.port=587
spring.mail.username=your-email@your-domain.com
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 🔒 Security Best Practices

### 1. Use Environment Variables (Recommended)

Instead of hardcoding credentials, use environment variables:

**application.properties**:
```properties
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Set environment variables**:

Windows (PowerShell):
```powershell
$env:MAIL_HOST="smtp.gmail.com"
$env:MAIL_PORT="587"
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
```

Linux/Mac:
```bash
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
```

Or add to `.bashrc` / `.zshrc` for persistence.

### 2. Use application-secrets.properties

Create `backend/src/main/resources/application-secrets.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx
```

Add to `.gitignore`:
```
application-secrets.properties
```

Update `application.properties`:
```properties
spring.config.import=optional:classpath:application-secrets.properties
```

### 3. Use Spring Cloud Config

For production, use Spring Cloud Config Server or AWS Secrets Manager.

---

## 🧪 Testing Email Notifications

### Test 1: Match Notification

1. **User A**: Report Lost
   - Item: "AirPods Pro"
   - Description: "Lost my black AirPods"
   - Email: userA@example.com

2. **User B**: Report Found
   - Item: "AirPods"
   - Description: "Found black airpods"
   - Email: userB@example.com

3. **Expected Result**:
   - Both users receive email notification
   - Subject: "FindX: Possible Match Found"
   - Body includes item details and match information

### Test 2: Message Notification

1. User A reports a lost item
2. User B views the item and clicks "Send Message"
3. User B sends: "I think I saw this item"
4. **Expected Result**:
   - User A receives email notification
   - Subject: "FindX: New Message"
   - Body includes sender name and message

### Test 3: Claim Notification

1. User A reports a found item
2. User B claims the item
3. **Expected Result**:
   - User A receives email notification
   - Subject: "FindX: Claim Request"
   - Body includes claimer details

---

## 🔧 Troubleshooting

### Error: "Could not authenticate with SMTP server"

**Solutions**:
1. Verify username and password are correct
2. For Gmail, ensure you're using the 16-character App Password (not your regular password)
3. Check that 2FA is enabled on your Google Account
4. Verify the App Password hasn't expired

### Error: "Connection refused"

**Solutions**:
1. Check your firewall settings
2. Verify port 587 is not blocked
3. Try port 465 with SSL:
   ```properties
   spring.mail.port=465
   spring.mail.properties.mail.smtp.ssl.enable=true
   ```
4. Check your internet connection

### Error: "javax.mail.MessagingException"

**Solutions**:
1. Verify SMTP host is correct
2. Check if your email provider requires additional settings
3. Enable "Less secure app access" (if available)
4. Check application logs for detailed error message

### Emails Going to Spam

**Solutions**:
1. Add sender email to your contacts
2. Mark email as "Not Spam"
3. Set up SPF/DKIM records (for production)
4. Use a verified domain email (for production)

### No Emails Received

**Check**:
1. Backend console for error messages
2. Spam/Junk folder
3. Email address is correct in user profile
4. SMTP credentials are valid
5. Internet connectivity
6. Email provider's service status

**Debug Steps**:
```java
// Add logging to NotificationService.java
logger.info("Attempting to send email to: {}", recipientEmail);
logger.info("Email sent successfully");
```

---

## 📧 Email Templates

### Match Notification Email

```
Subject: FindX: Possible Match Found 🎯

Hi [User Name],

Great news! We found a possible match for your [lost/found] item.

Your Item:
- Name: [Item Name]
- Description: [Description]
- Reported: [Date]

Matched With:
- Name: [Matched Item Name]
- Description: [Matched Description]
- Contact: [Contact Email/Phone]

Please verify this match and contact the other party to arrange pickup/return.

Login to FindX to see full details:
http://localhost:5173/[lost/found]/[item-id]

Best regards,
FindX Team
```

### Message Notification Email

```
Subject: FindX: New Message About Your Item 💬

Hi [User Name],

You have received a new message about your [lost/found] item "[Item Name]".

From: [Sender Name]
Email: [Sender Email]
Message: "[Message Content]"

Reply to this message by logging into FindX:
http://localhost:5173/[lost/found]/[item-id]

Best regards,
FindX Team
```

### Claim Notification Email

```
Subject: FindX: Claim Request for Your Found Item 🔔

Hi [User Name],

Someone has claimed your found item "[Item Name]".

Claimer Details:
- Name: [Claimer Name]
- Email: [Claimer Email]
- Verification: [ID Proof Details]

Please login to FindX to review and verify this claim:
http://localhost:5173/found/[item-id]

Best regards,
FindX Team
```

---

## 🚀 Production Configuration

### Recommended Setup

1. **Use a Dedicated Email Account**
   - Create a new Gmail account specifically for the platform
   - Example: `noreply.findx@gmail.com`

2. **Use Environment Variables**
   - Never commit credentials to version control
   - Use `.env` files or cloud secrets management

3. **Enable SSL/TLS**
   ```properties
   spring.mail.properties.mail.smtp.ssl.enable=true
   spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com
   ```

4. **Add Email Templates**
   - Use Thymeleaf or FreeMarker templates
   - Store templates in `src/main/resources/templates/email/`

5. **Monitor Email Delivery**
   - Log all email attempts
   - Set up alerts for failures
   - Track bounce rates

6. **Rate Limiting**
   - Gmail allows 500 emails/day for free accounts
   - Use commercial email service for higher volume
   - Consider SendGrid, Amazon SES, or Mailgun

---

## 📊 Email Service Alternatives

### For High Volume (Production)

| Service | Free Tier | Pricing | Features |
|---------|-----------|---------|----------|
| SendGrid | 100/day | $15/mo for 40k | Analytics, Templates |
| Amazon SES | 62k/month (AWS Free Tier) | $0.10/1k emails | Scalable, Reliable |
| Mailgun | 5k/month | $35/mo for 50k | REST API, Analytics |
| Postmark | 100/month | $10/mo for 10k | Transactional focus |

### SendGrid Example

```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=YOUR_SENDGRID_API_KEY
```

### Amazon SES Example

```properties
spring.mail.host=email-smtp.us-east-1.amazonaws.com
spring.mail.port=587
spring.mail.username=YOUR_SMTP_USERNAME
spring.mail.password=YOUR_SMTP_PASSWORD
```

---

## ✅ Verification Checklist

After configuration:

- [ ] Application properties file updated with correct SMTP settings
- [ ] Gmail App Password generated (if using Gmail)
- [ ] 2FA enabled on email account
- [ ] Application restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)
- [ ] Match notifications working
- [ ] Message notifications working
- [ ] Claim notifications working
- [ ] Error logging enabled
- [ ] Credentials secured (not in version control)

---

## 🆘 Support

If you continue to have issues:

1. Check backend console logs for detailed error messages
2. Verify email provider's documentation for correct settings
3. Test SMTP connection with a tool like Telnet:
   ```bash
   telnet smtp.gmail.com 587
   ```
4. Try a different email provider temporarily
5. Check if your organization/ISP blocks SMTP ports

---

## 📝 Notes

- **Development**: Use your personal Gmail with App Password
- **Production**: Use a dedicated email service
- **Without Email**: The platform works fine without email notifications - they're optional
- **Graceful Degradation**: If email fails, the app continues to work with in-app notifications only

---

## 🎉 Summary

Email notifications enhance the user experience but are **optional**. The platform works perfectly with just in-app notifications (bell icon). Configure email when ready for production or enhanced user engagement!

