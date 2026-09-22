import { QuizQuestion, QuizCategory, QuizCategoryMeta } from '../types';

export const QUIZ_CATEGORIES_METADATA: QuizCategoryMeta[] = [
  {
    id: 'Phishing',
    label: 'Phishing',
    description: 'Deceptive emails, spoofed sender domains, credential harvesting forms, and spear-phishing.',
    iconName: 'MailWarning',
    color: 'amber',
    recommendedLearnTopic: 'Phishing & Impersonation',
    recommendedPreventArea: 'safe-browsing',
  },
  {
    id: 'Password Security',
    label: 'Password Security',
    description: 'Passphrases, password managers, breach credential reuse, and entropy best practices.',
    iconName: 'KeyRound',
    color: 'blue',
    recommendedLearnTopic: 'Credential Stuffing & Leaks',
    recommendedPreventArea: 'passwords',
  },
  {
    id: 'Account Security',
    label: 'Account Security',
    description: 'Multi-factor authentication (MFA), session revocations, recovery protocols, and OAuth permissions.',
    iconName: 'ShieldCheck',
    color: 'emerald',
    recommendedLearnTopic: 'Account Takeover & Session Hijacking',
    recommendedPreventArea: 'mfa',
  },
  {
    id: 'Online Scams',
    label: 'Online Scams',
    description: 'Fake job offers, advance-fee lottery traps, deceptive e-commerce, and courier delivery fee tricks.',
    iconName: 'AlertTriangle',
    color: 'rose',
    recommendedLearnTopic: 'Pretexting & Fake Jobs',
    recommendedPreventArea: 'scam-prevention',
  },
  {
    id: 'Social Engineering',
    label: 'Social Engineering',
    description: 'Pretexting, urgent authority intimidation, executive impersonation, and emotional manipulation.',
    iconName: 'Users',
    color: 'purple',
    recommendedLearnTopic: 'Social Engineering & Pretexting',
    recommendedPreventArea: 'scam-prevention',
  },
  {
    id: 'Financial Fraud',
    label: 'Financial Fraud',
    description: 'UPI QR code traps, unauthorized debits, investment syndicates, and card skimming.',
    iconName: 'CreditCard',
    color: 'red',
    recommendedLearnTopic: 'UPI & Banking Frauds',
    recommendedPreventArea: 'financial-safety',
  },
  {
    id: 'Privacy',
    label: 'Privacy',
    description: 'Data tracking, insecure public Wi-Fi, digital footprint reduction, and excessive app permissions.',
    iconName: 'EyeOff',
    color: 'indigo',
    recommendedLearnTopic: 'Data Surveillance & Tracking',
    recommendedPreventArea: 'privacy',
  },
  {
    id: 'Social Media Safety',
    label: 'Social Media Safety',
    description: 'Cloned profiles, viral info-harvesting quizzes, oversharing locations, and deceptive DM links.',
    iconName: 'Share2',
    color: 'cyan',
    recommendedLearnTopic: 'Social Profile Clones',
    recommendedPreventArea: 'social-media',
  },
  {
    id: 'Mobile Security',
    label: 'Mobile Security',
    description: 'Malicious sideloaded APKs, rogue accessibility permissions, screen sharing, and juice jacking.',
    iconName: 'Smartphone',
    color: 'teal',
    recommendedLearnTopic: 'Malicious Mobile Apps',
    recommendedPreventArea: 'device-security',
  },
  {
    id: 'Safe Browsing',
    label: 'Safe Browsing',
    description: 'Homograph lookalike domains, deceptive download buttons, rogue extensions, and fake alerts.',
    iconName: 'Globe',
    color: 'sky',
    recommendedLearnTopic: 'Deceptive Websites & Malvertising',
    recommendedPreventArea: 'safe-browsing',
  },
  {
    id: 'Malware Awareness',
    label: 'Malware Awareness',
    description: 'Ransomware lures, weaponized document attachments, cracked installers, and spyware containment.',
    iconName: 'Bug',
    color: 'orange',
    recommendedLearnTopic: 'Ransomware & Trojans',
    recommendedPreventArea: 'software-updates',
  },
  {
    id: 'Identity Theft',
    label: 'Identity Theft',
    description: 'Unmasked government ID sharing, synthetic identity abuse, credential breaches, and KYC imposter scams.',
    iconName: 'UserX',
    color: 'slate',
    recommendedLearnTopic: 'Identity Theft & KYC Scams',
    recommendedPreventArea: 'pii-protection',
  },
];

