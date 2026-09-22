import { ChecklistItem, PreventionCategory, PreventionAreaId } from '../types';

export interface HabitCluster {
  id: string;
  title: string;
  category: PreventionCategory;
  description: string;
  requiredItemIds: string[];
  recommendedPracticeId: PreventionAreaId;
  educationalDiagnosis: {
    healthy: string;
    partial: string;
    critical: string;
  };
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // ==========================================
  // ACCOUNT PROTECTION
  // ==========================================
  {
    id: 'mfa-primary-email',
    category: 'accounts',
    areaId: 'mfa',
    title: 'Enable MFA on Primary Email & Accounts',
    description: 'Protect your master email with multi-factor authentication (MFA) using a dedicated authenticator app or hardware passkey.',
    impact: 'essential',
    estimatedMinutes: 5,
    whyItMatters: 'Your email is the "skeleton key" to your entire digital identity. A breach on email lets hackers reset passwords across all banking, shopping, and social profiles.',
    howToGuide: 'Go to your email account settings (Google Account, Microsoft, Apple ID) > Security > 2-Step Verification. Choose Authenticator App and scan the QR code with Google Authenticator, Aegis, or Bitwarden.'
  },
  {
    id: 'password-manager-unique-passwords',
    category: 'accounts',
    areaId: 'passwords',
    title: 'Use a Password Manager with 100% Unique Passwords',
    description: 'Ensure every single website and online service has its own completely unique, random 16+ character password stored in an encrypted vault.',
    impact: 'essential',
    estimatedMinutes: 15,
    whyItMatters: 'Credential stuffing bots automatically test leaked combinations across hundreds of platforms. When passwords are unique, a breach on one service never compromises another.',
    howToGuide: 'Download a secure password manager like Bitwarden, 1Password, or Proton Pass. Start by replacing passwords for banking and email with 16+ character random passwords.'
  },
  {
    id: 'recovery-email-audit',
    category: 'accounts',
    areaId: 'account-recovery',
    title: 'Audit Recovery Email & Save Offline Backup Codes',
    description: 'Verify your recovery email and phone number are active, and physically print/store your single-use emergency backup codes.',
    impact: 'essential',
    estimatedMinutes: 8,
    whyItMatters: 'If you lose your phone or forget a password, verified recovery channels and printed backup codes are the only legitimate path to restore account access without permanent lockout.',
    howToGuide: 'Visit account Security settings > Recovery Info. Ensure secondary email is up-to-date. Download and print "Backup Codes" or "Recovery Codes" and store them with physical documents.'
  },
  {
    id: 'audit-logged-in-sessions',
    category: 'accounts',
    areaId: 'account-recovery',
    title: 'Audit and Revoke Active Logged-In Sessions',
    description: 'Review and terminate unfamiliar, outdated, or inactive sessions across Google, Apple, Microsoft, and banking accounts.',
    impact: 'recommended',
    estimatedMinutes: 6,
    whyItMatters: 'Old tablets, sold laptops, or hijacked browser cookies can retain active session tokens that grant unauthorized entry without asking for passwords.',
    howToGuide: 'Navigate to Security > "Your Devices" or "Active Sessions" on your main accounts. Click "Sign Out" or "Revoke" on any unrecognized device or old browser.'
  },
  {
    id: 'fictional-security-questions',
    category: 'accounts',
    areaId: 'passwords',
    title: 'Use Fictionalized Answers for Security Questions',
    description: 'Never answer "Mother’s maiden name" or "First pet" truthfully. Provide randomized passphrases stored in your vault.',
    impact: 'recommended',
    estimatedMinutes: 5,
    whyItMatters: 'Real biographical answers can be uncovered by social engineering or public genealogy records. Fictional answers make questions as strong as passwords.',
    howToGuide: 'Treat the security answer like a second password. For "City where you were born", enter a random string like "Purple-Penguin-44" and store it in your password manager vault.'
  },

