import { CybercrimeCategory } from '../types';

export const INDIA_REPORTING_INFO = {
  helplineNumber: '1930',
  helplineName: 'National Cyber Crime Reporting Helpline',
  portalUrl: 'https://cybercrime.gov.in/',
  portalLabel: 'Official Government Portal',
  portalName: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
  disclaimer: 'CyberSafe is an academic community project and is NOT affiliated with the Government of India, police departments, or any official law enforcement authority. CyberSafe does not accept, record, or submit cybercrime reports.'
};

export const EVIDENCE_CHECKLIST_ITEMS = [
  {
    id: 'screenshots',
    label: 'Screenshots of Messages, Posts, or Screen Popups',
    description: 'Capture full screens showing timestamps, user handles, message headers, or scam dialogs before they are deleted or modified.'
  },
  {
    id: 'urls',
    label: 'Exact URLs & Web Addresses',
    description: 'Copy the full URL from the browser address bar (e.g., https://fake-bank-login.xyz/auth). Do not re-visit or click the link again.'
  },
  {
    id: 'phone_numbers',
    label: 'Phone Numbers & Call Logs',
    description: 'Document the exact mobile or landline numbers used by the scammer, including caller IDs, SMS sender headers, or WhatsApp/Telegram numbers.'
  },
  {
    id: 'email_addresses',
    label: 'Email Addresses & Full Email Headers',
    description: 'Save the sender’s full email address and download or export the raw original email headers (.eml or "Show Original") showing routing IPs.'
  },
  {
    id: 'transaction_ids',
    label: 'Bank Transaction IDs, UTR & Reference Numbers',
    description: 'Record the Unique Transaction Reference (UTR), UPI reference number, credit card charge reference, or wallet transfer IDs from your bank statement.'
  },
  {
    id: 'timestamps',
    label: 'Exact Timestamps & Date Records',
    description: 'Note the exact time, date, and time zone each call, transaction, or suspicious message occurred. Timelines are vital for bank freeze requests.'
  },
  {
    id: 'messages_chats',
    label: 'Full Chat Logs & Communication History',
    description: 'Export or backup chat histories from WhatsApp, Telegram, SMS, or direct messages before the perpetrator unsends messages.'
  },
  {
    id: 'relevant_files',
    label: 'Relevant Downloaded Files or Invoices',
    description: 'Keep downloaded files (e.g. fake invoices, APK installers, remote access logs) in an isolated folder without opening or executing them.'
  }
];