export const MASTER_QUIZ_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // 1. PHISHING
  // =========================================================================
  {
    id: 1,
    title: 'Deceptive Account Suspension Notice',
    category: 'Phishing',
    topic: 'Phishing',
    difficulty: 'beginner',
    scenario: 'You receive an urgent email: "URGENT: Your Cloud Account will be deactivated in 24 hours due to storage policy violations." It displays official logos and a button reading "Verify Account Credentials Now". The sender address is support@cloud-security-portal.xyz.',
    question: 'What is the most secure action to take upon receiving this email?',
    options: [
      {
        id: 'a',
        text: 'Click the button quickly and log in to check which file violated storage rules.',
        isCorrect: false,
        explanation: 'Clicking directs you to a credential harvesting clone site designed to record your username and password.'
      },
      {
        id: 'b',
        text: 'Do not click the button. Check the sender domain, open your browser independently, and navigate directly to the known official provider portal.',
        isCorrect: true,
        explanation: 'Legitimate service providers do not send policy warnings from disposable domain extensions (.xyz). Always authenticate via known bookmarked URLs.'
      },
      {
        id: 'c',
        text: 'Reply to the email with your username asking for clarification.',
        isCorrect: false,
        explanation: 'Replying validates your email address as active and monitored, increasing future spear-phishing attacks.'
      },
      {
        id: 'd',
        text: 'Forward the email to friends to warn them about cloud storage rules.',
        isCorrect: false,
        explanation: 'Forwarding unvetted scam emails risks having other contacts accidentally click the fraudulent link.'
      }
    ],
    correctAnswer: 'b',
    explanation: 'Legitimate service providers never send credential verification warnings from disposable top-level domains. Always navigate directly through bookmarked URLs.',
    warningSigns: [
      'Artificial deadline (24 hours) designed to provoke emotional panic',
      'Generic greeting instead of your verified account name',
      'Mismatch between brand name and sender domain (@cloud-security-portal.xyz)'
    ],
    educationalTakeaway: 'Never click authentication buttons in unsolicited emails. Navigate to services independently through official bookmarks.',
    takeaway: 'Never click authentication buttons in unsolicited emails. Navigate to services independently through official bookmarks.',
    status: 'published',
  },
  {
    id: 2,
    title: 'Spear-Phishing Shared Invoice Notification',
    category: 'Phishing',
    topic: 'Phishing',
    difficulty: 'intermediate',
    scenario: 'You receive an email appearing to come from your company accounting software or vendor: "Payment Receipt #8491 attached. Review payment confirmation in Google Docs." The sender is notification@quickbooks-invoicing-service.com, which redirects to a simulated Google Docs login prompt.',
    question: 'How can you spot that this shared document notification is a credential harvest attempt?',
    options: [
      {
        id: 'a',
        text: 'The email does not have a high priority exclamation mark flag.',
        isCorrect: false,
        explanation: 'Scammers frequently toggle or omit email priority flags; this is not a reliable indicator.'
      },
      {
        id: 'b',
        text: 'The document link redirects to an external third-party domain prompting for login credentials rather than opening directly inside your authenticated Google Drive.',
        isCorrect: true,
        explanation: 'If you are already logged in to Google, legitimate shared Docs open directly. Prompting for credentials on an unfamiliar domain indicates a harvester.'
      },
      {
        id: 'c',
        text: 'Google Docs never allows invoices to be stored or shared.',
        isCorrect: false,
        explanation: 'Google Docs is commonly used for legitimate business documents.'
      },
      {
        id: 'd',
        text: 'Invoices under #10000 are always test simulations.',
        isCorrect: false,
        explanation: 'Invoice numbers are arbitrary and provide no security information.'
      }
    ],
    correctAnswer: 'b',
    explanation: 'Credential harvesters host fake login modals on intermediary landing pages. If you are already authenticated to a platform, an unexpected login screen is a major red flag.',
    warningSigns: [
      'Unsolicited payment notification for an invoice you never authorized',
      'Re-prompting for corporate credentials when you already have an active session',
      'URL in the browser address bar differs from the real cloud service'
    ],
    educationalTakeaway: 'Examine the full address bar before typing passwords. Re-authenticating unexpectedly on non-company domains is a signature phishing tactic.',
    takeaway: 'Examine the full address bar before typing passwords. Re-authenticating unexpectedly on non-company domains is a signature phishing tactic.',
    status: 'published',
  },
  {
    id: 3,
    title: 'Smishing Alert: Toll & Highway Fine',
    category: 'Phishing',
    topic: 'Phishing',
    difficulty: 'advanced',
    scenario: 'You receive an SMS from an unfamiliar 10-digit number: "National Highways: Unpaid electronic toll of ₹140 on vehicle recorded today. Avoid ₹1,500 court penalty by clearing fine before midnight at https://fastag-clearing-portal.top/pay". You did not drive on any tollway today.',
    question: 'What makes this smishing attack particularly deceptive, and how should it be handled?',
    options: [
      {
        id: 'a',
        text: 'It asks for a small amount (₹140) to minimize suspicion, while the portal actually attempts to clone your net banking or card credentials. Delete and report the SMS without clicking.',
        isCorrect: true,
        explanation: 'Micro-amount fine pretexts exploit complacency because victims think "it is only ₹140 so I might as well pay to be safe". In reality, the portal steals payment credentials and OTPs.'
      },
      {
        id: 'b',
        text: 'Pay ₹140 using UPI because UPI transactions are always insured against government fines.',
        isCorrect: false,
        explanation: 'UPI payments to scam gateways result in financial loss and credential leakage, and are not automatically insured.'
      },
      {
        id: 'c',
        text: 'Call the 10-digit number back to explain that you did not drive on the tollway.',
        isCorrect: false,
        explanation: 'Scammers operate the number and will use social engineering to collect vehicle registration and OTPs.'
      },
      {
        id: 'd',
        text: 'Click the link but intentionally enter a fake vehicle number to test if the database is genuine.',
        isCorrect: false,
        explanation: 'Visiting the site exposes your device to fingerprinting and potential drive-by exploit scripts.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Low-cost fines (micro-phishing) bypass psychological defense mechanisms. Always check vehicle toll balances inside official FASTag bank apps.',
    warningSigns: [
      'Sent from an ordinary mobile number instead of an authorized government SMS header',
      'Disposable top-level domain (.top) rather than an official .gov.in domain',
      'Midnight deadline creating artificial urgency for a trivial charge'
    ],
    educationalTakeaway: 'Cybercriminals weaponize tiny penalties to lower your guard. Always check official transport or toll accounts independently.',
    takeaway: 'Cybercriminals weaponize tiny penalties to lower your guard. Always check official transport or toll accounts independently.',
    status: 'published',
  },

  // =========================================================================
  // 2. PASSWORD SECURITY
  // =========================================================================
  {
    id: 4,
    title: 'Password Reuse Across Breached Services',
    category: 'Password Security',
    topic: 'Password Security',
    difficulty: 'beginner',
    scenario: 'You use the password "P@ssw0rd2023!" for your online gaming account, personal email, and banking portal. A gaming forum notifies you that its database was breached.',
    question: 'Why does this breach pose an immediate danger to your other accounts?',
    options: [
      {
        id: 'a',
        text: 'Attackers use automated "credential stuffing" scripts to test the leaked email and password against banking, shopping, and email sites.',
        isCorrect: true,
        explanation: 'When a password leaks from one minor site, attackers immediately execute automated credential stuffing across thousands of major services.'
      },
      {
        id: 'b',
        text: 'Only the gaming forum is at risk because passwords have unique encryption bound to each server.',
        isCorrect: false,
        explanation: 'Passwords decrypted or hashed poorly by the forum can be reused anywhere you set the same text.'
      },
      {
        id: 'c',
        text: 'Banks automatically detect gaming forum breaches and change your PIN for you.',
        isCorrect: false,
        explanation: 'Banks have no direct awareness of external third-party website breaches.'
      },
      {
        id: 'd',
        text: 'The password contains special characters, so it cannot be decrypted by attackers.',
        isCorrect: false,
        explanation: 'Leaked plaintext or unsalted hashes expose the exact password regardless of character complexity.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Credential stuffing is an automated cyberattack where credentials stolen from one breach are tested against thousands of unrelated online platforms.',
    warningSigns: [
      'Using identical or slightly modified passwords across different services',
      'Relying on predictability (e.g. CurrentYear + symbol)',
      'Assuming minor forum breaches cannot affect primary financial accounts'
    ],
    educationalTakeaway: 'Never reuse passwords. Use a dedicated password manager to generate unique, random credentials for every service.',
    takeaway: 'Never reuse passwords. Use a dedicated password manager to generate unique, random credentials for every service.',
    status: 'published',
  },
  {
    id: 5,
    title: 'Password Strength: Length vs Character Replacement',
    category: 'Password Security',
    topic: 'Password Security',
    difficulty: 'intermediate',
    scenario: 'A user creates the password "P@ssw0rd!" (9 characters with leetspeak substitutions) and compares it with "sunset-coffee-cobalt-falcon" (27 characters, four random words).',
    question: 'According to modern security standards (e.g., NIST SP 800-63B), which password is substantially more resilient against brute-force attacks and why?',
    options: [
      {
        id: 'a',
        text: '"P@ssw0rd!" because special characters and leetspeak make passwords impossible for cracking software to guess.',
        isCorrect: false,
        explanation: 'Modern password cracking dictionaries (like Hashcat) explicitly pre-program leetspeak permutations (@ for a, 0 for o).'
      },
      {
        id: 'b',
        text: '"sunset-coffee-cobalt-falcon" because password length (entropy) exponentially increases the mathematical combinations required to brute-force.',
        isCorrect: true,
        explanation: 'Length is the single most dominant factor in password resistance. A 4-word passphrase provides huge combinatorial entropy and is easy to memorize.'
      },
      {
        id: 'c',
        text: 'Both have identical security because brute-force tools only check up to 8 characters.',
        isCorrect: false,
        explanation: 'Brute-force software tests trillions of keys per second across arbitrary lengths.'
      },
      {
        id: 'd',
        text: 'Neither is secure without adding your birth year at the end.',
        isCorrect: false,
        explanation: 'Adding predictable birth years actually lowers relative password entropy.'
      }
    ],
    correctAnswer: 'b',
    explanation: 'Modern NIST standards recommend memorable multi-word passphrases of 16+ characters over short strings with complex character replacements.',
    warningSigns: [
      'Believing simple letter substitutions like @ or 1 make short passwords secure',
      'Creating passwords shorter than 12 characters',
      'Forcing frequent 30-day password changes that lead users to increment numbers'
    ],
    educationalTakeaway: 'Length trumps complexity. A 20+ character multi-word passphrase is mathematically stronger and easier to remember than a complex 8-character string.',
    takeaway: 'Length trumps complexity. A 20+ character multi-word passphrase is mathematically stronger and easier to remember than a complex 8-character string.',
    status: 'published',
  },
  {
    id: 6,
    title: 'Master Password Storage for Password Managers',
    category: 'Password Security',
    topic: 'Password Security',
    difficulty: 'advanced',
    scenario: 'You decide to use an encrypted password manager to generate unique 20-character passwords for all your accounts. You now need to establish and protect your Master Password.',
    question: 'What is the most secure and recommended protocol for managing your Master Password?',
    options: [
      {
        id: 'a',
        text: 'Create a long, unique passphrase (5+ random words), store an offline physical emergency kit in a secure safe, and enable biometric unlock on personal devices.',
        isCorrect: true,
        explanation: 'Zero-knowledge password managers cannot reset your master password. A physical emergency recovery kit in a secure location prevents permanent lockouts while maintaining zero-knowledge encryption.'
      },
      {
        id: 'b',
        text: 'Email the Master Password to yourself so customer support can look it up if you forget.',
        isCorrect: false,
        explanation: 'Legitimate password managers operate on zero-knowledge encryption; their staff cannot decrypt your vault or recover your password.'
      },
      {
        id: 'c',
        text: 'Save the Master Password in an unencrypted Notes app on your smartphone.',
        isCorrect: false,
        explanation: 'Unencrypted notes are easily read by malicious apps or backups.'
      },
      {
        id: 'd',
        text: 'Use the same password you use for your primary email so you never lose access.',
        isCorrect: false,
        explanation: 'If your primary email password is compromised, attackers gain immediate access to your entire password vault.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Zero-knowledge vaults require a memorable, high-entropy master passphrase backed by an offline physical emergency sheet.',
    warningSigns: [
      'Saving master credentials in cloud notes or email drafts',
      'Reusing the master password on any other online service',
      'Failing to store an offline emergency recovery key'
    ],
    educationalTakeaway: 'Your password manager master passphrase is the key to your digital kingdom: make it 5+ words, never reuse it, and back it up offline.',
    takeaway: 'Your password manager master passphrase is the key to your digital kingdom: make it 5+ words, never reuse it, and back it up offline.',
    status: 'published',
  },

  // =========================================================================
  // 3. ACCOUNT SECURITY
  // =========================================================================
  {
    id: 7,
    title: 'MFA Methods: SMS vs Authenticator App',
    category: 'Account Security',
    topic: 'Account Security',
    difficulty: 'intermediate',
    scenario: 'When securing your primary email and cloud accounts, you are offered multiple Multi-Factor Authentication (MFA) choices: SMS Text Codes or an Authenticator App (TOTP).',
    question: 'Why is an Authenticator App or Hardware Security Key technically superior to SMS-based 2FA?',
    options: [
      {
        id: 'a',
        text: 'SMS messages can be intercepted via SIM swapping, telecom routing vulnerabilities (SS7), or mobile malware, whereas Authenticator apps generate codes locally on your device.',
        isCorrect: true,
        explanation: 'SIM swapping allows attackers to transfer your phone number to their SIM card and intercept SMS OTPs. TOTP authenticator apps and FIDO2 keys are immune to SIM swap attacks.'
      },
      {
        id: 'b',
        text: 'Authenticator apps do not require a smartphone.',
        isCorrect: false,
        explanation: 'Authenticator apps typically run on mobile devices or secure hardware.'
      },
      {
        id: 'c',
        text: 'SMS codes are only valid for 5 seconds.',
        isCorrect: false,
        explanation: 'SMS codes typically stay valid for 5 to 15 minutes, giving attackers an ample window.'
      },
      {
        id: 'd',
        text: 'Authenticator apps automatically notify the police if a hacker tries to log in.',
        isCorrect: false,
        explanation: 'Authenticator apps are mathematical code generators, not law enforcement alarms.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'SMS 2FA is vulnerable to SIM-swapping and telecom network interception. App-based TOTP (Google/Microsoft Authenticator) or hardware keys provide much stronger protection.',
    warningSigns: [
      'Relying solely on SMS codes for high-value banking and primary email accounts',
      'Ignoring phone carrier alerts about SIM card reissuance requests',
      'Not generating backup recovery codes when enabling MFA'
    ],
    educationalTakeaway: 'Upgrade to Authenticator Apps (TOTP) or Hardware Security Keys wherever available to neutralize SIM-swap and interception attacks.',
    takeaway: 'Upgrade to Authenticator Apps (TOTP) or Hardware Security Keys wherever available to neutralize SIM-swap and interception attacks.',
    status: 'published',
  },
  {
    id: 8,
    title: 'Third-Party App OAuth Permissions',
    category: 'Account Security',
    topic: 'Account Security',
    difficulty: 'advanced',
    scenario: 'You want to play an online web game. The popup asks you to "Sign in with Google" and requests permission to "Read, compose, send, and permanently delete all your email from Gmail" as well as "Manage your Google Drive files".',
    question: 'What is the correct evaluation of this OAuth request?',
    options: [
      {
        id: 'a',
        text: 'This is standard for all games because they need access to your profile to display leaderboards.',
        isCorrect: false,
        explanation: 'Leaderboards only require basic identity scopes (name, profile picture), not full email access.'
      },
      {
        id: 'b',
        text: 'Deny the authorization immediately. The requested permissions grant full control over your private inbox and files, which is disproportionate and dangerous for a web game.',
        isCorrect: true,
        explanation: 'Excessive OAuth scopes allow untrusted third-party apps to read sensitive emails, steal data, and maintain persistent access even if you change your password.'
      },
      {
        id: 'c',
        text: 'Accept it because "Sign in with Google" guarantees the third-party app has been tested and certified safe by security auditors.',
        isCorrect: false,
        explanation: 'OAuth protocols facilitate authentication but do not guarantee that third-party developers will handle your data responsibly.'
      },
      {
        id: 'd',
        text: 'Accept it, as changing your Google password 10 minutes later will automatically block the game from your emails.',
        isCorrect: false,
        explanation: 'OAuth authorization tokens remain valid independently of password changes until explicitly revoked in account security settings.'
      }
    ],
    correctAnswer: 'b',
    explanation: 'OAuth consent dialogs detail the exact permissions granted. Rogue or poorly secured apps can weaponize broad scopes to read emails and exfiltrate files.',
    warningSigns: [
      'Simple apps or games demanding full mailbox or file management scopes',
      'Clicking "Allow" without reading the granular permissions list',
      'Accumulating dozens of unreviewed third-party apps with persistent access to your Google/Apple/Microsoft account'
    ],
    educationalTakeaway: 'Scrutinize third-party OAuth scopes. Deny requests that demand access to your communications, files, or contacts when unnecessary.',
    takeaway: 'Scrutinize third-party OAuth scopes. Deny requests that demand access to your communications, files, or contacts when unnecessary.',
    status: 'published',
  },

  // =========================================================================
  // 4. ONLINE SCAMS
  // =========================================================================
  {
    id: 9,
    title: 'Telegram Part-Time "Video Rating" Job Scam',
    category: 'Online Scams',
    topic: 'Online Scams',
    difficulty: 'beginner',
    scenario: 'You receive a message on WhatsApp offering a remote job: "Earn ₹3,000 to ₹8,000 daily by simply liking YouTube videos and rating hotels on Google Maps. No experience required. Join our Telegram coordinator to start immediately."',
    question: 'How does this task-based job scam ultimately steal victims\' money?',
    options: [
      {
        id: 'a',
        text: 'After paying a small genuine ₹150 reward to build trust, they demand "prepaid tasks" where you must deposit increasing sums into crypto or fraudulent bank accounts to unlock your earnings.',
        isCorrect: true,
        explanation: 'This classic "task scam" pays a negligible initial sum to build trust, then coerces victims to deposit lakhs of rupees into fake investment tiers that can never be withdrawn.'
      },
      {
        id: 'b',
        text: 'YouTube will ban your smartphone permanently for liking videos without a creator license.',
        isCorrect: false,
        explanation: 'YouTube does not ban devices for likes; the danger is financial extortion by the scam ring.'
      },
      {
        id: 'c',
        text: 'The job is legitimate if the coordinator provides a GST registration certificate PDF in Telegram.',
        isCorrect: false,
        explanation: 'Scammers frequently download fake or stolen public corporate registration certificates to forge credibility.'
      },
      {
        id: 'd',
        text: 'The company pays you using overseas coupons that take 90 days to clear in your bank.',
        isCorrect: false,
        explanation: 'There are no genuine payments; the entire workflow is engineered around fake deposit demands.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Task scams use psychological reinforcement: small early payouts convince victims to transfer large sums for "VIP withdrawal tiers" that disappear.',
    warningSigns: [
      'Unsolicited job offer via messaging apps promising high daily payouts for trivial actions',
      'Migration to private Telegram channels or anonymous coordinators',
      'Demanding upfront deposits or processing fees to release earned wages'
    ],
    educationalTakeaway: 'Legitimate employers never ask you to pay money or deposit funds to perform work or unlock your earned salary.',
    takeaway: 'Legitimate employers never ask you to pay money or deposit funds to perform work or unlock your earned salary.',
    status: 'published',
  },
  {
    id: 10,
    title: 'Deceptive Online Marketplace Buyer Trap',
    category: 'Online Scams',
    topic: 'Online Scams',
    difficulty: 'intermediate',
    scenario: 'You post furniture for sale on OLX or Facebook Marketplace. A buyer contacts you within 5 minutes, says their spouse will pick it up tomorrow, and insists on paying an immediate deposit. They send a screenshot of a fake bank transfer slip and claim the bank requires you to pay a ₹2,000 "merchant activation fee" to receive the transfer.',
    question: 'What is the safest response to this situation?',
    options: [
      {
        id: 'a',
        text: 'Recognize this as a classic marketplace scam. Refuse any payment requests, block the buyer, and insist on cash or genuine verified bank credit upon physical inspection.',
        isCorrect: true,
        explanation: 'Sellers never pay fees to receive buyer payments. Fake deposit slips and claims of "merchant fees" or "business account activation" are 100% fraudulent.'
      },
      {
        id: 'b',
        text: 'Pay the ₹2,000 fee since it will be refunded once the full amount clears.',
        isCorrect: false,
        explanation: 'The ₹2,000 goes straight to the scammer and will never be refunded.'
      },
      {
        id: 'c',
        text: 'Ask the buyer to pay half of the activation fee to split the cost.',
        isCorrect: false,
        explanation: 'Negotiating with scammers still leaves you exposed to partial financial loss.'
      },
      {
        id: 'd',
        text: 'Send your debit card PIN to their bank so they can waive the fee directly.',
        isCorrect: false,
        explanation: 'Sharing debit card PINs gives the attacker direct access to empty your bank account.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Advance-fee marketplace scams trick sellers into paying nonexistent clearance charges. Legitimate buyers never require sellers to pay to receive funds.',
    warningSigns: [
      'Buyer rushing to pay full price without viewing or inspecting the item',
      'Claiming that bank systems or wallets require seller activation deposits',
      'Refusal to meet in person or conduct standard handover'
    ],
    educationalTakeaway: 'You never have to pay money to receive money as a seller. Never accept third-party fee claims on marketplace transactions.',
    takeaway: 'You never have to pay money to receive money as a seller. Never accept third-party fee claims on marketplace transactions.',
    status: 'published',
  },

  // =========================================================================
  // 5. SOCIAL ENGINEERING
  // =========================================================================
  {
    id: 11,
    title: 'Emergency Distress Call / AI Voice Clone Pretext',
    category: 'Social Engineering',
    topic: 'Social Engineering',
    difficulty: 'intermediate',
    scenario: 'You receive a frantic call from an unknown number. The caller sounds exactly like your nephew or close friend, crying in distress: "I was arrested in an accident and my phone broke. The police officer needs ₹50,000 immediately for emergency bail or I will be jailed. Please talk to Inspector Sharma right now!" Another voice takes the phone demanding immediate UPI transfer.',
    question: 'What protocol should you follow to verify this situation before taking any action?',
    options: [
      {
        id: 'a',
        text: 'Do not transfer any money. Hang up, immediately dial your nephew\'s known personal phone number or call their parents/family members directly to verify their physical location.',
        isCorrect: true,
        explanation: 'Pretexting syndicates exploit panic and increasingly use short audio samples from social media to clone voices. Disconnecting and verifying via known channels breaks the psychological trap.'
      },
      {
        id: 'b',
        text: 'Transfer half the money immediately to show good faith while you drive to the police station.',
        isCorrect: false,
        explanation: 'Any transferred money is instantly laundered through mule bank networks and lost.'
      },
      {
        id: 'c',
        text: 'Ask Inspector Sharma for their badge number and transfer the money if their badge number starts with a valid state code.',
        isCorrect: false,
        explanation: 'Scammers readily invent official-sounding badge numbers and fake police precinct names.'
      },
      {
        id: 'd',
        text: 'Ask the crying caller for their bank account number so you can transfer funds directly to their account.',
        isCorrect: false,
        explanation: 'Scammers will supply a mule bank account under their control.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'The "Grandparent / Relative in Distress" scam exploits overwhelming emotional terror to prevent rational verification. Always hang up and call the real family member.',
    warningSigns: [
      'Caller demands secrecy ("Do not tell my parents, they will be furious")',
      'Extreme manufactured crisis requiring instantaneous money transfer within minutes',
      'Refusal to allow you to call back on their verified mobile number'
    ],
    educationalTakeaway: 'When an unexpected caller claims a loved one is in legal or medical jeopardy, pause, hang up, and call them directly on their known phone number.',
    takeaway: 'When an unexpected caller claims a loved one is in legal or medical jeopardy, pause, hang up, and call them directly on their known phone number.',
    status: 'published',
  },
  {
    id: 12,
    title: 'Electricity Bill Disconnection Threat',
    category: 'Social Engineering',
    topic: 'Social Engineering',
    difficulty: 'beginner',
    scenario: 'You receive an urgent SMS: "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately contact Electricity Officer Mr. Verma at 98765-XXXXX."',
    question: 'Why is this message an obvious social engineering pretext?',
    options: [
      {
        id: 'a',
        text: 'Official power utility companies follow statutory notice periods via official utility bills and registered customer portals, never threatening instant cutoff via private mobile numbers.',
        isCorrect: true,
        explanation: 'Power disconnections require formal statutory notice cycles. Fraud rings blast thousands of these messages daily, telling callers to download remote access apps or pay via personal UPI handles.'
      },
      {
        id: 'b',
        text: 'Electricity can only be disconnected on Sunday mornings.',
        isCorrect: false,
        explanation: 'Disconnection schedules are governed by regulations, but the message itself is a known fraud scam.'
      },
      {
        id: 'c',
        text: 'Government officers always use landline numbers ending in 00.',
        isCorrect: false,
        explanation: 'Phone number endings are not a reliable security guarantee.'
      },
      {
        id: 'd',
        text: 'Power companies always send agents to your physical doorstep with a paper receipt before turning off meters.',
        isCorrect: false,
        explanation: 'Some utilities do have meter readers, but official payments are handled through authorized billing counters and portals.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Scammers use the threat of darkness or utility cutoff to induce panic. Genuine electricity boards never instruct customers to call private 10-digit mobile numbers.',
    warningSigns: [
      'Imminent disconnection deadline (tonight at 9:30 PM)',
      'Sent from an ordinary mobile number rather than state utility SMS headers (e.g. BESCOM, TATA, BSES)',
      'Directing you to contact an individual mobile number'
    ],
    educationalTakeaway: 'Verify utility payment statuses exclusively through your official consumer account portal or physical electricity bill.',
    takeaway: 'Verify utility payment statuses exclusively through your official consumer account portal or physical electricity bill.',
    status: 'published',
  },

  // =========================================================================
  // 6. FINANCIAL FRAUD
  // =========================================================================
  {
    id: 13,
    title: 'The Golden Rule of UPI PIN: Debit vs Credit',
    category: 'Financial Fraud',
    topic: 'Financial Fraud',
    difficulty: 'beginner',
    scenario: 'A buyer offers to transfer money to your bank account via UPI. They send a QR code or an authorization notification on your phone and say: "Please scan this QR code and enter your UPI PIN to approve the credit into your bank."',
    question: 'What is the absolute fundamental technical rule regarding UPI PINs in India?',
    options: [
      {
        id: 'a',
        text: 'You NEVER enter your UPI PIN to receive money. Entering your PIN or scanning a payment QR code ONLY authorizes money to leave (debit) your account.',
        isCorrect: true,
        explanation: 'A fundamental architectural truth of UPI: Receiving money requires zero action from the receiver. Your UPI PIN is strictly for authorizing debits from your bank account.'
      },
      {
        id: 'b',
        text: 'You must enter your PIN if the sender is transferring more than ₹5,000.',
        isCorrect: false,
        explanation: 'Transaction limits do not alter UPI mechanics; receiving never requires entering a PIN.'
      },
      {
        id: 'c',
        text: 'Entering your PIN to receive money is only safe if you do it within 60 seconds.',
        isCorrect: false,
        explanation: 'Entering your PIN at any time will instantly deduct money from your account.'
      },
      {
        id: 'd',
        text: 'You can enter a dummy PIN like 0000 to verify the incoming payment first.',
        isCorrect: false,
        explanation: 'Entering incorrect PINs will lock your banking app and provides no security verification.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'UPI PIN is an authorization secret for debits only. Incoming transfers credit directly into your linked bank account with no PIN required.',
    warningSigns: [
      'Anyone instructing you to "Enter UPI PIN to receive payment"',
      'Receiving a collect-request notification when you were expecting an incoming credit',
      'Sender claiming their bank requires receiver PIN verification'
    ],
    educationalTakeaway: 'Remember the golden rule of UPI: You only enter your PIN to SEND money, never to RECEIVE money.',
    takeaway: 'Remember the golden rule of UPI: You only enter your PIN to SEND money, never to RECEIVE money.',
    status: 'published',
  },
  {
    id: 14,
    title: 'WhatsApp High-Yield "Institutional" Stock Trading Group',
    category: 'Financial Fraud',
    topic: 'Financial Fraud',
    difficulty: 'intermediate',
    scenario: 'You are added to a WhatsApp group named "VIP Stock Market Alpha Insights". A self-proclaimed SEBI-registered guru shares screenshots of 300% weekly profits and invites you to download a custom APK trading app to participate in exclusive institutional IPO allotments.',
    question: 'What is the true nature of this trading group and app?',
    options: [
      {
        id: 'a',
        text: 'It is an illegal investment scam syndicate. The custom APK shows fabricated virtual profit graphs, and all money deposited into their mule accounts can never be withdrawn.',
        isCorrect: true,
        explanation: 'This "pig butchering" / fake IPO app scam lures victims with fabricated simulated balances. When victims attempt to withdraw profits, scammers demand high "taxes" and disappear.'
      },
      {
        id: 'b',
        text: 'It is a legitimate institutional syndicate as long as the group admins have profile pictures of business executives.',
        isCorrect: false,
        explanation: 'Scammers download photos of real executives from LinkedIn to construct fake profiles.'
      },
      {
        id: 'c',
        text: 'It is safe to invest a small amount because SEBI regulates all WhatsApp group trading tips.',
        isCorrect: false,
        explanation: 'SEBI does not regulate WhatsApp groups; SEBI explicitly issues repeated warnings against WhatsApp and Telegram trading syndicates.'
      },
      {
        id: 'd',
        text: 'You can safely trade if you only buy listed government PSU shares through the custom app.',
        isCorrect: false,
        explanation: 'The app is completely fake; no real shares are ever purchased on any stock exchange.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Fake trading apps simulate massive profits on screen to entice larger deposits. All funds transferred go directly into criminal syndicate bank accounts.',
    warningSigns: [
      'Added without consent to investment groups promising guaranteed 100%+ returns',
      'Requirement to install unverified APK files outside official app stores',
      'Depositing money into changing individual savings bank accounts rather than recognized clearing brokers'
    ],
    educationalTakeaway: 'Never invest through WhatsApp/Telegram groups or sideloaded trading apps. Only trade through SEBI-registered brokers listed on official exchange directories.',
    takeaway: 'Never invest through WhatsApp/Telegram groups or sideloaded trading apps. Only trade through SEBI-registered brokers listed on official exchange directories.',
    status: 'published',
  },

  // =========================================================================
  // 7. PRIVACY
  // =========================================================================
  {
    id: 15,
    title: 'Eavesdropping on Unsecured Airport & Cafe Wi-Fi',
    category: 'Privacy',
    topic: 'Privacy',
    difficulty: 'beginner',
    scenario: 'While waiting at an airport, you connect to an open, password-free Wi-Fi network named "Free_Airport_HighSpeed_Guest". You need to review bank statements and check work emails.',
    question: 'What is the safest practice when utilizing public unencrypted Wi-Fi networks?',
    options: [
      {
        id: 'a',
        text: 'Use your mobile data hotspot or activate a reputable, encrypted Virtual Private Network (VPN) before accessing any sensitive accounts.',
        isCorrect: true,
        explanation: 'Open public Wi-Fi allows attackers on the same network to execute man-in-the-middle attacks or set up rogue "Evil Twin" hotspots. Cellular data or a VPN encrypts traffic against local eavesdropping.'
      },
      {
        id: 'b',
        text: 'Browsing in Incognito / Private Mode completely protects your network traffic from being captured on public Wi-Fi.',
        isCorrect: false,
        explanation: 'Incognito mode only prevents local history from being saved on your device; it does not encrypt Wi-Fi packets traversing the air.'
      },
      {
        id: 'c',
        text: 'Open public Wi-Fi is safe as long as your laptop battery is over 80%.',
        isCorrect: false,
        explanation: 'Battery levels have zero bearing on cryptographic network security.'
      },
      {
        id: 'd',
        text: 'Turn off your computer screen while entering passwords so Wi-Fi routers cannot see your keystrokes.',
        isCorrect: false,
        explanation: 'Network packets are transmitted digitally; screen brightness does not affect network data interception.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Public open Wi-Fi lacks peer-to-peer isolation and encryption. Cellular data or an encrypted VPN tunnel prevents local packet inspection and DNS hijacking.',
    warningSigns: [
      'Multiple identical Wi-Fi names with slight spelling variations ("Evil Twin" hotspots)',
      'Networks requiring no password or terms confirmation',
      'Browser warning popups indicating invalid SSL certificate chains'
    ],
    educationalTakeaway: 'Incognito mode does not encrypt network traffic. For sensitive tasks on public networks, prefer personal cellular hotspots or a trusted VPN.',
    takeaway: 'Incognito mode does not encrypt network traffic. For sensitive tasks on public networks, prefer personal cellular hotspots or a trusted VPN.',
    status: 'published',
  },
  {
    id: 16,
    title: 'Mobile App Permissions: Flashlight & Calculator Data Audits',
    category: 'Privacy',
    topic: 'Privacy',
    difficulty: 'intermediate',
    scenario: 'You download a free "HD Flashlight & Torch" app from the app store. Upon launching, it asks for permissions to: "Access Location all the time", "Read Contacts", "Access Microphone", and "Read Device Storage".',
    question: 'Why should you immediately deny these permissions and uninstall this app?',
    options: [
      {
        id: 'a',
        text: 'A flashlight app requires zero access to contacts, microphone, or background location to turn on an LED. These excessive permissions are intended to harvest and monetize your personal data.',
        isCorrect: true,
        explanation: 'Principle of Least Privilege: Apps should only receive permissions essential to their core functional purpose. Unrelated permission demands indicate spyware or data brokering.'
      },
      {
        id: 'b',
        text: 'Flashlights need your microphone to measure ambient darkness.',
        isCorrect: false,
        explanation: 'Microphones record sound, not optical luminescence.'
      },
      {
        id: 'c',
        text: 'The operating system automatically translates contacts into light beam patterns.',
        isCorrect: false,
        explanation: 'This is nonsensical; contacts have no connection to illumination.'
      },
      {
        id: 'd',
        text: 'The app is only allowed to access contacts of people who also installed the app.',
        isCorrect: false,
        explanation: 'Granted contacts permission grants read access to your entire address book.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Excessive permissions are a hallmark of data-harvesting apps. Always evaluate whether an app has a legitimate technical justification for every permission requested.',
    warningSigns: [
      'Utility tools demanding access to private communications, contacts, or background location',
      'Apps that refuse to function if non-essential telemetry permissions are denied',
      'Free utility tools with vague privacy policies hosted on generic blog sites'
    ],
    educationalTakeaway: 'Apply the principle of least privilege: Never grant permissions that have no technical connection to the application’s basic utility.',
    takeaway: 'Apply the principle of least privilege: Never grant permissions that have no technical connection to the application’s basic utility.',
    status: 'published',
  },

  // =========================================================================
  // 8. SOCIAL MEDIA SAFETY
  // =========================================================================
  {
    id: 17,
    title: 'Cloned Profile Friend Request',
    category: 'Social Media Safety',
    topic: 'Social Media Safety',
    difficulty: 'beginner',
    scenario: 'You receive a new Instagram or Facebook friend request from your colleague Priya. Her profile picture and bio look identical, but you are already friends with Priya on the platform. The new account messages you: "Hey, my old account got locked! I urgently need a small favor."',
    question: 'What is happening and what should you do?',
    options: [
      {
        id: 'a',
        text: 'This is a cloned profile scam. Scammers copy public photos to impersonate friends and solicit money or emergency OTPs. Do not accept, and report the fake account.',
        isCorrect: true,
        explanation: 'Identity cloning is common on social media. Scammers scrape public photos and friend lists to target contacts with fake emergencies or malicious links.'
      },
      {
        id: 'b',
        text: 'Accept the request and send the money because Priya has always been trustworthy in the past.',
        isCorrect: false,
        explanation: 'The person behind the keyboard is a criminal impersonator, not your colleague.'
      },
      {
        id: 'c',
        text: 'Send your Facebook login password so Priya can log into your account to fix hers.',
        isCorrect: false,
        explanation: 'Never share your account passwords with anyone under any circumstances.'
      },
      {
        id: 'd',
        text: 'Create your own clone profile to test if Priya accepts your request.',
        isCorrect: false,
        explanation: 'Violates platform terms of service and does not solve the impersonation attack.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Scammers clone public accounts by copying pictures and bios to exploit trust. Verify duplicate friend requests through offline out-of-band channels.',
    warningSigns: [
      'Receiving a friend request from someone you are already connected with',
      'New account has very few followers and was created within the past 48 hours',
      'Immediate direct message requesting money, gift cards, or emergency verification codes'
    ],
    educationalTakeaway: 'Before accepting duplicate requests or fulfilling urgent favors, verify with the person directly via a phone call or in-person conversation.',
    takeaway: 'Before accepting duplicate requests or fulfilling urgent favors, verify with the person directly via a phone call or in-person conversation.',
    status: 'published',
  },
  {
    id: 18,
    title: 'Viral "Fun" Social Media Quizzes and Security Questions',
    category: 'Social Media Safety',
    topic: 'Social Media Safety',
    difficulty: 'intermediate',
    scenario: 'A popular viral graphic circulating on social media asks: "Find your Superhero Name! Combine the name of your first childhood pet + your mother\'s maiden name + the street you grew up on!" Thousands of users are commenting with their answers.',
    question: 'Why are these harmless-looking viral games a serious security vulnerability?',
    options: [
      {
        id: 'a',
        text: 'These specific questions are the exact default security questions used by banks, email providers, and password recovery systems to reset accounts.',
        isCorrect: true,
        explanation: 'Security question harvesting allows threat actors to scrape your public profile and answers, then execute password resets on your email or banking accounts.'
      },
      {
        id: 'b',
        text: 'The graphic downloads a virus into your smartphone screen.',
        isCorrect: false,
        explanation: 'Standard social media images do not execute viruses directly by viewing; the vulnerability is human data disclosure.'
      },
      {
        id: 'c',
        text: 'Superhero names are copyrighted and can lead to civil lawsuits.',
        isCorrect: false,
        explanation: 'This is unrelated to the cybersecurity threat.'
      },
      {
        id: 'd',
        text: 'Algorithms flag users who answer quizzes and ban them from shopping apps.',
        isCorrect: false,
        explanation: 'Social algorithms promote viral quizzes; they do not ban users.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Viral quizzes harvest personally identifiable answers to security questions (mother\'s maiden name, childhood pets, elementary school) used in password resets.',
    warningSigns: [
      'Quizzes or memes prompting for nostalgic childhood details',
      'Posts asking for your birth month, high school mascot, or first vehicle',
      'Public comment threads containing sensitive personal trivia'
    ],
    educationalTakeaway: 'Never reveal answers to common account recovery questions on public social media forums. If required by a service, use random passphrases instead of real facts.',
    takeaway: 'Never reveal answers to common account recovery questions on public social media forums. If required by a service, use random passphrases instead of real facts.',
    status: 'published',
  },

  // =========================================================================
  // 9. MOBILE SECURITY
  // =========================================================================
  {
    id: 19,
    title: 'Sideloading Unknown APK Files from WhatsApp',
    category: 'Mobile Security',
    topic: 'Mobile Security',
    difficulty: 'beginner',
    scenario: 'A message in a WhatsApp group shares a file named "PM_Kisan_Yojana_Govt_Bonus_₹5000.apk" or "Free_Cricket_WorldCup_Live.apk" instructing users to download the file and enable "Install Unknown Apps" in phone settings.',
    question: 'What is the primary danger of installing third-party APK files received via messaging chats?',
    options: [
      {
        id: 'a',
        text: 'Sideloaded APKs bypass Google Play Protect review and frequently contain financial banking trojans that capture keystrokes, intercept SMS OTPs, and steal funds.',
        isCorrect: true,
        explanation: 'Malicious APKs often contain RATs (Remote Access Trojans) or banking overlay spyware. Once installed with accessibility permissions, they steal credentials and empty accounts automatically.'
      },
      {
        id: 'b',
        text: 'Installing the APK simply reduces your phone\'s 5G network speed by 10%.',
        isCorrect: false,
        explanation: 'The risk is total device takeover and financial theft, not network speed.'
      },
      {
        id: 'c',
        text: 'The file is safe as long as your phone has a pin code lock on the lock screen.',
        isCorrect: false,
        explanation: 'Lock screens do not prevent malicious background apps from exfiltrating data once installed.'
      },
      {
        id: 'd',
        text: 'Google automatically deletes malicious APK files before you can tap them.',
        isCorrect: false,
        explanation: 'When users manually override security settings to sideload apps, operating system protections are bypassed.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Sideloading APKs distributed through messaging platforms is the number one vector for Android banking malware. Always install software from official stores only.',
    warningSigns: [
      'Receiving APK files directly via WhatsApp, Telegram, or SMS',
      'Instructions prompting you to toggle "Allow Installation from Unknown Sources"',
      'Promising free bonuses, free subscriptions, or pirated sports streams'
    ],
    educationalTakeaway: 'Never install APK files forwarded in chats or downloaded from web links. Rely exclusively on official app stores.',
    takeaway: 'Never install APK files forwarded in chats or downloaded from web links. Rely exclusively on official app stores.',
    status: 'published',
  },
  {
    id: 20,
    title: 'Juice Jacking at Public USB Charging Stations',
    category: 'Mobile Security',
    topic: 'Mobile Security',
    difficulty: 'advanced',
    scenario: 'Your phone battery is at 2% in a train station. You notice a public USB charging kiosk with open USB ports. When you plug in your phone using a standard USB data cable, your phone screen prompts: "Trust this computer and allow access to device data?"',
    question: 'What should you do in this situation?',
    options: [
      {
        id: 'a',
        text: 'Tap "Don\'t Trust / Charge Only" and disconnect. If possible, use your own AC wall adapter into an electric socket or use a USB data-blocker adapter.',
        isCorrect: true,
        explanation: 'USB cables transmit both power and data simultaneously. Compromised public USB ports ("juice jacking") can attempt to extract files or deploy malware when data pairing is authorized.'
      },
      {
        id: 'b',
        text: 'Tap "Trust" because airport and station charging stations are monitored by railway police.',
        isCorrect: false,
        explanation: 'Public USB ports can be physically tampered with or wired to hidden hardware behind the wall plate.'
      },
      {
        id: 'c',
        text: 'Unplug and plug it back in 3 times to force the port into charging mode.',
        isCorrect: false,
        explanation: 'Re-plugging does not change the physical wiring of the USB pins.'
      },
      {
        id: 'd',
        text: 'Enter your phone passcode on the kiosk screen to verify you own the phone.',
        isCorrect: false,
        explanation: 'Never enter passcodes into unfamiliar terminals.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'USB data pins can transfer malware or extract device files. When charging in public, use AC power outlets with your own charger or use a hardware USB data blocker.',
    warningSigns: [
      'Phone displaying "Trust this Computer?" or "Allow access to phone data?" when plugged into a simple power station',
      'Loose or modified USB wall sockets in public transit hubs',
      'Unattended cables dangling from public charging kiosks'
    ],
    educationalTakeaway: 'Carry your own AC power brick or portable power bank. Never authorize data connections when connecting to public USB charging terminals.',
    takeaway: 'Carry your own AC power brick or portable power bank. Never authorize data connections when connecting to public USB charging terminals.',
    status: 'published',
  },

  // =========================================================================
  // 10. SAFE BROWSING
  // =========================================================================
  {
    id: 21,
    title: 'The "HTTPS Padlock" Myth vs Domain Authenticity',
    category: 'Safe Browsing',
    topic: 'Safe Browsing',
    difficulty: 'intermediate',
    scenario: 'You click a link from an email that leads to "https://secure-login-paypa1.com" (with the numeral 1 replacing the letter l). Your web browser displays a green or solid security padlock icon next to the address.',
    question: 'Does the presence of HTTPS and the padlock icon guarantee that the website is legitimate and safe?',
    options: [
      {
        id: 'a',
        text: 'No. The padlock only proves that the connection between your browser and the server is encrypted. Anyone, including scammers, can obtain a free SSL certificate for a fake domain.',
        isCorrect: true,
        explanation: 'HTTPS encrypts data in transit so third parties on your Wi-Fi cannot read it. However, if the destination server is owned by a criminal, your encrypted credentials go straight to the criminal.'
      },
      {
        id: 'b',
        text: 'Yes. Web browsers conduct thorough background checks and police verification before issuing padlock icons.',
        isCorrect: false,
        explanation: 'Automated certificate authorities issue SSL certificates in seconds without verifying business legitimacy.'
      },
      {
        id: 'c',
        text: 'Yes, because numeral substitutions are officially reserved for backup financial servers.',
        isCorrect: false,
        explanation: 'Numeral substitutions (typosquatting) are malicious tricks to mislead users.'
      },
      {
        id: 'd',
        text: 'No, but you are protected as long as you do not enter a CVV code.',
        isCorrect: false,
        explanation: 'Entering usernames and passwords still compromises your account credentials.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'HTTPS encrypts the transmission tunnel, but does NOT certify the trustworthiness of the destination. Today, over 80% of phishing websites use HTTPS certificates.',
    warningSigns: [
      'Typosquatting or lookalike character substitutions (e.g., paypa1, micros0ft)',
      'Assuming the HTTPS lock means an unknown website is safe to trust',
      'Subdomains disguising the real root domain (e.g., paypal.com.account-verify.xyz)'
    ],
    educationalTakeaway: 'The padlock means your connection is private, NOT that the site is honest. Always inspect the exact domain name in the address bar.',
    takeaway: 'The padlock means your connection is private, NOT that the site is honest. Always inspect the exact domain name in the address bar.',
    status: 'published',
  },
  {
    id: 22,
    title: 'Deceptive "Download" Buttons on Software Portals',
    category: 'Safe Browsing',
    topic: 'Safe Browsing',
    difficulty: 'beginner',
    scenario: 'You visit a website to download a free open-source media player. The page displays four large, flashing green buttons that say "DOWNLOAD NOW", "START DOWNLOAD", and "DOWNLOAD HERE", surrounded by tiny grey text.',
    question: 'How should you identify the legitimate software download link and avoid adware or trojans?',
    options: [
      {
        id: 'a',
        text: 'Inspect the links carefully. The large flashing buttons are malvertising banner ads designed to trick users into downloading bundled adware or spyware. Find the clean, native download link or download from the official GitHub / developer repository.',
        isCorrect: true,
        explanation: 'Malvertising ad networks deploy deceptive buttons resembling software download links. They install unwanted programs (PUPs) or malware.'
      },
      {
        id: 'b',
        text: 'Click the largest flashing button because websites always place the fastest server on top.',
        isCorrect: false,
        explanation: 'The largest banner is almost always a paid third-party advertisement.'
      },
      {
        id: 'c',
        text: 'Click all four buttons simultaneously to see which one finishes first.',
        isCorrect: false,
        explanation: 'This downloads multiple adware packages onto your computer.'
      },
      {
        id: 'd',
        text: 'Disable your antivirus software so the download won\'t be interrupted.',
        isCorrect: false,
        explanation: 'Disabling antivirus leaves your system defenseless against trojans.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Deceptive advertising buttons are a prevalent distribution technique for unwanted programs. Always look for the official project repository or direct developer URL.',
    warningSigns: [
      'Multiple competing "Download" buttons with different styles and fonts',
      'Tiny "Ad" or "Advertisement" disclosure labels near the buttons',
      'Downloaded file is an .exe or .msi when you were expecting a document, video, or zip archive'
    ],
    educationalTakeaway: 'Look past flashy advertisements. Verify the source URL and download software exclusively from official developer websites.',
    takeaway: 'Look past flashy advertisements. Verify the source URL and download software exclusively from official developer websites.',
    status: 'published',
  },

  // =========================================================================
  // 11. MALWARE AWARENESS
  // =========================================================================
  {
    id: 23,
    title: 'Macro-Enabled Word Document Attachment',
    category: 'Malware Awareness',
    topic: 'Malware Awareness',
    difficulty: 'intermediate',
    scenario: 'You open an unexpected email attachment titled "Resume_Shortlisted_Candidate.docm" or "Purchase_Order_March.docm". Microsoft Word opens in protected view with a yellow banner warning: "Security Warning: Macros have been disabled. Enable Content."',
    question: 'Why does the document urge you to "Enable Content" or "Enable Macros"?',
    options: [
      {
        id: 'a',
        text: 'The document contains embedded Visual Basic for Applications (VBA) macro code engineered to download and execute ransomware or infostealers on your computer as soon as you click enable.',
        isCorrect: true,
        explanation: 'Weaponized Office macros are a primary vehicle for enterprise ransomware and trojans (like Emotet). Malicious actors use social engineering graphics telling users to enable macros to "decrypt" the page.'
      },
      {
        id: 'b',
        text: 'Microsoft Word requires macros to display fonts correctly in English.',
        isCorrect: false,
        explanation: 'Font rendering has nothing to do with executable macro code.'
      },
      {
        id: 'c',
        text: 'Enabling macros increases your internet browsing speed.',
        isCorrect: false,
        explanation: 'Macros are automation scripts inside documents, not network optimizers.'
      },
      {
        id: 'd',
        text: 'It is safe to enable macros as long as the document has less than 5 pages.',
        isCorrect: false,
        explanation: 'Page count has no relation to malicious script execution.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Macros are executable programs inside documents. Threat actors disguise malware as fake invoices or resumes and urge victims to enable macros to trigger infection.',
    warningSigns: [
      'File extensions ending in .docm, .xlsm, .vbs, or .iso',
      'Document graphic claiming "This document is encrypted, click Enable Content to view"',
      'Unsolicited email from an unknown sender containing an unexpected invoice'
    ],
    educationalTakeaway: 'Never enable macros or execution permissions on unexpected email attachments. Legitimate organizations do not require macros to view documents.',
    takeaway: 'Never enable macros or execution permissions on unexpected email attachments. Legitimate organizations do not require macros to view documents.',
    status: 'published',
  },
  {
    id: 24,
    title: 'Ransomware Outbreak: Immediate First Steps',
    category: 'Malware Awareness',
    topic: 'Malware Awareness',
    difficulty: 'advanced',
    scenario: 'You notice your computer suddenly freezing, desktop files changing extensions to ".locked", and a text document opening demanding $500 in cryptocurrency to decrypt your personal memories and documents.',
    question: 'What is the absolute immediate first step you must take before doing anything else?',
    options: [
      {
        id: 'a',
        text: 'Immediately disconnect the computer from the network (unplug Ethernet cable and turn off Wi-Fi) to prevent ransomware from propagating to other connected computers, network shares, and cloud backups.',
        isCorrect: true,
        explanation: 'Containment is step #1 in incident response. Isolating the compromised machine stops the ransomware from traversing the local network or encrypting synchronized cloud storage drives.'
      },
      {
        id: 'b',
        text: 'Pay the ransom immediately within the first 10 minutes to receive an early-bird discount.',
        isCorrect: false,
        explanation: 'Paying extortionists funds criminal organizations and frequently results in zero decryption keys being provided.'
      },
      {
        id: 'c',
        text: 'Send the infected files to all your coworkers via email to ask if they can open them.',
        isCorrect: false,
        explanation: 'Spreading the malware across company email infects other colleagues.'
      },
      {
        id: 'd',
        text: 'Restart the computer 5 times in rapid succession to clear the virus memory.',
        isCorrect: false,
        explanation: 'Restarting can trigger persistence mechanisms or complete the encryption process.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Network isolation limits blast radius. Once isolated, you can preserve evidence, report the incident, and restore files from clean offline backups.',
    warningSigns: [
      'Fans spinning rapidly while files simultaneously rename with unknown extensions',
      'Ransom notes appearing on desktop wallpaper',
      'Antivirus software being disabled or terminated unexpectedly'
    ],
    educationalTakeaway: 'In a ransomware infection, immediately sever all network connections (Wi-Fi, LAN) to protect other devices and intact cloud backups.',
    takeaway: 'In a ransomware infection, immediately sever all network connections (Wi-Fi, LAN) to protect other devices and intact cloud backups.',
    status: 'published',
  },

  // =========================================================================
  // 12. IDENTITY THEFT
  // =========================================================================
  {
    id: 25,
    title: 'Masked Aadhaar vs Unmasked PII Sharing',
    category: 'Identity Theft',
    topic: 'Identity Theft',
    difficulty: 'intermediate',
    scenario: 'A hotel or online rental requests a copy of your government identity document (Aadhaar card) for booking confirmation. You need to provide proof of identity.',
    question: 'What is the safest and UIDAI-recommended practice for sharing identity documents for general verification?',
    options: [
      {
        id: 'a',
        text: 'Share a "Masked Aadhaar" (which hides the first 8 digits and displays only the last 4 digits) with a handwritten watermarked note stating the exact purpose and date of use.',
        isCorrect: true,
        explanation: 'UIDAI explicitly recommends using Masked Aadhaar for non-statutory verifications. Adding an explicit purpose watermark prevents identity brokers from reusing the image for unauthorized SIM issuance or loans.'
      },
      {
        id: 'b',
        text: 'Email high-resolution unmasked scans of both your Aadhaar and PAN card without any watermark.',
        isCorrect: false,
        explanation: 'Unmasked high-resolution scans are frequently leaked in hospitality database breaches and used for identity fraud.'
      },
      {
        id: 'c',
        text: 'Post the Aadhaar card on your public Facebook profile so anyone can verify it openly.',
        isCorrect: false,
        explanation: 'Publicly posting identity credentials exposes you to immediate synthetic identity theft.'
      },
      {
        id: 'd',
        text: 'Scratch out your photo so nobody can recognize your face.',
        isCorrect: false,
        explanation: 'Hotels require photo identification; masking the first 8 digits and watermarking the purpose is the correct legal standard.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Masked Aadhaar conceals the first 8 digits while preserving identity validity. Purpose-specific watermarks prevent document reuse in loan or SIM fraud.',
    warningSigns: [
      'Hotels or gyms demanding full unmasked physical photocopies without purpose watermarking',
      'Unsolicited requests to upload unmasked government documents via WhatsApp',
      'Third-party portals storing raw ID card images on unencrypted servers'
    ],
    educationalTakeaway: 'Use Masked Aadhaar whenever possible and cross-write a physical or digital purpose watermark (e.g., "For Hotel Check-in Only - 22/09/2026") across the document.',
    takeaway: 'Use Masked Aadhaar whenever possible and cross-write a physical or digital purpose watermark (e.g., "For Hotel Check-in Only - 22/09/2026") across the document.',
    status: 'published',
  },
  {
    id: 26,
    title: 'Fake Video KYC Call for Bank Account Re-Verification',
    category: 'Identity Theft',
    topic: 'Identity Theft',
    difficulty: 'advanced',
    scenario: 'You receive a video call on WhatsApp from a profile using your bank\'s corporate logo. The caller claims to be a Compliance Officer: "Your bank account KYC has expired and will be frozen. Please hold up your physical PAN card and Aadhaar card to the camera, state your mother\'s name, and read aloud the 6-digit confirmation code just sent to your phone."',
    question: 'Why is this video call extremely dangerous?',
    options: [
      {
        id: 'a',
        text: 'Banks never conduct official Video KYC via consumer messaging apps like WhatsApp. The attacker is capturing high-resolution photos of your physical identity cards and reading the OTP to open fraudulent credit lines or take over your net banking.',
        isCorrect: true,
        explanation: 'Official Video KYC occurs exclusively within the bank\'s secure, encrypted mobile banking app or authenticated web portal, never via consumer WhatsApp video calls. The 6-digit code is an authorization OTP for an unauthorized transaction or password reset.'
      },
      {
        id: 'b',
        text: 'WhatsApp video calls cannot transmit high enough resolution to read PAN numbers.',
        isCorrect: false,
        explanation: 'Modern video calls easily capture high-resolution text from ID cards held to the camera.'
      },
      {
        id: 'c',
        text: 'It is safe as long as the officer is wearing a necktie and business suit.',
        isCorrect: false,
        explanation: 'Scammers frequently dress in business attire or use pre-recorded video loops to appear authentic.'
      },
      {
        id: 'd',
        text: 'You should hold your debit card to the camera instead of your PAN card.',
        isCorrect: false,
        explanation: 'Displaying your debit card gives the attacker your card number and expiry date.'
      }
    ],
    correctAnswer: 'a',
    explanation: 'Scammers use fake Video KYC pretexts to harvest physical document pictures and intercept live OTPs. Legitimate banks only conduct KYC within verified, regulated applications.',
    warningSigns: [
      'Bank KYC requested over WhatsApp or Telegram video calls',
      'Demanding you read out loud incoming SMS codes during the call',
      'Threatening immediate account freeze or asset seizure within hours'
    ],
    educationalTakeaway: 'Never hold up identity documents or share SMS codes on video calls. Conduct banking KYC updates exclusively inside your official branch or official banking app.',
    takeaway: 'Never hold up identity documents or share SMS codes on video calls. Conduct banking KYC updates exclusively inside your official branch or official banking app.',
    status: 'published',
  }
];