  // ==========================================
  // DEVICE SECURITY
  // ==========================================
  {
    id: 'os-auto-updates',
    category: 'devices',
    areaId: 'software-updates',
    title: 'Turn On Automatic Operating System & Browser Updates',
    description: 'Ensure your phone, computer, tablet, and web browsers install critical security patches without manual delay.',
    impact: 'essential',
    estimatedMinutes: 3,
    whyItMatters: 'Over 80% of automated exploits target known vulnerabilities for which software patches have already been published by vendors.',
    howToGuide: 'Windows: Settings > Windows Update > Enable automatic updates. Mac: System Settings > General > Software Update > Enable Automatic Updates. Smartphone: Settings > Software Update > Automatic Download & Install.'
  },
  {
    id: 'device-biometric-pin',
    category: 'devices',
    areaId: 'device-security',
    title: 'Set Strong 6+ Digit Screen Lock & Auto-Lock (<= 2 Mins)',
    description: 'Replace simple 4-digit PINs with strong 6+ digit codes or alphanumeric passcodes, paired with Face/Fingerprint and short auto-lock timeouts.',
    impact: 'essential',
    estimatedMinutes: 3,
    whyItMatters: 'Physical theft or shoulder-surfing allows immediate access to your 2FA authenticators, emails, and payment apps if the screen lock is weak or slow to lock.',
    howToGuide: 'iOS/Android: Settings > Face ID & Passcode (or Biometrics) > Change Passcode > Passcode Options > 6-digit or Alphanumeric. Set "Auto-Lock" to 1 or 2 minutes.'
  },
  {
    id: 'trusted-apps-only',
    category: 'devices',
    areaId: 'device-security',
    title: 'Install Apps Exclusively from Trusted Official Stores',
    description: 'Refrain from sideloading APKs, downloading pirated software, or enabling unverified developer installation profiles.',
    impact: 'essential',
    estimatedMinutes: 4,
    whyItMatters: 'Cracked software and third-party APK stores are the dominant distribution channels for infostealer malware, banking trojans, and ransomware.',
    howToGuide: 'Keep Google Play Protect active. On Android, go to Settings > Apps > Special app access > Install unknown apps > Ensure all apps are set to "Not allowed".'
  },
  {
    id: 'three-two-one-backups',
    category: 'devices',
    areaId: 'device-security',
    title: 'Implement the 3-2-1 Data Backup Strategy',
    description: 'Keep 3 copies of important personal files, across 2 different media formats, with at least 1 copy stored offline or offsite.',
    impact: 'essential',
    estimatedMinutes: 20,
    whyItMatters: 'Ransomware, hardware failure, accidental deletion, or phone loss can obliterate years of memories and tax records in seconds without tested backups.',
    howToGuide: 'Keep data on your PC (Copy 1), an external hard drive stored disconnected in a drawer (Copy 2), and automated encrypted cloud storage like OneDrive/Backblaze/iCloud (Copy 3).'
  },
  {
    id: 'remote-wipe-find-my',
    category: 'devices',
    areaId: 'device-security',
    title: 'Configure Remote Wipe & Location Finding',
    description: 'Ensure Apple "Find My" or Google "Find My Device" is active, authorized, and tested across all mobile endpoints.',
    impact: 'recommended',
    estimatedMinutes: 4,
    whyItMatters: 'If your device is left in a vehicle or stolen, you can remotely lock it, display an owner contact number, or securely erase all personal files.',
    howToGuide: 'iOS: Settings > [Your Name] > Find My > Ensure "Find My iPhone" and "Send Last Location" are on. Android: Settings > Google > Find My Device.'
  },
  {
    id: 'full-disk-encryption',
    category: 'devices',
    areaId: 'device-security',
    title: 'Enable Full-Disk Encryption (BitLocker / FileVault)',
    description: 'Encrypt your computer storage so confidential data cannot be extracted if the physical drive is removed.',
    impact: 'advanced',
    estimatedMinutes: 5,
    whyItMatters: 'Without full-disk encryption, anyone with a live USB drive can read all unencrypted documents and photos on your laptop without needing your operating system password.',
    howToGuide: 'Mac: System Settings > Privacy & Security > FileVault > Turn On. Windows 11/10 Pro: Search "Manage BitLocker" in Start and turn on drive encryption. Save recovery key.'
  },

