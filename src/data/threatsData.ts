import { ThreatItem } from '../types';

export const THREATS_DATA: ThreatItem[] = [
  {
    id: 'phishing',
    title: 'Phishing Attacks',
    category: 'Deception & Fraud',
    severity: 'critical',
    iconName: 'MailWarning',
    shortDesc: 'Fraudulent emails, texts, or fake websites masquerading as legitimate organizations to harvest credentials or financial data.',
    fullDesc: 'Phishing is the most common cyber attack vector worldwide. Attackers craft messages that imitate trusted entities like your bank, employer, utility provider, or popular services (Netflix, Amazon, Google). They leverage emotional triggers—such as panic, urgency, or curiosity—to prompt you into clicking malicious links or revealing sensitive credentials.',
    redFlags: [
      'Generic greetings like "Dear Customer" or "Valued Member" instead of your name',
      'Artificial urgency ("Your account will be suspended within 24 hours")',
      'Mismatched sender email domains (e.g., support@paypa1-security-check.com)',
      'Unsolicited requests to confirm passwords, PINs, or card numbers',
      'Awkward grammar, odd punctuation, or blurry corporate logos'
    ],
    realExample: 'A victim received an email appearing to come from their bank warning of an "unauthorized wire transfer of $840". Panicked, they clicked the "Cancel Transaction" button, which opened an identical-looking login page where their username, password, and two-factor code were stolen in real time.',
    actionSteps: [
      'Never click links inside unverified emails; open a fresh browser tab and navigate to the official website directly.',
      'Inspect the actual sender address carefully, not just the display name.',
      'If you accidentally submitted passwords, immediately change them on the real site and revoke active sessions.',
      'Report the phishing message to your email provider and the impersonated brand.'
    ],
    preventionTips: [
      'Enable Multi-Factor Authentication (MFA) on all critical accounts.',
      'Use a password manager that will refuse to autofill credentials on lookalike domains.',
      'Verify unexpected requests by calling the organization using the official phone number on your physical card or monthly statement.'
    ]
  },
  {
    id: 'smishing-vishing',
    title: 'Smishing & Vishing',
    category: 'Deception & Fraud',
    severity: 'high',
    iconName: 'Smartphone',
    shortDesc: 'SMS phishing (smishing) and voice phone call scams (vishing) designed to impersonate delivery couriers, banks, or law enforcement.',
    fullDesc: 'Attackers increasingly target mobile devices directly. Smishing involves urgent text messages with links regarding missed package deliveries, unpaid tolls, or bank fraud alerts. Vishing involves high-pressure phone calls from fake agents, IRS officials, or automated voice robots claiming legal action or requesting remote computer access.',
    redFlags: [
      'Text messages with shortened links (bit.ly, tinyurl) about postal deliveries or bank holds',
      'Callers demanding payment via gift cards, wire transfer, or cryptocurrency',
      'Callers claiming to be from "Tech Support" or "Fraud Department" demanding remote screen control (AnyDesk, TeamViewer)',
      'Threats of immediate arrest or legal consequences if you hang up'
    ],
    realExample: 'A user received an SMS: "USPS: Your parcel has arrived at our distribution hub but cannot be delivered due to an incorrect address. Update details at usps-redelivery-hub.info within 12 hours." Entering billing details incurred unauthorized recurring charges.',
    actionSteps: [
      'Hang up immediately if an unsolicited caller creates panic or demands financial transactions.',
      'Never tap links in unexpected text messages; check your carrier tracking app directly.',
      'Forward suspicious SMS messages to 7726 (SPAM) to alert cellular networks.'
    ],
    preventionTips: [
      'Enable spam call & SMS filtering on your mobile operating system.',
      'Remember that legitimate government agencies (IRS, police) never demand payments via telephone or text.',
      'Register your phone number on national Do Not Call registries.'
    ]
  },
  {
    id: 'ransomware',
    title: 'Ransomware & Extortion',
    category: 'Malicious Software',
    severity: 'critical',
    iconName: 'Lock',
    shortDesc: 'Malware that encrypts your personal files, family photos, and documents, demanding cryptocurrency payment for a decryption key.',
    fullDesc: 'Ransomware infiltrates systems via malicious email attachments, compromised software downloads, or unpatched vulnerabilities. Once executed, it silently encrypts all accessible local drives and connected backup disks, then displays a frightening ransom note demanding hundreds or thousands of dollars in Bitcoin.',
    redFlags: [
      'Files suddenly changing extensions to unknown strings (.locked, .crypt)',
      'Desktop background suddenly replaced with text instructions demanding crypto ransom',
      'System slowdown accompanied by rapid hard disk writing activity',
      'Email attachments masquerading as invoices with double extensions (e.g., Invoice.pdf.exe)'
    ],
    realExample: 'A freelance photographer downloaded a "cracked" photo editing plugin from an unverified forum. Within minutes, their entire 10-year portfolio was encrypted, leaving a README_TO_RESTORE.txt note demanding 0.5 BTC.',
    actionSteps: [
      'Disconnect your device from Wi-Fi and unplug all ethernet and USB drives immediately to halt spread.',
      'Do not pay the ransom; payment does not guarantee file recovery and fuels cybercriminal cartels.',
      'Check NoMoreRansom.org (a global law-enforcement initiative) to see if a free decryption tool exists for your strain.'
    ],
    preventionTips: [
      'Maintain the 3-2-1 backup rule: 3 copies of data, across 2 different media, with 1 stored securely offsite or disconnected (cold storage).',
      'Keep operating systems and anti-malware software updated automatically.',
      'Never download pirated or cracked software.'
    ]
  },
  {
    id: 'identity-theft',
    title: 'Identity Theft & Account Takeover',
    category: 'Data Breach & Privacy',
    severity: 'critical',
    iconName: 'UserX',
    shortDesc: 'Criminals obtaining personal data (SSN, birthdate, credentials) to open unauthorized credit lines, file fraudulent tax returns, or hijack profiles.',
    fullDesc: 'Data breaches at commercial retailers, healthcare providers, and social platforms leak billions of personal records into dark web forums. Cybercriminals stitch these puzzle pieces together to impersonate you, apply for credit in your name, redirect postal mail, or commandeer online banking and social accounts.',
    redFlags: [
      'Receiving two-factor authentication codes via SMS that you did not trigger',
      'Notices from credit bureaus regarding new credit inquiries or accounts you did not open',
      'Inexplicable rejection of a tax return filing stating a return was already submitted',
      'Unexpected letters or collection notices for goods you never ordered'
    ],
    realExample: 'After a healthcare system database was breached, criminals used an individual’s leaked Social Security Number and date of birth to apply for two store credit cards and max out $6,000 in electronics.',
    actionSteps: [
      'Place a credit freeze with all major bureaus (Equifax, Experian, TransUnion). Freezing credit is free and stops new accounts.',
      'File an official report at IdentityTheft.gov (FTC) to establish a recovery plan.',
      'Notify your bank and change all linked email account passwords immediately.'
    ],
    preventionTips: [
      'Check HaveIBeenPwned.com periodically to see if your email was involved in known breaches.',
      'Keep your credit frozen by default; unfreeze temporarily only when you apply for a loan.',
      'Shred physical documents containing sensitive personal identifiers before disposal.'
    ]
  },
  {
    id: 'credential-stuffing',
    title: 'Password Attacks & Credential Stuffing',
    category: 'Authentication Vulnerabilities',
    severity: 'high',
    iconName: 'KeyRound',
    shortDesc: 'Automated attacks testing leaked username/password pairs across hundreds of websites because users reuse the same passwords.',
    fullDesc: 'When one minor website suffers a breach, criminals run automated bots that test that exact email and password against banking, email, shopping, and entertainment platforms. Since over 60% of people reuse passwords across multiple services, a single compromised forum password can compromise your primary email.',
    redFlags: [
      'Security alert emails stating "New sign-in from an unknown device or country"',
      'Being unexpectedly logged out of services on your phone or computer',
      'Sudden password reset emails that you did not initiate',
      'Mysterious password change confirmations'
    ],
    realExample: 'A user had the same password ("Summer2022!") for both an old pet forum and their food delivery app. When the pet forum was breached, bots took over the delivery account and placed $300 in fraudulent orders.',
    actionSteps: [
      'Immediately reset the password of the affected account and your primary email account.',
      'Check all sessions in security settings and click "Log out of all devices".',
      'Adopt a reputable password manager (e.g. Bitwarden, 1Password) to generate unique passwords.'
    ],
    preventionTips: [
      'Never reuse passwords across different accounts. Every service requires a distinct password.',
      'Use passphrases of 4+ random words (e.g., "correct-horse-battery-staple") that are easy to remember and mathematically impossible to brute-force.',
      'Use authenticator apps (TOTP) or hardware security keys (FIDO2) instead of SMS codes.'
    ]
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering & Impersonation',
    category: 'Human Exploitation',
    severity: 'high',
    iconName: 'Users',
    shortDesc: 'Psychological manipulation tricking individuals into handing over confidential data, bypassing corporate security, or transferring money.',
    fullDesc: 'Instead of hacking software code, social engineers hack human psychology. They exploit natural human tendencies: trust, desire to help, fear of authority, or fear of missing out. Scams include the "Grandparent scam" (begging for bail money), executive impersonation, or fake romantic interests (romance scams).',
    redFlags: [
      'Sudden emotional urgency paired with an absolute requirement for secrecy',
      'A contact claiming to be a friend or relative in distress asking for money via wire or crypto',
      'Requests from "executives" or "supervisors" asking you to buy gift cards for clients',
      'Online acquaintances who shower you with affection but always find excuses not to meet on video call'
    ],
    realExample: 'A retired grandmother received a phone call from someone crying: "Grandma, I got into a car accident and I’m in jail, please talk to my lawyer." A fake attorney got on the line and demanded $5,000 in cash via courier for bail.',
    actionSteps: [
      'Pause and breathe. Social engineering relies on adrenaline to bypass logical skepticism.',
      'Independently contact the person supposedly in distress via their known, verified telephone number.',
      'Never send funds via wire transfer, gift cards, or crypto to someone you have not verified face-to-face.'
    ],
    preventionTips: [
      'Establish a secret family emergency passphrase that only close relatives know.',
      'Be cautious of how much personal routine and family detail you share on public social media.',
      'Verify unusual workplace requests via a secondary communication channel (e.g., verbal or internal chat).'
    ]
  },
  {
    id: 'public-wifi',
    title: 'Public Wi-Fi & Network Snooping',
    category: 'Network Vulnerabilities',
    severity: 'medium',
    iconName: 'WifiOff',
    shortDesc: 'Insecure public wireless networks that allow eavesdroppers to intercept unencrypted traffic or set up malicious "evil twin" hotspots.',
    fullDesc: 'Free Wi-Fi at airports, hotels, and cafes often lacks enterprise encryption. Adversaries can operate rogue access points with names like "Airport_Free_WiFi" or intercept unencrypted network packets (Man-in-the-Middle attacks), capturing credentials or redirecting your browser to counterfeit websites.',
    redFlags: [
      'Multiple Wi-Fi networks with almost identical names (e.g., "Starbucks_Guest" and "Starbucks_Free_WiFi")',
      'The network does not require a password to connect',
      'Browser warning: "Your connection is not private" or certificate invalidation errors',
      'Websites that normally use HTTPS suddenly showing insecure HTTP'
    ],
    realExample: 'A business traveler connected to an open network named "Hotel_Lobby_Fast". A nearby attacker running an Evil Twin router captured the traveler’s session tokens, accessing their unencrypted web portals.',
    actionSteps: [
      'Immediately disconnect from the suspicious network and turn off Wi-Fi on your device.',
      'Switch to cellular mobile data (tethering/hotspot) for any sensitive financial transactions.',
      'If you logged into sensitive services while on the network, change passwords from a safe network.'
    ],
    preventionTips: [
      'Use a reputable Virtual Private Network (VPN) whenever connecting to untrusted networks.',
      'Disable "Auto-Connect to Open Wi-Fi Networks" in your phone and computer settings.',
      'Check that every sensitive website displays the padlock and valid HTTPS certificate.'
    ]
  },
  {
    id: 'malware-spyware',
    title: 'Malware, Spyware & Keyloggers',
    category: 'Malicious Software',
    severity: 'critical',
    iconName: 'Bug',
    shortDesc: 'Covert software that infects your computer or smartphone to log keystrokes, steal stored passwords, and record audio/camera feeds.',
    fullDesc: 'Spyware and Trojans hide inside seemingly innocent apps, cracked software downloads, or malicious email attachments. Advanced spyware can monitor everything you type (keyloggers), capture screen recordings, access webcam video, or drain cryptocurrency wallets without displaying any obvious warning dialogs.',
    redFlags: [
      'Unusual battery drain, excessive heat, or surging background data usage on mobile devices',
      'New browser toolbars, search engine changes, or pop-ups appearing on trusted websites',
      'Webcam indicator light turning on intermittently when no camera apps are open',
      'Sluggish system performance, random crashes, or disabled antivirus software'
    ],
    realExample: 'A student downloaded a free PDF converter utility from an advertising link. Bundled with the converter was a background keylogger that recorded their banking logins and transmitted them to an overseas server.',
    actionSteps: [
      'Boot your computer in Safe Mode and run a full system scan with Microsoft Defender or Malwarebytes.',
      'Review installed browser extensions and delete any extension you do not recognize or actively use.',
      'On mobile, check Settings > Apps for suspicious apps with broad administrative permissions.'
    ],
    preventionTips: [
      'Only download software from verified official app stores or developer websites.',
      'Review app permission requests carefully (e.g., why does a simple calculator app need microphone and location access?).',
      'Keep your operating system updated to ensure security vulnerabilities are patched.'
    ]
  },
  {
    id: 'shopping-scams',
    title: 'Online Shopping & Counterfeit Store Scams',
    category: 'E-Commerce Scams',
    severity: 'medium',
    iconName: 'ShoppingBag',
    shortDesc: 'Counterfeit web storefronts advertised on social media offering luxury items or hot electronics at 80% discounts.',
    fullDesc: 'Scammers launch short-lived online shops using clean templates and run targeted advertisements on Facebook, Instagram, or TikTok. They promise high-end electronics, designer apparel, or power tools at impossibly low prices. After collecting credit card details or payments via non-refundable methods, goods never arrive or are cheap counterfeits.',
    redFlags: [
      'Prices that are 70% to 90% below retail market value for high-demand items',
      'The website domain was registered only days or weeks ago (check via WHOIS)',
      'No physical business address, legitimate phone number, or realistic return policy',
      'Only accepting payment methods that lack fraud protection (Zelle, CashApp, wire transfer, cryptocurrency)'
    ],
    realExample: 'A shopper saw an Instagram ad for brand-name winter parkas for $39 (normally $350). They paid with their debit card. The item never shipped, the customer service email bounced, and unauthorized subscription charges followed.',
    actionSteps: [
      'Contact your credit card issuer immediately to dispute the charge and request a replacement card.',
      'Report the fraudulent advertisement and account to the social media platform.',
      'File a complaint with the Better Business Bureau (BBB) and FBI IC3.'
    ],
    preventionTips: [
      'Always pay with a credit card (or PayPal with buyer protection) rather than a debit card or peer-to-peer cash transfer.',
      'Search the store name followed by "reviews" or "scam" before purchasing.',
      'If an offer looks too good to be true, it is almost certainly a scam.'
    ]
  },
  {
    id: 'tech-support-scam',
    title: 'Tech Support & Fake Antivirus Scams',
    category: 'Deception & Fraud',
    severity: 'high',
    iconName: 'AlertTriangle',
    shortDesc: 'Loud, full-screen pop-ups with screeching alarms claiming your PC has a virus and providing a toll-free number to "Microsoft Support".',
    fullDesc: 'Malicious ad networks trigger browser pop-ups that lock the screen, emit siren sound effects, and display official-looking Microsoft or Apple warning screens. Victims are instructed to call a phone number immediately. The phone scammer pretends to run diagnostic commands in the command prompt, claims hackers are inside the PC, and charges $299 to $999 for bogus lifetime support.',
    redFlags: [
      'Browser windows that refuse to close or lock in full-screen mode with flashing red alerts',
      'Phone numbers displayed inside a web browser claiming to be "Direct Microsoft Hotline"',
      'Agents demanding you download AnyDesk, TeamViewer, or LogMeIn to "fix the infection"',
      'The technician showing normal system event viewer logs and claiming they are "trojan viruses"'
    ],
    realExample: 'An elderly user was browsing news when a window popped up screaming that their computer was locked due to "Zeus Virus Error #0x800". They called the number, allowed remote access, and paid $450 in Target gift cards before their daughter intervened.',
    actionSteps: [
      'Do not call the phone number. Microsoft and Apple never put customer support phone numbers on error screens.',
      'Force close the web browser using Task Manager (Ctrl + Shift + Esc on Windows) or Activity Monitor (Mac).',
      'If remote access was granted, immediately disconnect the internet, uninstall the remote tool, and have the device checked.'
    ],
    preventionTips: [
      'Install an effective browser ad-blocker (such as uBlock Origin) to prevent malicious pop-unders.',
      'Remember that legitimate operating systems never prompt you to call a telephone hotline.',
      'Educate less tech-savvy family members and seniors about this prevalent scare tactic.'
    ]
  }
];
