import { CybercrimeCategory, OfficialReportingRoute } from '../types';

export const INDIA_REPORTING_INFO = {
  helplineNumber: '1930',
  helplineName: 'National Cyber Crime Reporting Helpline',
  helplineShortDesc: 'Toll-free 24/7 emergency response for citizen financial cyber fraud and immediate interbank liaison',
  portalUrl: 'https://cybercrime.gov.in/',
  portalLabel: 'Official Government Portal',
  portalName: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
  disclaimerTitle: 'Official Reporting Notice & Advisory Boundary',
  disclaimer: 'CyberSafe is an independent academic digital safety initiative and is NOT affiliated with the Ministry of Home Affairs, state police departments, or any government agency. CyberSafe does NOT accept, record, forward, or submit cybercrime complaints. Victims must lodge official reports directly via the National Cybercrime Helpline 1930 or the Official Government Portal (cybercrime.gov.in).'
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
    title: 'Financial Fraud',
    iconName: 'CreditCard',
    tagline: 'Unauthorized UPI deductions, card fraud, investment app scams, fake customer care, or loan app blackmail',
    whatHappened: [
      'Unauthorized debit via UPI, Net Banking, or Credit/Debit card without your informed approval',
      'Deceptive "QR Code scanner to receive money" or fraudulent UPI collect request',
      'Bogus part-time task scams, Ponzi schemes, or illegal trading/crypto investment platforms',
      'SIM-swap or OTP interception leading to drained savings or credit card charges'
    ],
    immediateActions: [
      'Call the National Cyber Crime Helpline at 1930 immediately (the initial 1 to 2 hours are the "Golden Hours" to initiate interbank lien).',
      'Call your bank 24/7 fraud hotline immediately to block debit/credit cards, freeze net banking, and lodge an unauthorized transaction dispute.',
      'File an official formal complaint on the National Cyber Crime Reporting Portal (https://cybercrime.gov.in/) under Financial Fraud within 24 hours.',
      'Obtain an official grievance acknowledgment number and case reference from both your bank and the 1930 operator.'
    ],
    evidenceToPreserve: [
      'Bank statement (PDF) highlighting the unauthorized transaction line items',
      'Unique Transaction Reference (UTR) number, Transaction ID, and debit SMS timestamp',
      'Beneficiary UPI ID (VPA), beneficiary account number, or merchant reference',
      'Screenshots of chat conversations, fake payment receipts, or caller phone numbers'
    ],
    accountProtectionSteps: [
      'Change passwords and transaction PINs for net banking and UPI apps from a known secure device.',
      'Cancel auto-debit authorizations, e-mandates, and linked third-party merchant subscriptions.',
      'Revoke saved card autofill credentials in web browsers and shopping apps.',
      'Enable international transaction lock and set strict domestic debit limits in your banking app.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'National Cyber Crime Reporting Helpline (India)',
        description: 'Toll-free emergency helpline for immediate reporting of financial cyber fraud to facilitate lien/freeze of funds.',
        helpline: '1930',
        isOfficialGov: true,
        notes: 'Operated by the Indian Cyber Crime Coordination Centre (I4C), MHA. Connects directly with banks.'
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India portal for filing cybercrime complaints.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true,
        notes: 'Select "Report Financial Fraud" to generate an official statutory complaint acknowledgement.'
      },
      {
        name: 'Your Bank 24/7 Fraud & Grievance Cell',
        description: 'Emergency dispute desk of your issuing bank or payment provider.',
        notes: 'Contact number is printed on the back of your debit/credit card or within the official bank app.'
      },
      {
        name: 'RBI Banking Ombudsman (CMS Portal)',
        description: 'Reserve Bank of India escalation platform if your bank rejects zero-liability claims unjustly.',
        url: 'https://cms.rbi.org.in/',
        isOfficialGov: true,
        notes: 'Applicable after 30 days if your bank fails to resolve unauthorized electronic debits.'
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT search for customer service phone numbers on Google Search or Google Maps (cybercriminals post fake numbers to steal remaining funds).',
      'DO NOT install screen-sharing or remote desktop apps (AnyDesk, TeamViewer, RustDesk) under caller instructions.',
      'DO NOT pay any "fund recovery specialist" or ethical hacker online who claims they can get your money back for an advance fee.',
      'DO NOT assume fund recovery is guaranteed; interbank lien depends on speed of notice before the scammer withdraws cash.'
    ],
    // Backwards-compatible fields:
    immediateSafetySteps: [
      'Call National Cyber Crime Helpline: 1930 immediately.',
      'Call your bank 24/7 emergency fraud department to freeze cards and accounts.',
      'File an official complaint on https://cybercrime.gov.in/ within 24 hours.',
      'Change net banking credentials from a secure clean device.'
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
      }
    ]
  },
  {
    id: 'phishing',
    title: 'Phishing',
    iconName: 'MailWarning',
    tagline: 'Deceptive emails, fake delivery SMS (smishing), fake electricity bill threats, or deceptive voice calls (vishing)',
    whatHappened: [
      'SMS claiming your electricity connection will be disconnected tonight unless you call an unauthorized mobile number',
      'Bank KYC / PAN update expiry warnings linking to an imitation banking login screen',
      'Fake parcel delivery notices demanding a nominal 5 or 10 rupee re-delivery fee to steal card credentials',
      'Lottery, lucky draw, or cashback reward redemption links requiring UPI PIN entry'
    ],
    immediateActions: [
      'If you entered credentials, change the password for that specific service immediately on a known clean device.',
      'If you submitted debit or credit card numbers, call your bank customer care to hotlist and block the card immediately.',
      'If you downloaded an APK or file, turn ON Airplane mode immediately and do not open the file.',
      'Forward the deceptive SMS to the carrier spam reporting number (1909) or report on DoT Chakshu.'
    ],
    evidenceToPreserve: [
      'Exact phishing URL from your browser address bar or message link (do NOT click it again)',
      'Screenshot of the incoming SMS or email displaying the sender ID or complete sender email address',
      'Original email headers (.eml or "Show Original") if received via email',
      'Caller phone numbers or IVR audio recording if a fraudulent voice call occurred'
    ],
    accountProtectionSteps: [
      'Enable Multi-Factor Authentication (MFA) using an Authenticator App on all linked services.',
      'Review and terminate all active web and mobile sessions for the compromised service.',
      'Clear your browser cache, cookies, and saved passwords for the deceptive domain.',
      'Check email account forwarding rules to ensure the attacker did not set up automated mail redirection.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'File under "Report Other Cyber Crimes" > "Social Engineering / Phishing".',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'DoT Chakshu Portal (Sanchar Saathi)',
        description: 'Department of Telecommunications platform to report fraudulent SMS, WhatsApp, and call numbers.',
        url: 'https://sancharsaathi.gov.in/sfc/',
        isOfficialGov: true
      },
      {
        name: 'Google Safe Browsing Report Phishing',
        description: 'Submit malicious links to protect web browser users globally.',
        url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
        isOfficialGov: false
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT reply to the sender, click "unsubscribe", or call the phone number given in the suspicious message.',
      'DO NOT forward the deceptive link to family or friends without clearly labeling it as a dangerous scam.',
      'DO NOT assume a padlock icon (HTTPS) means a website is legitimate; modern phishing sites use free SSL certificates.',
      'NEVER enter your UPI PIN to receive money or refunds.'
    ],
    immediateSafetySteps: [
      'Change credentials immediately from a clean device if input was provided.',
      'Hotlist cards if payment information was submitted.',
      'Forward suspicious SMS to telecom spam reporting.',
      'Report on the official cybercrime portal.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'File under "Report Other Cyber Crimes" > "Phishing".',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'DoT Chakshu Portal (Sanchar Saathi)',
        description: 'Report suspected fraud communications over SMS/Calls.',
        url: 'https://sancharsaathi.gov.in/sfc/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'account-hacking',
    title: 'Account Hacking',
    iconName: 'Lock',
    tagline: 'Unauthorized access to personal email, social media, WhatsApp, or cloud storage accounts',
    whatHappened: [
      'You are locked out of your account with passwords or recovery email/phone changed by an unknown party',
      'Unfamiliar login sessions, international IP addresses, or unrecognized devices appearing in security logs',
      'Your profile is broadcasting spam, cryptocurrency promotions, or begging friends for emergency money',
      'WhatsApp registration code requested by someone pretending to be a friend or contact'
    ],
    immediateActions: [
      'Initiate the official account recovery process from a device and Wi-Fi network you have previously used.',
      'If you still have partial access, go to Account Security and click "Log Out of All Devices / Revoke Sessions" immediately.',
      'Check whether primary recovery phone or backup email address were altered; revert them immediately.',
      'Alert close friends and family via telephone that your account was compromised and to ignore requests for money.'
    ],
    evidenceToPreserve: [
      'Notification emails stating "Your password was changed" or "New login from unknown device"',
      'Screenshots of active device sessions showing attacker IP addresses, operating systems, and timestamps',
      'Screenshots of unauthorized messages, posts, or stories published from your account by the intruder',
      'Original account creation date and recovery codes if available'
    ],
    accountProtectionSteps: [
      'Create a fresh, unique 16+ character passphrase that is completely different from your old password.',
      'Enable Multi-Factor Authentication using an Authenticator app (e.g. Google Authenticator) instead of SMS.',
      'Audit third-party connected apps and OAuth authorizations; revoke permissions for unknown applications.',
      'Download and securely store fresh offline backup recovery codes for future emergency access.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'Official Platform Account Recovery Portal',
        description: 'Dedicated recovery system for Google (accounts.google.com), Meta (instagram.com/hacked), or Apple.',
        notes: 'Follow the identity verification steps provided by the service provider.'
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India portal for filing cyber intrusion and unauthorized computer access complaints.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true,
        notes: 'Report under "Report Other Cyber Crimes" > "Unauthorized Access / Hacking".'
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT pay "account recovery hackers" advertising on Instagram, X, or Telegram; all are secondary scammers.',
      'DO NOT delete security alert emails sent to your recovery inbox; they contain cryptographic rollback links.',
      'DO NOT reuse the compromised password on any other banking, work, or social account.'
    ],
    immediateSafetySteps: [
      'Use platform official recovery flow from a recognized device.',
      'Select "Log out of all other sessions" in security settings.',
      'Change master password to a strong passphrase.',
      'Enable authenticator-app MFA.'
    ],
    whereToReport: [
      {
        name: 'Platform Official Account Recovery',
        description: 'Submit an account recovery request directly on Google, Meta, or Apple support.'
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Report unauthorized account intrusion to law enforcement.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'identity-theft',
    title: 'Identity Theft',
    iconName: 'ShieldAlert',
    tagline: 'Misuse of Aadhaar, PAN, voter ID, or personal data to take loans, obtain SIM cards, or commit fraud',
    whatHappened: [
      'Unrecognized loan inquiries or new credit card accounts appearing on your CIBIL or Experian credit report',
      'Mobile SIM cards issued in your name without your knowledge or consent',
      'Fraudulent tax refund claims or shell company directorships registered using your PAN card',
      'Forged identity documents used by fraudsters to bypass e-KYC checks'
    ],
    immediateActions: [
      'Lock your Aadhaar biometrics immediately on the official UIDAI portal (myaadhaar.uidai.gov.in) or mAadhaar app.',
      'Check active mobile connections on DoT TAFCOP (tafcop.sancharsaathi.gov.in) and submit disconnection requests for unrecognized numbers.',
      'File an official dispute with the credit bureau (CIBIL / Experian) and with the concerned bank that issued the fraudulent loan.',
      'File an official identity theft FIR on the National Cyber Crime Reporting Portal (cybercrime.gov.in).'
    ],
    evidenceToPreserve: [
      'Credit bureau report copies highlighting the fraudulent loan accounts or inquiry timestamps',
      'Notice letters or SMS messages from recovery agencies regarding unfamiliar debts',
      'Screenshot of the DoT TAFCOP portal showing unauthorized mobile connections registered on your ID',
      'Police complaint acknowledgement numbers and letters sent to issuing institutions'
    ],
    accountProtectionSteps: [
      'Use "Masked Aadhaar" (which displays only the last 4 digits) for all routine identity verifications.',
      'Request credit bureaus to place a "Fraud Alert" on your credit profile to enforce strict lender verification.',
      'Update passwords and enable MFA on DigiLocker, Income Tax e-filing, and EPFO portals.',
      'Periodically audit your credit score reports at least once every quarter.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India portal for filing cyber identity theft and document forgery complaints.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true,
        notes: 'File under "Report Other Cyber Crimes" > "Identity Theft / Impersonation".'
      },
      {
        name: 'DoT TAFCOP Portal (Sanchar Saathi)',
        description: 'Department of Telecommunications portal to check and disconnect unauthorized SIM cards.',
        url: 'https://tafcop.sancharsaathi.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'UIDAI Aadhaar Grievance Portal',
        description: 'Official UIDAI portal to report biometric authentication misuse or unauthorized Aadhaar lookups.',
        url: 'https://myaadhaar.uidai.gov.in/',
        helpline: '1947',
        isOfficialGov: true
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT ignore unfamiliar loan recovery calls or collection notices; demand written dispute forms immediately.',
      'DO NOT upload unmasked identity cards to unverified online converters, rental platforms, or unknown WhatsApp numbers.',
      'DO NOT pay debts you never incurred just to stop recovery agent calls without filing a formal police dispute.'
    ],
    immediateSafetySteps: [
      'Lock Aadhaar biometrics via UIDAI.',
      'Check SIM cards on DoT TAFCOP and disconnect unknown numbers.',
      'Dispute unauthorized loans with issuing lenders and credit bureaus.',
      'Register an identity theft complaint on cybercrime.gov.in.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'File under Identity Theft with your credit evidence attached.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'DoT TAFCOP Portal (Sanchar Saathi)',
        description: 'Check SIM cards issued against your identity documents.',
        url: 'https://tafcop.sancharsaathi.gov.in/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'fake-profile',
    title: 'Fake Profile',
    iconName: 'UserX',
    tagline: 'Counterfeit social media or messaging profile created pretending to be you using your name and photos',
    whatHappened: [
      'A clone Instagram, Facebook, or LinkedIn profile using your profile photos, bio, and name',
      'The fake profile contacting your followers or mutual friends asking for urgent money or gift cards',
      'Unauthorized WhatsApp or Telegram profile displaying your display photo and claiming you lost your phone'
    ],
    immediateActions: [
      'Post a public story or notice on your genuine verified account alerting friends NOT to engage with or send money to the fake account.',
      'Report the counterfeit profile directly using the social media platform in-app reporting system (Report Profile > Pretending to Be Someone > Me).',
      'Ask mutual friends and trusted contacts to also report the fake profile to trigger platform automated safety checks.',
      'File an impersonation complaint on the National Cyber Crime Reporting Portal.'
    ],
    evidenceToPreserve: [
      'Direct web address (URL) of the counterfeit profile',
      'Screenshots of the fake profile page showing the username handle, photo, follower list, and bio',
      'Screenshots of any private direct messages the fake profile sent to your contacts, especially asking for money or links',
      'URL link of your genuine original profile for platform verification'
    ],
    accountProtectionSteps: [
      'Set your genuine social media profiles to Private to prevent scammers from downloading more personal photos.',
      'Hide your friends list or connection list from public view so scammers cannot scrape your contacts.',
      'Watermark or restrict visibility of personal photos posted online.',
      'Perform regular Google image reverse searches on your key profile pictures to spot clone accounts early.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'Platform In-App Trust & Safety',
        description: 'Report directly inside Instagram, Facebook, LinkedIn, X, or WhatsApp under "Impersonating Me".',
        notes: 'Platform moderators will review profile creation timestamps and may request government ID.'
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India portal for filing cyber complaints against fake profiles.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true,
        notes: 'Report under "Report Cyber Crime Against Women/Children" or "Report Other Cyber Crime" > "Fake Profile".'
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT pay any money, ransom, or extortion fees to the imposter to take down the fake profile.',
      'DO NOT engage in aggressive public arguments with the fake profile; focus on platform reporting.',
      'DO NOT click any verification links or shortened URLs sent by the imposter in private messages.'
    ],
    immediateSafetySteps: [
      'Do not engage with the fake profile directly.',
      'Report the profile using platform in-app tools.',
      'Alert contacts via your genuine profile.',
      'File a complaint on cybercrime.gov.in.'
    ],
    whereToReport: [
      {
        name: 'Social Media Platform Trust & Safety',
        description: 'Use the platform in-app reporting tool.'
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Report under Other Cyber Crime > Fake Profile.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'cyberbullying',
    title: 'Cyberbullying',
    iconName: 'AlertOctagon',
    tagline: 'Persistent online threats, abusive comments, doxxing, digital stalking, blackmail, or non-consensual image sharing',
    whatHappened: [
      'Repeated intimidating, harassing, or threatening comments across social channels or group chats',
      'Doxxing: your private residential address, phone number, or family details leaked online without consent',
      'Sextortion or blackmail threats demanding money or additional photos under threat of public humiliation',
      'Morphing or deepfaking personal photographs into compromising or explicit imagery'
    ],
    immediateActions: [
      'If you face immediate physical danger or credible threats of harm, dial 112 (National Emergency Support) immediately.',
      'DO NOT pay any money or send additional images if blackmailed; extortionists will never stop demanding more.',
      'Take complete screenshots and preserve all evidence before blocking the perpetrator.',
      'If non-consensual intimate imagery is threatened or leaked, use StopNCII.org to generate hash protection.'
    ],
    evidenceToPreserve: [
      'Complete uncropped screenshots of abusive chats, comments, emails, or posts with timestamps and profile handles',
      'Direct web links (URLs) to public forums, channels, or threads where harassment or doxxing occurred',
      'Raw audio files, voicemails, or screen recordings of phone threats',
      'Exported chat archive (do not delete the conversation thread as it serves as vital legal proof)'
    ],
    accountProtectionSteps: [
      'Lock down all your social media privacy settings, restrict direct messages to contacts only, and disable location tagging.',
      'Turn off comment permissions on existing public posts to halt pile-on abuse.',
      'Block the harasser across all channels once digital proof has been archived safely.',
      'Alert a trusted family member, guardian, counselor, or helpline for mental and emotional support.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
        description: 'Dedicated section for reporting cyber harassment and cybercrime against women and children.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true,
        notes: 'Offers anonymous complaint filing for non-consensual sexual content and explicit threats.'
      },
      {
        name: 'National Emergency Response System (Police India)',
        description: 'Immediate police intervention if you face real-world stalking or urgent physical danger.',
        helpline: '112',
        isOfficialGov: true
      },
      {
        name: 'StopNCII.org',
        description: 'Non-profit platform that generates secure digital hashes directly on your device to stop intimate image circulation.',
        url: 'https://stopncii.org/',
        isOfficialGov: false
      },
      {
        name: 'National Commission for Women (NCW) Helpline',
        description: '24/7 dedicated helpline for women facing cyber harassment and stalking.',
        helpline: '7827170170',
        isOfficialGov: true
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT delete the abusive messages or delete your account in panic before backing up complete evidence.',
      'DO NOT retaliate with abusive language, threats, or counter-doxxing, which complicates legal proceedings.',
      'DO NOT isolate yourself or blame yourself; professional legal and emotional support is available.'
    ],
    immediateSafetySteps: [
      'Do NOT pay money or give in to blackmail demands.',
      'Preserve all evidence before blocking the perpetrator.',
      'Use StopNCII.org if intimate imagery is involved.',
      'Dial 112 for urgent physical safety emergencies.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'File under Women/Child Cyber Crime or Cyber Stalking.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'National Emergency Response (Police)',
        description: 'Dial 112 for urgent safety threats.',
        helpline: '112',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'impersonation',
    title: 'Impersonation',
    iconName: 'ShieldAlert',
    tagline: 'Scammers posing as police officers, CBI, customs, bank managers, courier officials ("Digital Arrest" fraud)',
    whatHappened: [
      'Video call or phone call from someone claiming to be a CBI, ED, Police, or Supreme Court officer placing you under "digital arrest"',
      'Callers alleging a courier parcel sent in your name contained illegal narcotics or fake passports and demanding payment for clearance',
      'Caller claiming to be a bank manager or credit card executive offering reward point redemption or card limit upgrade',
      'Executive / CEO impersonation targeting employees to wire company funds or buy gift cards'
    ],
    immediateActions: [
      'HANG UP THE CALL IMMEDIATELY. Law enforcement agencies (Police, CBI, ED, Customs, Courts) NEVER conduct investigations, court hearings, or arrests via Skype/WhatsApp video calls.',
      'DO NOT transfer any money to "court accounts", "RBI verification accounts", or "escrow wallets". Genuine government agencies NEVER demand money transfers to clear your name.',
      'If you already transferred money, dial 1930 immediately and call your bank fraud cell to initiate an emergency lien.',
      'Verify the claim independently by calling your local police station or the official helpline of the concerned department.'
    ],
    evidenceToPreserve: [
      'Phone numbers, WhatsApp numbers, or Skype IDs used by the imposters',
      'Screenshots of fake police ID cards, forged arrest warrants, or fake court orders sent on chat',
      'Bank transaction reference (UTR) numbers and beneficiary account details if any transfer was made',
      'Call recordings or voice notes from the fraudsters'
    ],
    accountProtectionSteps: [
      'Block and report the imposter numbers on WhatsApp, Truecaller, and telecom operator spam registries.',
      'Warn family members and household staff about the digital arrest modus operandi so they are not frightened by follow-up calls.',
      'Review your public social media information and remove phone numbers and employer details from public view.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'National Cyber Crime Reporting Helpline (India)',
        description: 'Emergency helpline to report digital arrest and government officer impersonation fraud.',
        helpline: '1930',
        isOfficialGov: true,
        notes: 'If funds were transferred, dial 1930 immediately.'
      },
      {
        name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
        description: 'Official Government of India portal for filing digital arrest and impersonation complaints.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true,
        notes: 'File under "Report Financial Fraud" or "Impersonation / Cheating by Personation".'
      },
      {
        name: 'DoT Chakshu Portal (Sanchar Saathi)',
        description: 'Department of Telecommunications portal to report international spoofed numbers and fake authority calls.',
        url: 'https://sancharsaathi.gov.in/sfc/',
        isOfficialGov: true
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT stay on video calls or follow instructions to remain in a closed room for "surveillance" (digital arrest is a 100% psychological scam).',
      'DO NOT transfer any "bail money", "refundable security deposit", or "verification fee" to any account provided by callers.',
      'DO NOT share sensitive Aadhaar, PAN, or banking details to "verify your innocence".'
    ],
    immediateSafetySteps: [
      'Hang up immediately; no legal authority conducts digital arrests via video calls.',
      'Do not transfer money to any verification or court accounts.',
      'If money was transferred, dial 1930 immediately.',
      'Report the fake warrant and caller number on cybercrime.gov.in.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Helpline',
        description: 'Dial 1930 immediately if money was transferred.',
        helpline: '1930',
        isOfficialGov: true
      },
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India reporting portal.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'malicious-website',
    title: 'Malicious Website',
    iconName: 'Globe',
    tagline: 'Counterfeit government websites, fake job recruitment portals, fake traffic e-challan portals, or weaponized download portals',
    whatHappened: [
      'Fake traffic e-challan or electricity payment website designed to harvest credit/debit card credentials',
      'Bogus government portals charging unauthorized fees for passport appointments, birth certificates, or PAN cards',
      'Fake recruitment portals demanding registration fees or security deposits for non-existent corporate/government jobs',
      'Deceptive browser popups claiming your computer is infected with viruses and displaying a fake Microsoft/Apple support number'
    ],
    immediateActions: [
      'Close the browser tab immediately and clear your browser cache and cookies.',
      'If you submitted debit or credit card details, call your bank immediately to block the card.',
      'If payment was debited, dial 1930 immediately and file a dispute with your bank.',
      'Submit the malicious web link to Google Safe Browsing and CERT-In to protect other users.'
    ],
    evidenceToPreserve: [
      'Full web address (URL) of the fraudulent website copied from your browser history',
      'Screenshots of the webpage showing fake government emblems, misleading certifications, or payment prompts',
      'Transaction receipts, UPI references, or merchant IDs if any payment was processed',
      'Whois domain registration details if available'
    ],
    accountProtectionSteps: [
      'Bookmark verified official portals (e.g. echallan.parivahan.gov.in, passportindia.gov.in) rather than searching for them on search engines.',
      'Enable browser Enhanced Protection (in Google Chrome / Brave / Edge settings).',
      'Install an ad-blocking or reputable DNS-filtering extension to prevent deceptive sponsored search ads.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Report counterfeit and deceptive websites under "Report Other Cyber Crimes".',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'CERT-In (Indian Computer Emergency Response Team)',
        description: 'National nodal agency for incident response and blocking malicious cyber infrastructure in India.',
        url: 'https://www.cert-in.org.in/',
        helpline: '1800-11-4949',
        isOfficialGov: true,
        notes: 'Email the deceptive URL to incident@cert-in.org.in for rapid domain takedown.'
      },
      {
        name: 'Google Safe Browsing Report Phishing',
        description: 'Flag malicious links to trigger browser-level security block screens globally.',
        url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
        isOfficialGov: false
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT click on sponsored/ad links at the very top of Google Search results for government services, customer care, or utility bills.',
      'DO NOT download software patches or call phone numbers displayed on browser "critical virus alert" popups.',
      'DO NOT enter banking credentials on websites without verifying the exact domain spelling (e.g. .gov.in vs .gov-portal.com).'
    ],
    immediateSafetySteps: [
      'Close the browser tab and clear cookies.',
      'Hotlist cards if payment information was submitted.',
      'Dial 1930 if fees were fraudulently deducted.',
      'Submit the URL to Google Safe Browsing and CERT-In.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Report deceptive domains under Other Cyber Crime.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'CERT-In Incident Response Desk',
        description: 'Submit malicious infrastructure for national blocking.',
        url: 'https://www.cert-in.org.in/',
        helpline: '1800-11-4949',
        isOfficialGov: true
      }
    ]
  },
  {
    id: 'other-cybercrime',
    title: 'Other Cybercrime',
    iconName: 'Shield',
    tagline: 'Ransomware, illegal spy apps, unauthorized cryptocurrency mining, SIM swap, or online gaming fraud',
    whatHappened: [
      'Ransomware encrypting business or personal computer files and demanding cryptocurrency for decryption',
      'Covert spy app or tracking software installed on your smartphone without your consent by an unverified repair shop or acquaintance',
      'Unauthorized SIM swap resulting in complete loss of mobile network signal while OTPs are stolen',
      'Online gaming tournament scams or illegal betting platform fraud'
    ],
    immediateActions: [
      'Disconnect the infected computer or phone from Wi-Fi, Ethernet, and Bluetooth immediately to prevent lateral spread.',
      'If SIM swap is suspected (sudden "No Service" on your phone), call your telecom operator from another phone immediately to block the SIM.',
      'DO NOT pay any ransom demands; payment funds criminal enterprises and rarely results in file decryption.',
      'Report the incident to the National Cyber Crime Reporting Portal and CERT-In.'
    ],
    evidenceToPreserve: [
      'Ransom note text file, README instructions, or screenshots of the lock screen',
      'Sample of encrypted file with its modified extension (e.g. document.docx.locked)',
      'Wallet addresses, email addresses, or communication channels provided by the attackers',
      'Device system logs, security software alerts, and timestamps of the intrusion'
    ],
    accountProtectionSteps: [
      'Perform clean operating system reinstalls on affected machines after forensic backup.',
      'Restore critical documents from verified offline or immutable cloud backups created prior to the infection.',
      'Rotate credentials for all services accessed from the compromised system.',
      'Check NoMoreRansom.org (a global law enforcement initiative) to see if a free decryption tool exists for your ransomware strain.'
    ],
    relevantOfficialReportingRoute: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India portal for filing cyber incident FIRs.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true,
        notes: 'File under "Report Other Cyber Crimes" > "Ransomware / Malicious Code".'
      },
      {
        name: 'CERT-In (Indian Computer Emergency Response Team)',
        description: 'National agency providing technical guidance and threat mitigation for ransomware and severe cyber attacks.',
        url: 'https://www.cert-in.org.in/',
        helpline: '1800-11-4949',
        isOfficialGov: true
      },
      {
        name: 'No More Ransom Project',
        description: 'Global law enforcement & cybersecurity partnership providing free decryption tools for known ransomware families.',
        url: 'https://www.nomoreransom.org/',
        isOfficialGov: false
      }
    ],
    warningsWhatNotToDo: [
      'DO NOT pay ransoms; there is no legal guarantee attackers will provide functioning decryption keys.',
      'DO NOT restart or run unverified disk repair utilities on encrypted drives as it may corrupt encrypted headers permanently.',
      'DO NOT keep external backup hard drives plugged into the infected machine.'
    ],
    immediateSafetySteps: [
      'Disconnect devices from network cables and Wi-Fi immediately.',
      'Contact telecom operator immediately if SIM swap is suspected.',
      'Do not pay ransoms; consult CERT-In.',
      'Report on cybercrime.gov.in.'
    ],
    whereToReport: [
      {
        name: 'National Cyber Crime Reporting Portal',
        description: 'Official Government of India reporting portal.',
        url: 'https://cybercrime.gov.in/',
        isOfficialGov: true
      },
      {
        name: 'CERT-In National Incident Response Desk',
        description: 'Technical guidance for ransomware and malware.',
        url: 'https://www.cert-in.org.in/',
        helpline: '1800-11-4949',
        isOfficialGov: true
      }
    ]
  }
];