  // ==========================================
  // NETWORK & SAFE BROWSING
  // ==========================================
  {
    id: 'change-router-admin-password',
    category: 'network',
    areaId: 'safe-browsing',
    title: 'Change Default Home Wi-Fi Router Admin Credentials',
    description: 'Change the router administration login from "admin/admin" or factory default to a secure, unique passphrase.',
    impact: 'essential',
    estimatedMinutes: 10,
    whyItMatters: 'Attackers scan IP ranges for default router credentials to change DNS servers and silently reroute your browsing to fraudulent phishing portals.',
    howToGuide: 'Open your browser to 192.168.1.1 (or router gateway), log in using router sticker credentials, navigate to Administration > System Settings, and set a new strong admin password.'
  },
  {
    id: 'router-wpa3-guest-network',
    category: 'network',
    areaId: 'safe-browsing',
    title: 'Enable WPA2-AES/WPA3 & Segment IoT onto Guest Wi-Fi',
    description: 'Place smart home gadgets (cameras, smart bulbs, TVs) onto an isolated guest Wi-Fi network separate from laptops and phones.',
    impact: 'recommended',
    estimatedMinutes: 12,
    whyItMatters: 'Smart home IoT devices rarely receive regular security updates. If a smart bulb is compromised, guest network isolation prevents the hacker from reaching your computers.',
    howToGuide: 'In router settings, go to Wireless > Guest Network. Enable Guest SSID with WPA2/WPA3. Connect smart TVs, speakers, and IoT sensors to this network.'
  },
  {
    id: 'trusted-vpn-public-wifi',
    category: 'network',
    areaId: 'public-wifi',
    title: 'Use Cellular Hotspot or Audited VPN on Public Wi-Fi',
    description: 'Shield mobile and laptop network traffic whenever connecting to airport, coffee shop, or hotel wireless networks.',
    impact: 'recommended',
    estimatedMinutes: 5,
    whyItMatters: 'Public Wi-Fi networks can be unencrypted or spoofed by "Evil Twin" access points set up by nearby hackers to intercept browsing traffic and DNS lookups.',
    howToGuide: 'Use your phone’s cellular data hotspot for sensitive banking, or install an audited, no-logs VPN provider (such as Mullvad or ProtonVPN) configured with a kill-switch.'
  },
  {
    id: 'secure-dns-filtering',
    category: 'network',
    areaId: 'safe-browsing',
    title: 'Configure Protective DNS Filtering (Quad9 / Cloudflare)',
    description: 'Block malicious domains and phishing sites at the network layer automatically before your browser renders them.',
    impact: 'recommended',
    estimatedMinutes: 7,
    whyItMatters: 'Protective DNS servers block known malware distribution and phishing domains before your browser even begins downloading malicious content.',
    howToGuide: 'Configure your router or device DNS to Quad9 (9.9.9.9) or Cloudflare for Families (1.1.1.2). In Chrome/Firefox, enable "Use Secure DNS" and select Quad9.'
  },

  // ==========================================
  // FINANCIAL & ONLINE SHOPPING
  // ==========================================
  {
    id: 'upi-payment-pin-rule',
    category: 'financial',
    areaId: 'financial-safety',
    title: 'Enforce the Payment PIN Rule (PIN is ONLY to Send)',
    description: 'Internalize the golden rule of digital payments: you NEVER enter a PIN, password, or OTP to RECEIVE money.',
    impact: 'essential',
    estimatedMinutes: 2,
    whyItMatters: 'Scammers on marketplace platforms trick victims into scanning QR codes or approving collect requests claiming "Enter PIN to receive advance money", draining their bank balances.',
    howToGuide: 'Never enter a UPI PIN, banking PIN, or OTP when someone claims they are paying you. QR codes are strictly for SENDING payments, never receiving.'
  },
  {
    id: 'transaction-alerts-enabled',
    category: 'financial',
    areaId: 'financial-safety',
    title: 'Enable Instant SMS & Push Alerts for All Bank Charges',
    description: 'Set transaction notification threshold to $1 / ₹1 so any unauthorized test charge is detected immediately.',
    impact: 'essential',
    estimatedMinutes: 5,
    whyItMatters: 'Thieves test stolen cards with small charges before draining accounts. Instant alerts allow you to freeze cards within minutes, minimizing loss.',
    howToGuide: 'Log into banking mobile apps and credit card portals. Under Notifications / Alerts, enable Push Notifications and SMS for all debits and credit charges.'
  },
  {
    id: 'virtual-cards-online-shopping',
    category: 'financial',
    areaId: 'online-shopping',
    title: 'Use Virtual Cards or Apple/Google Pay for Web Purchases',
    description: 'Avoid typing physical debit card numbers into web storefronts. Use tokenized digital wallets or single-use virtual cards.',
    impact: 'recommended',
    estimatedMinutes: 5,
    whyItMatters: 'Web checkout forms can be compromised with digital card-skimming scripts (Magecart). Tokenized payments prevent merchants and skimmers from seeing your real card number.',
    howToGuide: 'Choose Apple Pay, Google Pay, or generate merchant-locked virtual cards via your bank app or services like Privacy.com.'
  },
  {
    id: 'credit-freeze',
    category: 'financial',
    areaId: 'financial-safety',
    title: 'Freeze Your Credit Files with the Major Credit Bureaus',
    description: 'Place a free security freeze on Experian, TransUnion, and Equifax credit files to block unauthorized loan applications.',
    impact: 'recommended',
    estimatedMinutes: 15,
    whyItMatters: 'A credit freeze prevents anyone from opening a credit card, loan, or mortgage in your name—even if an identity thief possesses your full SSN, birthdate, and address.',
    howToGuide: 'Visit official websites: experian.com/freeze, transunion.com/credit-freeze, and equifax.com/personal/credit-report-services. Freezing and unfreezing is 100% free by law.'
  },