export const REPORT_CATEGORIES: CybercrimeCategory[] = [
  {
    id: 'financial-fraud',
    title: 'Financial Cyber Fraud',
    iconName: 'CreditCard',
    tagline: 'Unauthorized UPI transfers, debit/credit card charges, fake lottery wins, or investment app scams',
    whatHappened: [
      'Unauthorized deductions via UPI, Net Banking, or Credit/Debit cards',
      'Trickery involving fake UPI "Collect Request" or "Scan this QR code to receive money"',
      'High-yield "Part-time task", Ponzi scheme, or bogus stock trading/crypto app fraud',
      'SIM-swap fraud leading to stolen banking OTPs and drained accounts'
    ],
    evidenceToPreserve: [
      'Bank transaction reference numbers (UTR, Transaction ID, Debit SMS)',
      'Account statements highlighting the unauthorized debits',
      'Beneficiary UPI ID or bank account numbers provided by the scammer',
      'Screenshots of the payment receipt, chat transcripts, or calling numbers'
    ],
    immediateSafetySteps: [
      'Call National Cyber Crime Helpline: 1930 immediately (the first "Golden Hours" offer the highest chance of freezing illicit transfers).',
      'Call your bank’s 24/7 emergency fraud department immediately to block cards, freeze net banking, and register an internal dispute.',
      'File an official complaint on https://cybercrime.gov.in/ within 24 hours.',
      'Change passwords for your net banking and email accounts from a safe device.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Helpline (India)',
        description: 'Toll-free emergency helpline for immediate reporting of financial cyber fraud to facilitate lien/freeze of funds.',
        helpline: '1930',
        isOfficialGov: true
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India portal for filing cybercrime complaints.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'Your Bank Fraud Grievance Officer',
        description: 'Call the official fraud hotline printed on the back of your debit/credit card or your bank mobile app.'
      }
    ]
  },
  {
    id: 'phishing-scam',
    title: 'Phishing / Online Scam',
    iconName: 'MailWarning',
    tagline: 'Deceptive emails, fake delivery SMS, electricity bill threats, or deceptive parcel notices',
    whatHappened: [
      'SMS claiming your electricity/power connection will be disconnected tonight unless you call a number',
      'Messages regarding expired PAN / KYC cards with a link to a fake banking portal',
      'Courier parcel notices (India Post / courier) claiming address correction fees',
      'Fake lottery, cashback, or reward point redemption websites'
    ],
    evidenceToPreserve: [
      'Exact phishing URL/link (do not open or click it again)',
      'Screenshot of the incoming SMS or email displaying sender header/ID',
      'Caller phone numbers or IVR audio if a phone call took place',
      'Email headers (.eml file) if received over email'
    ],
    immediateSafetySteps: [
      'If you submitted passwords or banking PINs, change your credentials immediately from a known clean device.',
      'If you downloaded an APK file or granted remote access, turn off Wi-Fi/mobile data and uninstall the app.',
      'Forward suspicious SMS messages to your telecom provider (e.g. 1909 or carrier spam reporting).',
      'Report the incident on the official cybercrime portal.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'File under the "Report Other Cyber Crimes" or "Financial Fraud" section as appropriate.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'DoT Chakshu Portal (Sanchar Saathi)',
        description: 'Department of Telecommunications portal to report suspected fraud communications received over SMS/WhatsApp.',
        url: 'https://sancharsaathi.gov.in/sfc/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'account-hacking',
    title: 'Account Hacking & Takeover',
    iconName: 'Lock',
    tagline: 'Unauthorized access to your Gmail, Instagram, WhatsApp, or cloud storage accounts',
    whatHappened: [
      'You are locked out of your account with credentials or recovery email changed without your permission',
      'Friends receive messages from your profile asking for urgent money or gift cards',
      'Unknown devices or international IP addresses appearing in your active sessions history',
      'WhatsApp account registration code requested by someone pretending to be a friend'
    ],
    evidenceToPreserve: [
      'Notification emails from the platform stating "Your password was changed" or "New login from unknown device"',
      'Screenshots of unauthorized messages or posts published from your account',
      'IP addresses, browser details, and timestamps shown in recent activity logs'
    ],
    immediateSafetySteps: [
      'Use the platform official account recovery flow from a device you normally use.',
      'Select "Log out of all other sessions / devices" in security settings.',
      'Change the master password to a strong 15+ character passphrase.',
      'Enable Multi-Factor Authentication (MFA) using an authenticator app (not SMS if SIM-swap is suspected).',
      'Alert close friends and family via telephone that your account was compromised and to ignore money requests.'
    ],
    whereToReport: [
      {
        name: 'Platform Official Account Recovery',
        description: 'Submit an account recovery request directly on Google, Meta (Instagram/Facebook), or WhatsApp support.'
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Report unauthorized account intrusion or cyber attacks to law enforcement.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'fake-profile',
    title: 'Fake Profile / Impersonation',
    iconName: 'UserX',
    tagline: 'Someone creating counterfeit social media accounts using your name, photos, or identity',
    whatHappened: [
      'A fake Instagram, Facebook, or LinkedIn account using your profile photos and name',
      'A scammer messaging your colleagues or relatives pretending to be you and asking for money',
      'Executive / CEO impersonation targeting employees in your organization'
    ],
    evidenceToPreserve: [
      'Direct URL link to the fraudulent impersonation profile',
      'Screenshots of the fake profile, bio, photos, and messages sent by the imposter',
      'Your original profile URL and government ID (for verification when filing report to the platform)'
    ],
    immediateSafetySteps: [
      'Do not engage with or message the impersonator directly.',
      'Report the profile directly to the social media platform using their built-in "Report Impersonation" feature.',
      'Post a public advisory on your real profile alerting your contacts to block and report the fake page.',
      'File an impersonation complaint on the National Cyber Crime Portal.'
    ],
    whereToReport: [
      {
        name: 'Social Media Platform Trust & Safety',
        description: 'Use the platform in-app reporting tool: Report Profile > Pretending to be someone > Me.'
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Report under "Report Cyber Crime against Women/Children" or "Report Other Cyber Crime".',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'cyberbullying-harassment',
    title: 'Cyberbullying, Stalking & Harassment',
    iconName: 'AlertOctagon',
    tagline: 'Persistent online threats, abusive messages, blackmail, doxxing, or non-consensual image sharing',
    whatHappened: [
      'Repeated threatening, intimidating, or abusive messages across platforms',
      'Doxxing: your private address, phone number, or personal details leaked publicly without consent',
      'Sextortion or blackmail threats demanding money or additional photos',
      'Morphing of personal photographs or non-consensual intimate image distribution'
    ],
    evidenceToPreserve: [
      'Full screenshots of all abusive chats, comments, emails, or posts with timestamps and profile handles',
      'Direct links (URLs) to abusive posts or profiles',
      'Do not delete the conversation thread as it serves as vital legal proof'
    ],
    immediateSafetySteps: [
      'Do NOT pay money or give in to blackmail demands (extortionists will continue demanding more).',
      'Preserve all evidence before blocking the perpetrator on communication channels.',
      'If non-consensual intimate images are involved, use StopNCII.org to generate hashes to prevent upload.',
      'For emergency physical safety concerns, dial 112 (National Emergency Response System).'
    ],
    whereToReport: [
      {
        name: 'Special Women & Child Cyber Crime Reporting (cybercrime.gov.in)',
        description: 'Dedicated section with options to file complaints anonymously or report sexually explicit content.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'Emergency Police Response (India)',
        description: 'Dial 112 for immediate police intervention if you face physical danger or urgent stalking threats.',
        helpline: '112',
        isOfficialGov: true
      },
      {
        name: 'StopNCII.org',
        description: 'Non-profit platform that generates secure digital hashes from your device to stop intimate image distribution across major social media.',
        url: 'https://stopncii.org/'
      }
    ]
  },
  {
    id: 'identity-theft',
    title: 'Identity Theft',
    iconName: 'ShieldAlert',
    tagline: 'Misuse of Aadhaar, PAN, voter ID, or personal data to take loans, obtain SIM cards, or commit fraud',
    whatHappened: [
      'Unrecognized personal loans or credit card inquiries appearing on your CIBIL / Experian credit report',
      'Unauthorized mobile SIM cards issued in your name without your knowledge',
      'Fraudulent tax refund filings or impersonation with financial institutions using your documents'
    ],
    evidenceToPreserve: [
      'Copies of your credit score report showing the unauthorized inquiries or loan accounts',
      'Letters or emails from lenders or recovery agencies regarding unfamiliar debts',
      'List of mobile connections registered against your Aadhaar via DoT TAFCOP portal'
    ],
    immediateSafetySteps: [
      'Lock your Aadhaar biometrics using the official mAadhaar app or UIDAI portal (uidai.gov.in).',
      'Check active SIM connections registered against your ID using the official DoT portal (tafcop.sancharsaathi.gov.in) and report unknown numbers.',
      'File an official complaint with the concerned bank / lending institution disputing the accounts.',
      'Register an official identity theft FIR on the National Cyber Crime Reporting Portal.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'File under "Identity Theft / Impersonation" with your evidence attached.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'DoT TAFCOP Portal (Sanchar Saathi)',
        description: 'Check SIM cards issued against your identity documents and submit disconnection requests.',
        url: 'https://tafcop.sancharsaathi.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'UIDAI Aadhaar Lock Portal',
        description: 'Lock your biometric credentials to prevent unauthorized authentication attempts.',
        url: 'https://myaadhaar.uidai.gov.in/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'malicious-website',
    title: 'Malicious Website / Fake Portal',
    iconName: 'Globe',
    tagline: 'Counterfeit government websites, fake job recruitment portals, or malicious software distribution sites',
    whatHappened: [
      'Counterfeit e-challan or electricity payment portals designed to steal card details',
      'Fake government service portals charging illegal fees for Aadhaar or passport appointments',
      'Fake recruitment portals demanding "registration fees" for guaranteed jobs'
    ],
    evidenceToPreserve: [
      'Full web address (URL) of the fraudulent website',
      'Payment receipts or UPI transactions if fees were paid',
      'Screenshots of the website layout showing fake government logos or certifications'
    ],
    immediateSafetySteps: [
      'Do not input any additional information, bank accounts, or documents.',
      'If payment was made, call 1930 and your bank immediately.',
      'Submit the malicious URL to Google Safe Browsing and CERT-In for domain blocking.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Report malicious or deceptive websites under Other Cyber Crime.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'CERT-In (Indian Computer Emergency Response Team)',
        description: 'National nodal agency for responding to cybersecurity incidents in India.',
        url: 'https://www.cert-in.org.in/',
        helpline: '1800-11-4949',
        isOfficialGov: true
      },
      {
        name: 'Google Safe Browsing Report Phishing',
        description: 'Flag deceptive URLs to protect web browser users globally.',
        url: 'https://safebrowsing.google.com/safebrowsing/report_phish/'
      }
    ]
  },
  {
    id: 'other-cybercrime',
    title: 'Other Cybercrime Incidents',
    iconName: 'Shield',
    tagline: 'Ransomware attacks, online gaming scams, cryptocurrency fraud, or hardware tampering',
    whatHappened: [
      'Ransomware locking business or personal computer files demanding cryptocurrency',
      'Fake lottery or gaming tournament prize scams',
      'Illegal spyware installed on personal devices by unverified service centers'
    ],
    evidenceToPreserve: [
      'Ransom note files or screen photos with payment demand details',
      'Log files, file extensions, and timestamps of infected devices',
      'Communication logs and wallet addresses provided by criminals'
    ],
    immediateSafetySteps: [
      'Disconnect infected devices from Wi-Fi, LAN cables, and Bluetooth immediately.',
      'Do not pay ransoms; contact official cybersecurity authorities.',
      'Seek professional technical assistance and file a report on cybercrime.gov.in.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India reporting portal.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'National Cyber Crime Helpline',
        description: 'Direct telephonic assistance across India.',
        helpline: '1930',
        isOfficialGov: true
      }
    ]
  }
];
