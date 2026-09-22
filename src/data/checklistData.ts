import { ChecklistItem } from '../types';

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Accounts Category
  {
    id: 'mfa-primary-email',
    category: 'accounts',
    title: 'Enable MFA on Primary Email Account',
    description: 'Protect your master email with multi-factor authentication (MFA) using an authenticator app.',
    impact: 'essential',
    estimatedMinutes: 5,
    whyItMatters: 'Your email is the "skeleton key" to your entire digital life. If a hacker accesses your email, they can reset passwords on your bank, social accounts, and shopping profiles.',
    howToGuide: 'Go to your email account settings (Google Account, Microsoft, Apple ID) > Security > 2-Step Verification. Choose Authenticator App and scan the QR code with Google Authenticator or Bitwarden.'
  },
  {
    id: 'password-manager-unique-passwords',
    category: 'accounts',
    title: 'Use a Password Manager with Zero Reused Passwords',
    description: 'Ensure every single website and online service has its own completely unique, random password.',
    impact: 'essential',
    estimatedMinutes: 15,
    whyItMatters: 'Credential stuffing bots test leaked logins across hundreds of platforms. When passwords are unique, a breach on one site never harms your other accounts.',
    howToGuide: 'Download a secure password manager like Bitwarden, 1Password, or Proton Pass. Start by replacing passwords for banking and email with 16+ character random passwords.'
  },
  {
    id: 'audit-logged-in-sessions',
    category: 'accounts',
    title: 'Audit Active Logged-In Devices and Sessions',
    description: 'Review and terminate unfamiliar or outdated active sessions across Google, Apple, Microsoft, and banking accounts.',
    impact: 'recommended',
    estimatedMinutes: 8,
    whyItMatters: 'Old tablets, sold laptops, or compromised browser sessions might still maintain valid authentication tokens to your accounts.',
    howToGuide: 'Navigate to Security > "Your Devices" or "Active Sessions" on your main accounts. Click "Sign Out" on any unrecognized device or old browser.'
  },
  {
    id: 'fictional-security-questions',
    category: 'accounts',
    title: 'Use Fictional Answers for Security Questions',
    description: 'Do not answer "What is your mother’s maiden name?" truthfully. Use randomized passphrases.',
    impact: 'recommended',
    estimatedMinutes: 5,
    whyItMatters: 'Real answers can be unearthed from public genealogy records, social media, or high school yearbooks.',
    howToGuide: 'Treat the security answer like a second password. For "City where you were born", enter a random string like "Purple-Penguin-44" and store it in your password manager vault.'
  },

  // Devices Category
  {
    id: 'os-auto-updates',
    category: 'devices',
    title: 'Turn On Automatic Operating System Updates',
    description: 'Ensure your phone, computer, and tablet install critical security patches without manual intervention.',
    impact: 'essential',
    estimatedMinutes: 3,
    whyItMatters: 'Over 80% of automated zero-day exploits target known vulnerabilities for which patches have already been published.',
    howToGuide: 'Windows: Settings > Windows Update > Advanced options > Turn on "Receive updates for other Microsoft products" and set active hours. Mac: System Settings > General > Software Update > Enable Automatic Updates.'
  },
  {
    id: 'device-biometric-pin',
    category: 'devices',
    title: 'Set Strong Alphanumeric Screen Lock PIN / Biometrics',
    description: 'Replace simple 4-digit PINs with strong 6+ digit codes or alphanumeric passcodes, plus Face/Fingerprint.',
    impact: 'essential',
    estimatedMinutes: 3,
    whyItMatters: 'Physical theft or shoulder-surfing allows instantaneous access to your 2FA authenticators, emails, and payment wallets.',
    howToGuide: 'iOS/Android: Settings > Face ID & Passcode (or Biometrics) > Change Passcode > Passcode Options > Custom Alphanumeric Code.'
  },
  {
    id: 'remote-wipe-find-my',
    category: 'devices',
    title: 'Configure Remote Wipe & Location Finding',
    description: 'Ensure "Find My Device" (Apple Find My or Google Find Hub) is active and tested.',
    impact: 'recommended',
    estimatedMinutes: 4,
    whyItMatters: 'If your device is left in a taxi or stolen, you can remotely lock it, display a contact message, or erase all confidential data.',
    howToGuide: 'iOS: Settings > [Your Name] > Find My > Ensure "Find My iPhone" and "Send Last Location" are on. Android: Settings > Google > Find My Device.'
  },
  {
    id: 'full-disk-encryption',
    category: 'devices',
    title: 'Enable Full-Disk Encryption (BitLocker / FileVault)',
    description: 'Encrypt your computer hard drive so data cannot be extracted if the drive is physically removed.',
    impact: 'advanced',
    estimatedMinutes: 5,
    whyItMatters: 'Without encryption, anyone with a $10 USB drive can boot a live operating system on your laptop and read all personal files without typing your Windows/Mac login.',
    howToGuide: 'Mac: System Settings > Privacy & Security > FileVault > Turn On. Windows (Pro/Enterprise): Search "Manage BitLocker" in Start and turn on drive encryption.'
  },

  // Network Category
  {
    id: 'change-router-admin-password',
    category: 'network',
    title: 'Change Default Home Wi-Fi Router Admin Credentials',
    description: 'Change the router administration login from "admin/admin" or factory default to a secure passphrase.',
    impact: 'essential',
    estimatedMinutes: 10,
    whyItMatters: 'Attackers scan IP ranges for default router credentials to change DNS servers and secretly reroute your browsing to fake phishing sites.',
    howToGuide: 'Find your router gateway address (usually 192.168.1.1 or 192.168.0.1 in browser), log in using sticker credentials, go to Administration/System Settings, and set a new strong admin password.'
  },
  {
    id: 'router-wpa3-guest-network',
    category: 'network',
    title: 'Enable WPA2-AES / WPA3 & Create a Guest Network for IoT',
    description: 'Segment smart home devices (cameras, smart bulbs, smart TVs) onto an isolated guest Wi-Fi network.',
    impact: 'recommended',
    estimatedMinutes: 12,
    whyItMatters: 'Smart home gadgets rarely receive regular security updates. If a smart bulb is compromised, guest network isolation prevents the hacker from reaching your laptop or phone.',
    howToGuide: 'In router settings, go to Wireless > Guest Network. Enable Guest SSID with WPA2/WPA3. Connect smart TVs, speakers, and IoT sensors to this network.'
  },
  {
    id: 'trusted-vpn-public-wifi',
    category: 'network',
    title: 'Install a Trustworthy VPN for Public Wi-Fi Usage',
    description: 'Shield mobile and laptop network traffic whenever connecting to coffee shops, airports, or hotels.',
    impact: 'recommended',
    estimatedMinutes: 8,
    whyItMatters: 'Public Wi-Fi networks can be unencrypted or spoofed by "evil twin" access points designed to intercept browsing traffic.',
    howToGuide: 'Install an audited, no-logs VPN provider (such as Mullvad, ProtonVPN, or IVPN). Configure it to "Auto-Connect on Unsecured Networks".'
  },
  {
    id: 'secure-dns-filtering',
    category: 'network',
    title: 'Configure Secure Protective DNS (e.g., Quad9 or Cloudflare 1.1.1.2)',
    description: 'Block malicious domains and phishing sites at the network layer automatically.',
    impact: 'advanced',
    estimatedMinutes: 7,
    whyItMatters: 'Protective DNS servers block known malware and phishing domains before your browser even begins downloading them.',
    howToGuide: 'Configure your router or device DNS to Quad9 (9.9.9.9) or Cloudflare for Families (1.1.1.2 / 1.0.0.2). In Chrome/Firefox, enable "Use Secure DNS" with Quad9.'
  },

  // Privacy & Data Category
  {
    id: 'three-two-one-backups',
    category: 'privacy',
    title: 'Implement the 3-2-1 Data Backup Strategy',
    description: 'Keep 3 copies of important files, across 2 different media formats, with 1 offline or offsite.',
    impact: 'essential',
    estimatedMinutes: 20,
    whyItMatters: 'Ransomware, hardware degradation, house fires, or accidental deletion can destroy decades of personal memories and tax documents in seconds.',
    howToGuide: 'Keep data on your PC (Copy 1), an external hard drive stored disconnected in a drawer (Copy 2), and automated encrypted cloud storage like OneDrive/Backblaze (Copy 3).'
  },
  {
    id: 'credit-freeze',
    category: 'privacy',
    title: 'Freeze Your Credit with the Three Major Bureaus',
    description: 'Place a free security freeze on Experian, TransUnion, and Equifax credit files.',
    impact: 'recommended',
    estimatedMinutes: 15,
    whyItMatters: 'A credit freeze prevents anyone from opening a credit card, loan, or mortgage in your name—even if they possess your full SSN, birthdate, and address.',
    howToGuide: 'Visit the official websites: experian.com/freeze, transunion.com/credit-freeze, and equifax.com/personal/credit-report-services. Freezing and unfreezing is 100% free by federal law.'
  },
  {
    id: 'app-permissions-audit',
    category: 'privacy',
    title: 'Audit App Permissions & Location Tracking',
    description: 'Revoke microphone, camera, contacts, and background location permissions from non-essential apps.',
    impact: 'recommended',
    estimatedMinutes: 6,
    whyItMatters: 'Data harvesting brokers purchase smartphone location histories and app telemetries to build detailed behavioural profiles for tracking and targeting.',
    howToGuide: 'iOS: Settings > Privacy & Security > Permission Manager. Android: Settings > Privacy > Permission manager. Set Location to "While using" and turn off "Precise Location" where unnecessary.'
  },
  {
    id: 'social-media-privacy-scrub',
    category: 'privacy',
    title: 'Scrub Public Social Media Profiles & Remove Phone Numbers',
    description: 'Set personal profiles to Friends Only and remove phone numbers from public search directories.',
    impact: 'recommended',
    estimatedMinutes: 10,
    whyItMatters: 'Scammers scour Facebook, Instagram, and LinkedIn profiles for birth dates, family names, and company org charts to orchestrate spear-phishing.',
    howToGuide: 'On Facebook/Instagram/LinkedIn, go to Settings > Privacy > "Who can see your future posts?" set to Friends. Set phone number and email visibility to "Only Me".'
  }
];