  // ==========================================
  // PRIVACY & SCAM DEFENSE
  // ==========================================
  {
    id: 'scam-pause-reflex',
    category: 'scams',
    areaId: 'scam-prevention',
    title: 'Practice the 10-Minute Emotional Pause on Urgent Demands',
    description: 'Mandate a 10-minute pause reflex whenever an unsolicited call, message, or email creates sudden panic, excitement, or fear.',
    impact: 'essential',
    estimatedMinutes: 2,
    whyItMatters: 'Urgency is the fingerprint of a scam. Scammers induce panic (fake police arrest, electricity cut, courier parcel drugs) to disable your critical reasoning.',
    howToGuide: 'When panicked, say "I will call you back" and hang up. Verify claims by finding the organization’s official contact number through an independent web search.'
  },
  {
    id: 'app-permissions-audit',
    category: 'privacy',
    areaId: 'privacy',
    title: 'Audit App Permissions & Restrict Background Tracking',
    description: 'Revoke microphone, camera, contacts, and background location permissions from casual and non-essential applications.',
    impact: 'recommended',
    estimatedMinutes: 6,
    whyItMatters: 'Data harvesting SDKs inside casual apps build invasive behavioral and location dossiers that are sold to third-party ad brokers.',
    howToGuide: 'iOS: Settings > Privacy & Security > Permission Manager. Android: Settings > Privacy > Permission Manager. Set location to "While using" and disable "Precise Location" where unnecessary.'
  },
  {
    id: 'social-media-privacy-scrub',
    category: 'privacy',
    areaId: 'social-media',
    title: 'Scrub Public Social Media & Remove Birth Year and Phone',
    description: 'Set personal profiles to Friends Only and remove phone numbers, exact birth years, and home addresses from public directories.',
    impact: 'recommended',
    estimatedMinutes: 10,
    whyItMatters: 'Scammers scour Instagram, Facebook, and LinkedIn profiles for birthdays, school names, and family members to orchestrate spear-phishing and bypass security questions.',
    howToGuide: 'On Instagram/Facebook/LinkedIn, set privacy to "Friends / Connections Only". Remove phone number and email visibility, and never post photos of boarding passes or keys.'
  },
  {
    id: 'id-document-watermarking',
    category: 'privacy',
    areaId: 'pii-protection',
    title: 'Watermark Identity Document Copies & Use Masked IDs',
    description: 'Apply a handwritten diagonal purpose-watermark across shared ID photocopies and use Masked IDs (e.g. Masked Aadhaar).',
    impact: 'recommended',
    estimatedMinutes: 4,
    whyItMatters: 'Unwatermarked ID copies left with hotels, car rentals, or unverified agents are frequently leaked and reused by fraudsters to open unauthorized bank accounts and SIM cards.',
    howToGuide: 'Draw a diagonal line across the ID copy and write: "Provided solely to [Organization] for [Specific Purpose] on [Date]". In India, download Masked Aadhaar from UIDAI.'
  }
];

