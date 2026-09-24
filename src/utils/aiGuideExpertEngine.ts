import { AiGuideIntent, AiGuideAction, StructuredIncidentGuidance, AiGuideResponse } from '../types/aiGuide';
import { PageType } from '../types';

export function extractUrlFromText(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/i;
  const match = text.match(urlRegex);
  if (!match) return null;
  let url = match[0].trim().replace(/[.,;!?()]+$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

export function classifyIntent(text: string): AiGuideIntent {
  const lower = text.toLowerCase();

  // Financial & UPI Fraud
  if (
    lower.includes('upi') ||
    lower.includes('money lost') ||
    lower.includes('lost money') ||
    lower.includes('bank account') ||
    lower.includes('unauthorized debit') ||
    lower.includes('debited') ||
    lower.includes('credit card fraud') ||
    lower.includes('atm card') ||
    lower.includes('refund scam') ||
    lower.includes('qr code') ||
    lower.includes('phonepe') ||
    lower.includes('gpay') ||
    lower.includes('google pay') ||
    lower.includes('paytm') ||
    lower.includes('fraudulent transaction')
  ) {
    return 'FINANCIAL_FRAUD';
  }

  // Account Compromise
  if (
    lower.includes('instagram') ||
    lower.includes('account hacked') ||
    lower.includes('hacked') ||
    lower.includes('compromised account') ||
    lower.includes('locked out') ||
    lower.includes('someone logged in') ||
    lower.includes('facebook hacked') ||
    lower.includes('whatsapp hacked') ||
    lower.includes('email hacked') ||
    lower.includes('gmail hacked')
  ) {
    return 'ACCOUNT_COMPROMISE';
  }

  // OTP Sharing
  if (
    lower.includes('otp') ||
    lower.includes('shared otp') ||
    lower.includes('gave otp') ||
    lower.includes('one time password') ||
    lower.includes('verification code')
  ) {
    return 'ACCOUNT_COMPROMISE';
  }

  // Suspicious URL / Link
  if (
    lower.includes('suspicious link') ||
    lower.includes('clicked a link') ||
    lower.includes('check this link') ||
    lower.includes('is this url') ||
    lower.includes('fake website') ||
    lower.includes('real website') ||
    lower.includes('check website') ||
    extractUrlFromText(text) !== null
  ) {
    return 'SUSPICIOUS_URL';
  }

  // Phishing / Smishing
  if (
    lower.includes('phishing') ||
    lower.includes('smishing') ||
    lower.includes('fake message') ||
    lower.includes('suspicious message') ||
    lower.includes('suspicious email') ||
    lower.includes('electricity bill') ||
    lower.includes('pan card update') ||
    lower.includes('kyc update') ||
    lower.includes('account will be blocked') ||
    lower.includes('sim blocked')
  ) {
    return 'PHISHING';
  }

  // Cyberstalking / Online Harassment / Threatening
  if (
    lower.includes('threatening') ||
    lower.includes('blackmail') ||
    lower.includes('harass') ||
    lower.includes('stalk') ||
    lower.includes('sextortion') ||
    lower.includes('extortion') ||
    lower.includes('leaking photos') ||
    lower.includes('morphed photo')
  ) {
    return 'CYBERSTALKING';
  }

  // Identity Theft / Aadhaar / PAN
  if (
    lower.includes('aadhaar') ||
    lower.includes('pan card') ||
    lower.includes('identity theft') ||
    lower.includes('impersonating me') ||
    lower.includes('fake profile') ||
    lower.includes('asking for my aadhaar')
  ) {
    return 'IDENTITY_THEFT';
  }

  // Malware / Virus / Infected Phone
  if (
    lower.includes('malware') ||
    lower.includes('virus') ||
    lower.includes('infected') ||
    lower.includes('apk') ||
    lower.includes('installed an app') ||
    lower.includes('anydesk') ||
    lower.includes('teamviewer') ||
    lower.includes('rustdesk') ||
    lower.includes('remote app')
  ) {
    return 'MALWARE';
  }

  // Ransomware
  if (lower.includes('ransomware') || lower.includes('encrypted files') || lower.includes('demanding ransom')) {
    return 'RANSOMWARE';
  }

  // Passwords / MFA
  if (lower.includes('password') || lower.includes('passphrase')) {
    return 'PASSWORD_SECURITY';
  }
  if (lower.includes('mfa') || lower.includes('2fa') || lower.includes('two factor') || lower.includes('authenticator')) {
    return 'MFA';
  }

  // Privacy & Device Security
  if (lower.includes('privacy') || lower.includes('data protection') || lower.includes('tracking')) {
    return 'PRIVACY';
  }
  if (lower.includes('protect my parents') || lower.includes('improve security') || lower.includes('best practices') || lower.includes('checklist')) {
    return 'PREVENTION';
  }

  // General Learning
  if (
    lower.includes('teach me') ||
    lower.includes('what is') ||
    lower.includes('how does') ||
    lower.includes('learn') ||
    lower.includes('explain') ||
    lower.includes('quiz')
  ) {
    return 'LEARNING';
  }

  // Reporting assistance
  if (lower.includes('report') || lower.includes('police') || lower.includes('1930') || lower.includes('cyber crime cell')) {
    return 'REPORTING';
  }

  return 'GENERAL_CYBERSECURITY';
}

export function generateExpertGuidance(
  message: string,
  contextPage?: PageType
): AiGuideResponse {
  const intent = classifyIntent(message);
  const detectedUrl = extractUrlFromText(message);
  const lower = message.toLowerCase();

  // 1. FINANCIAL / UPI FRAUD
  if (intent === 'FINANCIAL_FRAUD' || lower.includes('lost money') || lower.includes('upi')) {
    const structured: StructuredIncidentGuidance = {
      whatHappened: 'A financial transfer or debit occurred where funds were moved or compromised via UPI, payment apps, or net banking.',
      immediateActions: [
        'Call the National Cyber Crime Helpline at 1930 immediately. The first 1 to 2 hours ("Golden Hours") are critical for interbank liens to freeze disputed funds before withdrawal.',
        'Contact your issuing bank fraud hotline (printed on back of card or inside official app) to hotlist cards, freeze internet banking, and register an unauthorized debit dispute.',
        'Change your UPI PIN and Net Banking password immediately from a known secure device.',
        'File an official formal complaint on the National Cyber Crime Reporting Portal (https://cybercrime.gov.in/) under Financial Fraud.'
      ],
      whatToAvoid: [
        'DO NOT send another payment or "processing charge" to recover lost funds (secondary fee scams are common).',
        'DO NOT search for bank customer care numbers on Google Search or Maps reviews; scammers place fake numbers there.',
        'DO NOT install remote screen-sharing applications (e.g. AnyDesk, RustDesk, QuickSupport).',
        'DO NOT delete SMS receipts, WhatsApp chats, or transaction reference messages.'
      ],
      evidenceToPreserve: [
        '12-digit UTR (Unique Transaction Reference) number or UPI Transaction ID from bank debit SMS.',
        'Exact timestamp of unauthorized debits and beneficiary UPI ID / Virtual Payment Address (VPA).',
        'PDF Bank statement with highlighted fraudulent transaction lines.',
        'Screenshots of chat conversations, fake QR codes, or payment links.'
      ],
      officialReporting: [
        {
          name: 'National Cyber Crime Reporting Helpline (India)',
          helpline: '1930',
          notes: 'Toll-free 24/7 helpline operated by I4C, Ministry of Home Affairs. Provides instant interbank coordination.',
          isOfficialGov: true
        },
        {
          name: 'National Cyber Crime Reporting Portal',
          url: 'https://cybercrime.gov.in/',
          notes: 'File under "Report Financial Fraud" to get an official statutory complaint acknowledgement number.',
          isOfficialGov: true
        },
        {
          name: 'Your Bank 24/7 Emergency Fraud Desk',
          notes: 'Call the official number on the back of your card to initiate zero-liability dispute proceedings.'
        }
      ],
      learningRecommendation: 'Review the "UPI & Payment Fraud" prevention guide to recognize reverse collect requests and deceptive QR codes.',
      urgencyLevel: 'critical'
    };

    const actions: AiGuideAction[] = [
      {
        id: 'dial-1930',
        type: 'dial_helpline',
        label: 'Emergency: Call 1930 Helpline',
        badge: 'Priority Response',
        payload: { helplineNumber: '1930', helplineLabel: 'National Cyber Crime Helpline' },
        requiresConfirmation: true,
        confirmationTitle: 'Call National Cyber Crime Helpline 1930',
        confirmationMessage: 'You are about to dial 1930, the official emergency citizen helpline for financial cyber fraud in India. Have your 12-digit UTR and bank details ready.'
      },
      {
        id: 'prepare-report-financial',
        type: 'navigate_report',
        label: 'Prepare Incident Report in CyberSafe',
        description: 'Organize your transaction UTR, timeline, and evidence summary ready for police submission',
        payload: { incidentId: 'financial-fraud' }
      },
      {
        id: 'find-cyber-cell',
        type: 'navigate_nearby',
        label: 'Find Nearby Cyber Crime Cell / Police Station',
        payload: { searchQuery: 'cyber' }
      },
      {
        id: 'learn-upi-safety',
        type: 'navigate_learn',
        label: 'Learn: How UPI Frauds Work',
        payload: { searchQuery: 'UPI' }
      }
    ];

    return {
      intent: 'FINANCIAL_FRAUD',
      reply: `Take these immediate steps now to protect your funds and alert the banking network.\n\n### ⚡ What To Do Right Now\n1. **Call 1930 immediately**: The first 1 to 2 hours are known as the **"Golden Hours"**. The 1930 helpline can initiate an immediate interbank lien to freeze funds in the recipient account before the scammer withdraws them.\n2. **Contact your bank's emergency fraud desk**: Block net banking, hotlist cards, and file a formal zero-liability dispute.\n3. **Change your UPI PIN**: Reset PINs from your bank app, not by following links from callers.\n\n### 🛑 What NOT To Do\n- **Never pay "recovery fees"**: No legitimate agency or ethical hacker asks for money to recover stolen funds.\n- **Do not install remote apps**: Decline any request to install AnyDesk, TeamViewer, or RustDesk.\n- **Do not delete evidence**: Keep all SMS, chat logs, and call records.\n\nUse the action buttons below to draft your incident evidence checklist or locate verified cyber cells.`,
      structuredGuidance: structured,
      suggestedActions: actions,
      engineUsed: 'cybersafe-expert-fallback'
    };
  }

  // 2. SUSPICIOUS URL / LINK
  if (intent === 'SUSPICIOUS_URL' || detectedUrl !== null) {
    const urlToCheck = detectedUrl || 'https://example.com';
    const structured: StructuredIncidentGuidance = {
      whatHappened: 'A link or website address was encountered that may lead to credential harvesting, malware, or brand spoofing.',
      immediateActions: [
        'Do not click or open the link again. If opened, close the browser tab immediately.',
        'If you entered credentials or payment details, change passwords immediately from a separate trusted device.',
        'Analyze the link using CyberSafe Detect to inspect domain age, punycode spoofing, and structure without connecting to the server.',
        'Report deceptive URLs to official telecom spam / scam registries (Chakshu / CERT-In).'
      ],
      whatToAvoid: [
        'DO NOT log in or submit any two-factor OTPs on the suspicious page.',
        'DO NOT download any file or application prompted by the webpage.',
        'DO NOT forward the link to friends, family, or social media groups.'
      ],
      evidenceToPreserve: [
        'Complete web address (URL) from the address bar or text message.',
        'Screenshot of the webpage showing domain bar and interface.',
        'The original message or email containing the link with sender information.'
      ],
      officialReporting: [
        {
          name: 'Chakshu Portal (DoT Sanchar Saathi)',
          url: 'https://sancharsaathi.gov.in/sfc/',
          notes: 'Official platform to report suspected fraud communications received via SMS or WhatsApp.',
          isOfficialGov: true
        },
        {
          name: 'CERT-In Incident Reporting',
          url: 'https://www.cert-in.org.in/',
          notes: 'National nodal agency for responding to computer security incidents.',
          isOfficialGov: true
        }
      ],
      learningRecommendation: 'Explore the "Deceptive Links & Homograph Attacks" guide in the Learn section.',
      urgencyLevel: 'moderate'
    };

    const actions: AiGuideAction[] = [
      {
        id: 'inspect-url-detect',
        type: 'navigate_detect',
        label: detectedUrl ? `Analyze "${detectedUrl.length > 25 ? detectedUrl.slice(0, 25) + '...' : detectedUrl}" in Detect` : 'Analyze URL in CyberSafe Detect',
        description: 'Heuristic structural scan, zero-SSRF spoofing inspection, and threat reputation verification',
        payload: { url: detectedUrl || '' }
      },
      {
        id: 'prepare-phishing-report',
        type: 'navigate_report',
        label: 'Prepare Phishing Incident Report',
        payload: { incidentId: 'phishing-smishing', url: detectedUrl || '' }
      },
      {
        id: 'learn-phishing-anatomy',
        type: 'navigate_learn',
        label: 'Learn: Anatomy of a Malicious URL',
        payload: { searchQuery: 'phishing' }
      },
      {
        id: 'quiz-phishing',
        type: 'navigate_quiz',
        label: 'Test Knowledge: Phishing Recognition Quiz',
        payload: { category: 'Phishing' }
      }
    ];

    return {
      intent: 'SUSPICIOUS_URL',
      reply: `Here is how to safely handle and evaluate this link without putting your device or credentials at risk.\n\n### ⚡ Immediate Action\n1. **Stop interacting**: Close the webpage immediately. Do not click links inside it or submit any forms.\n2. **Inspect safely**: Use CyberSafe Detect below to analyze the URL's domain structure, hidden redirections, and reputation—our engine inspects it safely without visiting the target server.\n3. **If credentials were typed**: Immediately go to the real service website from a known clean device and change your account password.\n\n### 🛑 What NOT To Do\n- Never enter OTPs or passwords on unverified web pages.\n- Do not approve browser download prompts.\n- Do not test the link on multiple family devices.\n\nClick **"Analyze URL in Detect"** below to inspect this address.`,
      structuredGuidance: structured,
      suggestedActions: actions,
      engineUsed: 'cybersafe-expert-fallback'
    };
  }

  // 3. ACCOUNT COMPROMISE / HACKED / OTP
  if (intent === 'ACCOUNT_COMPROMISE' || lower.includes('hacked') || lower.includes('otp')) {
    const isOtp = lower.includes('otp');
    const structured: StructuredIncidentGuidance = {
      whatHappened: isOtp 
        ? 'A One-Time Password was provided to an external party, enabling unauthorized account access or transaction authorization.'
        : 'An online account (such as Instagram, Google, Facebook, or WhatsApp) was breached, modified, or hijacked by an unauthorized actor.',
      immediateActions: [
        'Go to the platform official recovery page immediately (e.g. accounts.google.com/signin/recovery or instagram.com/hacked) using a recognized device.',
        'Access security settings and select "Sign out of all other devices / active sessions".',
        'Change password to a strong, unique passphrase (at least 14 characters).',
        'Enable Multi-Factor Authentication (MFA) using an Authenticator app (Google Authenticator / Aegis) rather than SMS.',
        'Alert close friends and family that your account was compromised and to disregard any requests for money or emergency favors.'
      ],
      whatToAvoid: [
        'DO NOT pay "account recovery hackers" on Instagram, Telegram, or Twitter claiming they can unlock your profile.',
        'DO NOT share verification codes sent to your phone with anyone claiming to be "support".',
        'DO NOT panic and delete your account or original registration email.'
      ],
      evidenceToPreserve: [
        'Security alert emails received from the platform (e.g. "New login from unverified device").',
        'Screenshots of unauthorized profile modifications, direct messages, or changed recovery details.',
        'Timestamps when access was lost.'
      ],
      officialReporting: [
        {
          name: 'Platform Official Account Recovery',
          notes: 'Always use the in-app or platform-verified domain (e.g. instagram.com/hacked, support.google.com).'
        },
        {
          name: 'National Cyber Crime Reporting Portal',
          url: 'https://cybercrime.gov.in/',
          notes: 'File under "Cyber Violence & Account Compromise" if impersonation or extortion is underway.',
          isOfficialGov: true
        }
      ],
      learningRecommendation: 'Review the "Account Perimeter Recovery" and "MFA Deployment" guides.',
      urgencyLevel: 'high'
    };

    const actions: AiGuideAction[] = [
      {
        id: 'prepare-report-account',
        type: 'navigate_report',
        label: 'Prepare Account Compromise Report',
        payload: { incidentId: 'account-takeover' }
      },
      {
        id: 'prevent-mfa-guide',
        type: 'navigate_prevent',
        label: 'View MFA & Account Security Checklist',
        payload: { areaId: 'mfa' }
      },
      {
        id: 'learn-account-recovery',
        type: 'navigate_learn',
        label: 'Learn: Account Perimeter Hardening',
        payload: { searchQuery: 'account recovery' }
      },
      {
        id: 'quiz-account-sec',
        type: 'navigate_quiz',
        label: 'Practice: Account Security Quiz',
        payload: { category: 'Account Security' }
      }
    ];

    return {
      intent: 'ACCOUNT_COMPROMISE',
      reply: `Take these critical containment steps right now to reclaim and secure your account.\n\n### ⚡ What To Do Now\n1. **Use official recovery mechanisms**: Use the platform's trusted recovery URL (e.g., \`instagram.com/hacked\` or \`accounts.google.com/signin/recovery\`) from your regular device.\n2. **Terminate active sessions**: Go into security settings and choose **"Log out of all devices"**.\n3. **Switch on Authenticator MFA**: Replace SMS OTP with an authenticator app.\n4. **Warn your contacts**: Perpetrators often message contacts asking for emergency UPI transfers.\n\n### 🛑 What NOT To Do\n- **Never pay "recovery services"**: Online claims from people saying "DM @hacker_support to get your profile back" are secondary scams.\n- **Do not share future codes**: Real support staff will never request dynamic codes.\n\nReview the action options below to prepare documentation or follow our prevention checklist.`,
      structuredGuidance: structured,
      suggestedActions: actions,
      engineUsed: 'cybersafe-expert-fallback'
    };
  }

  // 4. MALWARE / APK / REMOTE ACCESS APP
  if (intent === 'MALWARE' || lower.includes('apk') || lower.includes('infected') || lower.includes('anydesk')) {
    const structured: StructuredIncidentGuidance = {
      whatHappened: 'A suspicious application (such as an unknown APK or remote desktop utility) was downloaded or granted elevated permissions.',
      immediateActions: [
        'Disconnect device immediately from Wi-Fi and Cellular mobile data (enable Airplane Mode).',
        'Uninstall the suspicious application. For Android: Settings > Apps > see all apps, locate unfamiliar or blank-icon apps and tap Uninstall.',
        'Revoke Accessibility Services and Device Admin permissions for unfamiliar apps.',
        'If an app had screen-sharing access during bank operations, change banking passwords and UPI PINs from an uninfected secondary device.',
        'Run a full scan using Google Play Protect or a trusted mobile security suite.'
      ],
      whatToAvoid: [
        'DO NOT open banking or payment applications on the affected device until cleaned.',
        'DO NOT approve permission prompts requesting "Accessibility", "Notification Listening", or "Device Administrator".',
        'DO NOT install APK files sent via WhatsApp, Telegram, or SMS.'
      ],
      evidenceToPreserve: [
        'Name of the malicious APK or application and where it was downloaded from.',
        'SMS or chat message containing the download link or caller instruction.',
        'Screenshots of permissions granted.'
      ],
      officialReporting: [
        {
          name: 'National Cyber Crime Reporting Portal',
          url: 'https://cybercrime.gov.in/',
          notes: 'File under "Malware / Ransomware Attacks".',
          isOfficialGov: true
        }
      ],
      learningRecommendation: 'Review the "Mobile Security & Sideloading Risks" guide.',
      urgencyLevel: 'high'
    };

    const actions: AiGuideAction[] = [
      {
        id: 'report-malware',
        type: 'navigate_report',
        label: 'Prepare Malware Incident Report',
        payload: { incidentId: 'malware-ransomware' }
      },
      {
        id: 'prevent-device-sec',
        type: 'navigate_prevent',
        label: 'Device Security & App Hygiene Checklist',
        payload: { areaId: 'device-security' }
      },
      {
        id: 'learn-malware',
        type: 'navigate_learn',
        label: 'Learn: How Remote Access Trojans Work',
        payload: { searchQuery: 'malware' }
      }
    ];

    return {
      intent: 'MALWARE',
      reply: `Follow this containment procedure immediately to isolate the device and prevent unauthorized remote control.\n\n### ⚡ Containment Steps\n1. **Isolate immediately**: Turn on **Airplane Mode** and disconnect Wi-Fi to stop the application from communicating with attacker command servers.\n2. **Revoke permissions and uninstall**: Go to **Settings > Apps**, find the newly installed application (sometimes hidden with a generic or blank name), and uninstall it.\n3. **Check Device Admin & Accessibility**: Check **Settings > Accessibility** and ensure no unknown app has screen monitoring rights.\n4. **Reset banking credentials from a clean device**: If you opened banking apps while the remote software was active, update your passwords and PINs from a different phone or computer.\n\n### 🛑 What NOT To Do\n- Never open financial or sensitive apps while an unverified remote tool is installed.\n- Never install APK files shared by callers posing as utility or government agents.`,
      structuredGuidance: structured,
      suggestedActions: actions,
      engineUsed: 'cybersafe-expert-fallback'
    };
  }

  // 5. CYBERSTALKING / ONLINE HARASSMENT / BLACKMAIL
  if (intent === 'CYBERSTALKING' || lower.includes('threaten') || lower.includes('blackmail') || lower.includes('sextortion')) {
    const structured: StructuredIncidentGuidance = {
      whatHappened: 'A perpetrator is using psychological intimidation, harassment, morphed images, or blackmail to extract money or compliance.',
      immediateActions: [
        'Do not send any money. Paying blackmail does NOT stop the perpetrator—it guarantees further demands.',
        'Stop replying to the perpetrator. Do not engage in arguments or plead; freeze communication.',
        'Preserve all evidence: take full uncropped screenshots of chat messages, profiles, phone numbers, and payment addresses.',
        'Block the account on the platform, but do NOT delete the chat history.',
        'Call 1930 (for financial extortion) or Women Helpline 1090/112, and lodge a complaint on cybercrime.gov.in.'
      ],
      whatToAvoid: [
        'DO NOT pay any ransom or "settlement" fee.',
        'DO NOT delete chat logs or call records; police need unedited proof.',
        'DO NOT blame yourself; extortion is a premeditated cybercrime carried out by organized syndicates.'
      ],
      evidenceToPreserve: [
        'Full screenshots of all messages, threats, and demands with visible timestamps.',
        'Perpetrator username, profile URL, phone number, and UPI ID or account provided.',
        'Copies of any images or videos transmitted.'
      ],
      officialReporting: [
        {
          name: 'National Cyber Crime Reporting Portal (Special Women & Child Cell)',
          url: 'https://cybercrime.gov.in/',
          notes: 'Option to "Report Anonymously" or under "Crime Against Women & Children".',
          isOfficialGov: true
        },
        {
          name: 'Emergency Police Helpline',
          helpline: '112',
          notes: 'National unified emergency helpline for immediate physical safety concerns.',
          isOfficialGov: true
        }
      ],
      learningRecommendation: 'Review the "Social Media Safety & Harassment Prevention" guide.',
      urgencyLevel: 'critical'
    };

    const actions: AiGuideAction[] = [
      {
        id: 'report-harassment',
        type: 'navigate_report',
        label: 'Prepare Incident Report for Cyber Crime Portal',
        payload: { incidentId: 'cyberstalking-harassment' }
      },
      {
        id: 'find-police-station',
        type: 'navigate_nearby',
        label: 'Find Nearest Police Station / Cyber Cell',
        payload: { searchQuery: 'police' }
      },
      {
        id: 'learn-harassment-defense',
        type: 'navigate_learn',
        label: 'Learn: Digital Boundary & Harassment Defense',
        payload: { searchQuery: 'harassment' }
      }
    ];

    return {
      intent: 'CYBERSTALKING',
      reply: `Stay calm. This is an organized criminal pressure tactic designed to create panic. Here is what you should do:\n\n### ⚡ What To Do Right Now\n1. **Do not pay**: Paying blackmail never solves the problem; it signals to criminals that demands will work, prompting higher demands.\n2. **Discontinue communication**: Stop answering calls or messages. Do not negotiate.\n3. **Preserve every shred of proof**: Take comprehensive screenshots showing phone numbers, handles, timestamps, and payment handles.\n4. **Report to authorities**: File an official report on **cybercrime.gov.in** (you can report confidentially under the Women & Children category) or dial **1930** if financial extortion is involved.\n\n### 🛑 What NOT To Do\n- Never send test payments or compromise agreements.\n- Do not delete chat history or call records.\n- Do not isolate yourself—talk to a trusted friend or family member.`,
      structuredGuidance: structured,
      suggestedActions: actions,
      engineUsed: 'cybersafe-expert-fallback'
    };
  }

  // 6. GENERAL LEARNING & AWARENESS
  if (intent === 'LEARNING' || lower.includes('teach me') || lower.includes('phishing')) {
    const isPhishing = lower.includes('phishing');
    const actions: AiGuideAction[] = [
      {
        id: 'learn-hub',
        type: 'navigate_learn',
        label: isPhishing ? 'Explore Phishing Deep Dive in Learn' : 'Browse CyberSafe Learning Platform',
        payload: { searchQuery: isPhishing ? 'phishing' : '' }
      },
      {
        id: 'take-quiz',
        type: 'navigate_quiz',
        label: isPhishing ? 'Take Phishing Recognition Quiz' : 'Take Interactive Cybersecurity Quiz',
        payload: { category: isPhishing ? 'Phishing' : 'General' }
      },
      {
        id: 'prevention-checklist',
        type: 'navigate_prevent',
        label: 'Open Interactive Security Checklist',
        payload: { areaId: 'passwords' }
      }
    ];

    return {
      intent: 'LEARNING',
      reply: isPhishing
        ? `Phishing is a deceptive social engineering technique where attackers impersonate trustworthy entities (like banks, delivery services, or tax authorities) to trick you into revealing sensitive information, clicking malicious links, or approving payments.\n\n### 🔍 Common Red Flags\n1. **Artificial Urgency**: "Account suspended in 2 hours", "Power cut at 8 PM", "KYC expires today".\n2. **Generic Greetings & Spoofed Senders**: Messages from arbitrary phone numbers claiming to be national banks.\n3. **Lookalike Domains**: Subtly altered spellings (e.g. \`sbi-secure-update.xyz\` instead of official domains).\n4. **Requests for Secrets**: Demands for OTPs, CVVs, or UPI PINs.\n\nUse the buttons below to explore our interactive educational guide or test your skills in the Quiz!`
        : `Welcome to CyberSafe learning! We provide interactive guides and practical methodologies aligned with international frameworks (NIST CSF, CIS Controls) tailored for everyday citizens.\n\nKey learning areas include:\n- **Phishing & Smishing Detection**\n- **Password & Passphrase Hygiene**\n- **Multi-Factor Authentication (MFA)**\n- **UPI & Payment Fraud Avoidance**\n- **Device Hygiene & Safe Sideloading**\n\nChoose an option below to begin exploring or test your cybersecurity readiness!`,
      suggestedActions: actions,
      engineUsed: 'cybersafe-expert-fallback'
    };
  }

  // 7. DEFAULT / PREVENTION GUIDANCE
  const actions: AiGuideAction[] = [
    {
      id: 'quick-prevent',
      type: 'navigate_prevent',
      label: 'Personalized Prevention Checklist',
      payload: { areaId: 'passwords' }
    },
    {
      id: 'quick-detect',
      type: 'navigate_detect',
      label: 'Inspect a Link in Detect',
      payload: {}
    },
    {
      id: 'quick-report',
      type: 'navigate_report',
      label: 'Incident Guidance & Report Preparation',
      payload: { incidentId: 'financial-fraud' }
    },
    {
      id: 'quick-learn',
      type: 'navigate_learn',
      label: 'Browse Safety Methodologies',
      payload: {}
    }
  ];

  return {
    intent: 'GENERAL_CYBERSECURITY',
    reply: `I am your **CyberSafe AI Guide**, designed to provide calm, structured guidance and help you navigate the platform's tools:\n\n- **Detect**: Safely inspect suspicious links and message snippets for spoofing and deceptive indicators.\n- **Report**: Organize incident evidence and connect with official reporting routes (including Helpline 1930 and cybercrime.gov.in).\n- **Nearby Help**: Locate verified local police stations and dedicated cyber cells.\n- **Learn & Prevent**: Deep dive into practical digital safety methodologies and personalized checklists.\n- **Quiz**: Test and reinforce your security instincts with realistic scenarios.\n\nHow can I assist you with your situation or learning today?`,
    suggestedActions: actions,
    engineUsed: 'cybersafe-expert-fallback'
  };
}
