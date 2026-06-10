export const EXAMPLES = [
  {
    label: 'Login flow',
    text: `As a registered user, I want to log in to my account using my email address and password so that I can access my personalised dashboard and account features.

The system must validate credentials against stored records. After 5 consecutive failed login attempts, the account should be locked for 15 minutes. A successful login redirects the user to their dashboard. Users can opt to stay logged in via a "Remember me" checkbox, keeping their session active for 30 days.`,
  },
  {
    label: 'Payment processing',
    text: `As a customer, I want to complete a purchase using my credit or debit card so that I can buy products from the store.

The system must accept Visa, Mastercard, and Amex cards. Card details must be validated in real-time (card number, expiry, CVV). On successful payment, the user receives an order confirmation email with an order number. If the payment fails, the user is shown an appropriate error and prompted to retry or use a different payment method. No card details should be stored on our servers — all processing goes through the payment gateway.`,
  },
  {
    label: 'Search functionality',
    text: `As a user, I want to search for products by keyword so that I can quickly find items I want to purchase.

The search bar should be accessible from all pages. Results should appear within 2 seconds. The system should return relevant results ranked by relevance score, displaying product name, image, price, and availability. If no results are found, a friendly "no results" message with suggestions should be shown. Search should support partial matches and be case-insensitive. Users can filter results by category, price range, and availability.`,
  },
  {
    label: 'User registration',
    text: `As a new visitor, I want to create an account using my email address and a password so that I can access personalised features of the platform.

The registration form must collect: first name, last name, email address, and password. Email addresses must be unique — if the email is already registered, the user should be shown an error with a link to log in. Password must be at least 8 characters and contain at least one uppercase letter, one number, and one special character. On successful registration, a verification email is sent to the user's email address. The account remains inactive until the email is verified. Verification links expire after 24 hours.`,
  },
  {
    label: 'File upload',
    text: `As a user, I want to upload documents to my account so that I can store and share files within the platform.

Accepted file types are PDF, DOCX, XLSX, PNG, and JPG. Maximum file size is 25MB per file. Users can upload up to 5 files at once. A progress bar must show upload progress in real time. On success, the file appears in the user's document library with filename, size, and upload timestamp. If the file type is unsupported or exceeds the size limit, a clear error message must be shown before upload begins. Uploaded files must be virus-scanned before being made available for download.`,
  },
  {
    label: 'Two-factor authentication',
    text: `As a registered user, I want to enable two-factor authentication (2FA) on my account so that my account is protected even if my password is compromised.

Users can enable 2FA from their account security settings. Supported methods: authenticator app (TOTP) and SMS. When 2FA is enabled, users must enter a 6-digit code after entering their password on login. TOTP codes are valid for 30 seconds. SMS codes are valid for 10 minutes. If the code is incorrect 3 times consecutively, the login attempt is blocked and the user is notified by email. Users can generate single-use backup codes (10 codes) in case they lose access to their 2FA device.`,
  },
  {
    label: 'Shopping cart',
    text: `As a customer, I want to add products to a shopping cart and manage my selection before checkout so that I can purchase multiple items in a single transaction.

Users can add items to the cart from any product page. The cart must persist across sessions for logged-in users and for 7 days for guest users (via cookie). Users can update item quantities or remove items from the cart. The cart must display item name, unit price, selected quantity, line total, and order total including applicable taxes. If an item goes out of stock after being added to the cart, the user must be notified at checkout with the option to remove the item or save it to a wishlist. Applying a promo code must update the total in real time.`,
  },
  {
    label: 'Email notifications',
    text: `As a user, I want to manage my email notification preferences so that I only receive emails that are relevant to me.

Users can access notification preferences from their account settings. Notification categories include: order updates, promotional offers, product restocks, account security alerts, and weekly digest. Each category can be individually enabled or disabled. Security alert emails (e.g. password change, new device login) cannot be disabled. Changes to preferences must be saved immediately and take effect within 1 hour. Users can also unsubscribe from all non-essential emails via a one-click link at the bottom of any marketing email. Unsubscribe must not require the user to be logged in.`,
  },
  {
    label: 'User profile update',
    text: `As a registered user, I want to update my profile information so that my account details remain accurate.

Users can edit: first name, last name, phone number, date of birth, and profile photo. Email address changes require re-verification — a confirmation link is sent to the new email before the change takes effect. Profile photos must be JPG or PNG, maximum 5MB, and are cropped to a square aspect ratio on upload. Phone number must be validated for correct format. Changes are saved on form submission and reflected immediately across the platform. An activity log entry must be created for each profile change, visible to the user in their account settings.`,
  },
  {
    label: 'Order tracking',
    text: `As a customer, I want to track the status of my order in real time so that I know when to expect my delivery.

Order tracking must be accessible from the order confirmation email and from the user's order history page. Tracking statuses are: Order Placed, Payment Confirmed, Processing, Dispatched, Out for Delivery, Delivered. Each status change must trigger an email and (if enabled) a push notification. The tracking page must show the current status, estimated delivery date, courier name, and tracking number with a link to the courier's tracking page. If a delivery attempt fails, the user must be notified with instructions on how to rearrange delivery. Guest users can track orders using order number and email address.`,
  },
  {
    label: 'Subscription & billing',
    text: `As a user, I want to subscribe to a paid plan and manage my billing details so that I can access premium features.

Available plans: Free, Pro (monthly/annual), Enterprise (custom). Users can upgrade, downgrade, or cancel at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of the current billing period. Cancellation stops renewal but retains access until the period ends. Payment methods accepted: Visa, Mastercard, Amex. Users receive an invoice by email after each successful charge. If a payment fails, the user is notified by email and given a 7-day grace period to update payment details before access is restricted. All billing history must be viewable from the account settings page.`,
  },
  {
    label: 'Password reset',
    text: `As a registered user, I want to reset my password using my registered email address so that I can regain access to my account if I forget my password.

The system must send a password reset link to the registered email within 2 minutes of the request. The reset link must be valid for 24 hours and expire immediately after use (single-use). The new password must meet the same complexity requirements as registration. If the email address is not registered, the system must show a generic confirmation message to prevent account enumeration. Users must be logged out of all other active sessions after a successful password reset. A confirmation email must be sent after the password is changed successfully.`,
  },
  {
    label: 'Data export',
    text: `As a user, I want to export my account data so that I have a personal copy of my information for compliance and portability purposes.

Users can request a full data export from their account settings. Exported data must include: profile information, activity history, uploaded files, and transaction records. The export is generated asynchronously — the user receives an email with a secure download link when the file is ready. The download link must expire after 48 hours. The export file must be in ZIP format containing a JSON file for structured data and a folder for uploaded files. A new export request cannot be made while one is already in progress. The system must log all export requests with timestamp and IP address for audit purposes.`,
  },
]