// ==========================================
// HABIT CLUSTERS (FOR INCOMPLETE HABIT DIAGNOSIS)
// ==========================================
export const HABIT_CLUSTERS: HabitCluster[] = [
  {
    id: 'cluster-account-protection',
    title: 'Account Protection',
    category: 'accounts',
    description: 'MFA, unique passwords, recovery email verification, and session auditing.',
    requiredItemIds: [
      'mfa-primary-email',
      'password-manager-unique-passwords',
      'recovery-email-audit',
      'audit-logged-in-sessions'
    ],
    recommendedPracticeId: 'passwords',
    educationalDiagnosis: {
      healthy: 'Robust credential defense. Accounts are shielded against automated credential stuffing and unauthorized session hijackings.',
      partial: 'Gaps detected in account security. Missing MFA or unverified recovery channels leave primary accounts vulnerable to credential stuffing.',
      critical: 'High exposure. Passwords may be reused and lack a second verification factor, exposing banking, email, and social accounts.'
    }
  },
  {
    id: 'cluster-device-security',
    title: 'Device Security',
    category: 'devices',
    description: 'Operating system updates, strong screen lock, trusted apps, and resilient backups.',
    requiredItemIds: [
      'os-auto-updates',
      'device-biometric-pin',
      'trusted-apps-only',
      'three-two-one-backups'
    ],
    recommendedPracticeId: 'device-security',
    educationalDiagnosis: {
      healthy: 'Hardened device posture. Endpoints are patched, encrypted, physically protected, and resilient against data loss.',
      partial: 'Partial endpoint protection. Unverified backups, delayed updates, or weak screen locks increase risk of data loss or physical compromise.',
      critical: 'Device vulnerabilities present. Unpatched systems, untrusted app sources, or missing backups leave devices open to ransomware and theft.'
    }
  },
  {
    id: 'cluster-network-browsing',
    title: 'Network & Safe Browsing',
    category: 'network',
    description: 'Secure router credentials, public Wi-Fi defense, protective DNS, and HTTPS enforcement.',
    requiredItemIds: [
      'change-router-admin-password',
      'trusted-vpn-public-wifi',
      'secure-dns-filtering'
    ],
    recommendedPracticeId: 'safe-browsing',
    educationalDiagnosis: {
      healthy: 'Protected network perimeter. Wireless traffic and web domains are filtered and guarded against interception.',
      partial: 'Network blindspots identified. Connecting to untrusted public Wi-Fi without VPN or using default router credentials poses risk.',
      critical: 'Unprotected network access. Default router passwords or open public Wi-Fi exposure can allow Man-in-the-Middle eavesdropping.'
    }
  },
  {
    id: 'cluster-financial-safety',
    title: 'Financial & Payment Safety',
    category: 'financial',
    description: 'UPI/payment PIN discipline, instant transaction alerts, virtual cards, and credit freezes.',
    requiredItemIds: [
      'upi-payment-pin-rule',
      'transaction-alerts-enabled',
      'virtual-cards-online-shopping'
    ],
    recommendedPracticeId: 'financial-safety',
    educationalDiagnosis: {
      healthy: 'Strong financial safeguards. Real-time monitoring and tokenized payment habits prevent unauthorized account draining.',
      partial: 'Moderate financial risk. Lack of instant charge alerts or using raw debit cards on web storefronts elevates exposure.',
      critical: 'Elevated financial risk. Unawareness of UPI receiving rules or missing transaction alerts leaves funds unprotected.'
    }
  },
  {
    id: 'cluster-privacy-scams',
    title: 'Privacy & Scam Defense',
    category: 'privacy',
    description: 'Emotional pause reflex for high-pressure scams, app permission minimization, and PII masking.',
    requiredItemIds: [
      'scam-pause-reflex',
      'app-permissions-audit',
      'social-media-privacy-scrub',
      'id-document-watermarking'
    ],
    recommendedPracticeId: 'scam-prevention',
    educationalDiagnosis: {
      healthy: 'Proactive privacy and cognitive scam defense. Sensitive data is minimized and emotional manipulation is recognized.',
      partial: 'Privacy leaks present. Public social profiles, unwatermarked ID copies, or excessive app permissions allow targeted profiling.',
      critical: 'Vulnerable to social engineering. High-pressure pretexts and public oversharing expose you to impersonation and identity theft.'
    }
  }
];
