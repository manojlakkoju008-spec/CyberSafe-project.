import { PreventionMethodology } from '../types';

export const PREVENTION_METHODOLOGIES: PreventionMethodology[] = [
  // 1. PASSWORD SECURITY
  {
    id: 'methodology-passwords',
    areaId: 'passwords',
    title: 'Password Security & Credential Hygiene',
    category: 'accounts',
    tagline: 'Eliminate reused passwords and transition to cryptographically strong, vaulted credentials.',
    iconName: 'KeyRound',
    whatShouldIDo: 'Use an audited password manager to generate and store unique, 16+ character passphrases for every single digital account.',
    howShouldIDoIt: 'Install a reputable vault (Bitwarden, 1Password, or Proton Pass), set a 4-word master passphrase, and replace legacy repeated passwords one-by-one.',
    whenShouldIDoIt: 'Set up immediately for master email and banking; audit legacy accounts every 6 months or whenever notified of a vendor data breach.',
    whyDoesItMatter: 'Reused passwords allow automated credential stuffing bots to breach dozens of your accounts immediately after any single unrelated service gets hacked.',
    risk: {
      summary: 'Automated credential stuffing, rainbow table brute-forcing, and credential harvesting attacks.',
      threatActors: ['Automated botnets', 'Initial access brokers', 'Opportunistic cybercriminals'],
      potentialImpact: 'Total account takeover across multiple services, financial theft, identity impersonation, and blackmail.',
      realWorldScenario: 'A fitness app suffers a database breach leaking email/password combos. Within 48 hours, bots test that exact combination against 200 banking, PayPal, and email services, locking the user out of their primary inbox.'
    },
    whyItMattersDetail: [
      'Over 80% of web breaches exploit stolen, weak, or recycled credentials.',
      'Humans cannot memorize 100+ unique, 16-character complex passwords without pattern repetition.',
      'A compromised email password allows an attacker to reset credentials across virtually every connected account.'
    ],
    recommendedPractice: {
      headline: 'Zero-Password-Reuse with Dedicated Vaults',
      goldenRule: 'Never know your passwords—know only your vault master passphrase and let cryptography handle the rest.',
      standardsReference: 'NIST SP 800-63B / CIS Control 6 (Access Control Management)'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Choose and Install an Audited Password Manager',
        timing: 'Immediate (10 minutes)',
        description: 'Select an end-to-end encrypted password manager (e.g., Bitwarden, 1Password, Proton Pass) on all your daily devices (phone, laptop, browser extension).',
        actionableDetail: 'Create an account and write down the emergency recovery kit / secret key physically on paper. Store it in a safe document box at home.',
        proTip: 'Never store your vault recovery key in a cloud note or photo album.'
      },
      {
        stepNumber: 2,
        title: 'Formulate a 4-Word Diceware Master Passphrase',
        timing: 'Initial Setup',
        description: 'Create a memorable yet computationally uncrackable master passphrase using 4-5 random words separated by hyphens.',
        actionableDetail: 'Example format: "Cobalt-Pebble-Dolphin-Lantern-42". High entropy makes it immune to dictionary attacks while easy to type.',
        proTip: 'Avoid song lyrics, famous quotes, birthdays, or family names.'
      },
      {
        stepNumber: 3,
        title: 'Systematically Triage and Replace High-Risk Accounts',
        timing: 'Within 7 Days',
        description: 'Triage accounts by severity: 1) Primary Email, 2) Financial/Banking, 3) Government & Healthcare, 4) Social Media.',
        actionableDetail: 'For each account, use the manager’s random generator to produce a 20+ character random password with mixed symbols.',
        proTip: 'Turn on the vault’s built-in breach monitoring (HaveIBeenPwned integration) to flag compromised credentials.'
      },
      {
        stepNumber: 4,
        title: 'Enable Biometric Unlock and Auto-Lock Timer',
        timing: 'Ongoing',
        description: 'Configure the vault to lock immediately upon closing the browser or after 5 minutes of system inactivity.',
        actionableDetail: 'Enable Face ID or Fingerprint unlock for rapid access without compromising master passphrase exposure to shoulder-surfing.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using slight variations of one root password (e.g., Summer2024!, Summer2024@).',
        whyItsDangerous: 'Credential stuffing tools incorporate AI pattern mutators that automatically calculate numeric and seasonal variations.',
        betterAlternative: 'True pseudo-random strings generated directly inside the password manager.'
      },
      {
        mistake: 'Storing passwords in browser autofill without a master encryption password or PIN.',
        whyItsDangerous: 'Infostealer trojans (e.g., RedLine, Lumma) harvest unencrypted browser SQLite databases in under 3 seconds.',
        betterAlternative: 'Use a dedicated password manager extension with independent encryption memory protection.'
      },
      {
        mistake: 'Writing down passwords in an unencrypted digital notepad or email draft.',
        whyItsDangerous: 'Any session hijacking or malware with read permissions immediately exfiltrates the document.',
        betterAlternative: 'Store digital credentials only inside your encrypted vault.'
      }
    ],
    quickChecklist: [
      { id: 'pw-1', itemText: 'Dedicated password manager installed on phone and main browser', priority: 'essential' },
      { id: 'pw-2', itemText: 'Master passphrase is 4+ random words and memorized', priority: 'essential' },
      { id: 'pw-3', itemText: 'Emergency recovery key printed or written on physical paper', priority: 'essential' },
      { id: 'pw-4', itemText: 'Zero reused passwords on email, banking, and government accounts', priority: 'essential' },
      { id: 'pw-5', itemText: 'Browser built-in password saving disabled in favor of the vault', priority: 'recommended' },
      { id: 'pw-6', itemText: 'Vault auto-lock timeout set to 5 minutes or less', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If you suspect a password was leaked, log into the service immediately and trigger a password change.',
        'Select "Sign out of all other active sessions" or "Revoke all device tokens" in the account security settings.',
        'Change passwords for any other accounts that shared the same or similar password.'
      ],
      containmentSteps: [
        'Check the account’s forwarded email addresses, authorized third-party OAuth apps, and recovery phone numbers for unauthorized alterations.',
        'Run an endpoint malware scan to ensure no keylogger or infostealer is recording your new password.'
      ],
      recoverySteps: [
        'Enable MFA via an authenticator app on the recovered account immediately.',
        'Review recent financial and transaction logs for unauthorized requests.',
        'Report unauthorized changes to the respective service support team.'
      ]
    },
    relatedChecklistIds: ['password-manager-unique-passwords', 'fictional-security-questions', 'audit-logged-in-sessions']
  },

  // 2. MULTI-FACTOR AUTHENTICATION (MFA)
  {
    id: 'methodology-mfa',
    areaId: 'mfa',
    title: 'Multi-Factor Authentication (MFA) Hardening',
    category: 'accounts',
    tagline: 'Add an independent second layer of verification that stops 99% of automated credential breaches.',
    iconName: 'ShieldCheck',
    whatShouldIDo: 'Activate hardware keys (FIDO2/Passkeys) or time-based authenticator apps (TOTP) on all critical accounts, deprecating SMS verification wherever possible.',
    howShouldIDoIt: 'Go to account Security Settings > 2-Step Verification, select "Authenticator App" or "Passkey", scan the QR code, and securely record your emergency backup codes.',
    whenShouldIDoIt: 'Enable immediately when creating any new account or during your first safety audit; verify backup codes annually.',
    whyDoesItMatter: 'Even if an attacker buys or steals your password in a breach, they cannot log into your account without physical access to your authentication factor.',
    risk: {
      summary: 'SIM swapping, SMS interception, phishing proxy kits (Evilginx), and MFA prompt fatigue bombing.',
      threatActors: ['SIM-swap syndicates', 'Phishing kits', 'Targeted account hijackers'],
      potentialImpact: 'Bypassing password defenses, unauthorized logins, and locked-out victims.',
      realWorldScenario: 'An executive clicks a link in a realistic corporate portal phishing email. The attacker steals the password, but is completely blocked because Google prompts for a physical security key or TOTP code that the attacker cannot produce.'
    },
    whyItMattersDetail: [
      'Microsoft threat intelligence reports that MFA prevents over 99.2% of automated account takeover attempts.',
      'Passwords alone represent single-point failure; credentials will inevitably be leaked or phished over time.',
      'Hardware tokens and Passkeys provide cryptographic origin binding that completely defeats reverse-proxy phishing attacks.'
    ],
    recommendedPractice: {
      headline: 'Authenticator App & FIDO2 Passkey First',
      goldenRule: 'Treat SMS 2FA as an absolute fallback only; prioritize Authenticator Apps (TOTP) and Hardware Passkeys.',
      standardsReference: 'CISA Multi-Factor Authentication Guidance / NIST SP 800-63B AAL2'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Install a Dedicated Authenticator Application',
        timing: 'Day 1 (5 minutes)',
        description: 'Download Aegis Authenticator (Android), Ente Auth, Google Authenticator, or Bitwarden Authenticator.',
        actionableDetail: 'Ensure the authenticator app itself is locked behind biometrics (PIN/Fingerprint) and that encrypted cloud or local backups are enabled.',
        proTip: 'Avoid SMS codes: mobile carrier SIM swaps allow attackers to redirect SMS text codes to their own SIM card.'
      },
      {
        stepNumber: 2,
        title: 'Activate MFA on Tier-1 Anchor Accounts',
        timing: 'Immediate',
        description: 'Prioritize: 1) Primary Google/Apple/Microsoft accounts, 2) Password Manager vault, 3) Banking & UPI platforms, 4) Social profiles.',
        actionableDetail: 'Navigate to Security > 2-Step Verification > Add Authenticator App. Scan the QR code with your authenticator.',
        proTip: 'Never approve an MFA prompt if you did not actively initiate a login right that second.'
      },
      {
        stepNumber: 3,
        title: 'Safeguard and Store Emergency One-Time Backup Codes',
        timing: 'During Setup',
        description: 'Every provider issues 8-10 single-use recovery codes upon enabling MFA. Print or securely store these.',
        actionableDetail: 'If you lose your phone, these backup codes are the ONLY way to regain access without lengthy identity verification.',
        proTip: 'Keep a printed copy in a secure physical location or inside an encrypted emergency vault kit.'
      },
      {
        stepNumber: 4,
        title: 'Adopt FIDO2 Passkeys on Supported Services',
        timing: 'Next 30 Days',
        description: 'Migrate eligible accounts (Google, Apple, Amazon, GitHub, WhatsApp) to Passkeys for phishing-resistant logins.',
        actionableDetail: 'Passkeys use public-key cryptography tied to your device biometric chip—they cannot be typed into fake phishing websites.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Assuming SMS verification is bulletproof.',
        whyItsDangerous: 'Attackers bribe carrier staff, forge caller IDs, or exploit SS7 telecom routing flaws to intercept SMS codes.',
        betterAlternative: 'Switch to TOTP authenticator apps or FIDO2 hardware keys.'
      },
      {
        mistake: 'Failing to save single-use backup codes during initial MFA configuration.',
        whyItsDangerous: 'Losing or dropping your phone can lead to permanent account lockout from email or cloud storage.',
        betterAlternative: 'Always download, print, or store recovery codes in an encrypted offline backup.'
      },
      {
        mistake: 'Accepting repeated push notifications ("MFA fatigue") to stop phone buzzing.',
        whyItsDangerous: 'Attackers trigger dozens of login notifications at 3 AM hoping you tap "Approve" out of frustration or confusion.',
        betterAlternative: 'Immediately reject the prompt, change your master password, and audit active sessions.'
      }
    ],
    quickChecklist: [
      { id: 'mfa-1', itemText: 'Authenticator app installed and locked behind biometric security', priority: 'essential' },
      { id: 'mfa-2', itemText: 'MFA active on primary email (Google, Microsoft, or Apple ID)', priority: 'essential' },
      { id: 'mfa-3', itemText: 'MFA active on Password Manager vault', priority: 'essential' },
      { id: 'mfa-4', itemText: 'Emergency backup codes printed or saved in an offline safe place', priority: 'essential' },
      { id: 'mfa-5', itemText: 'FIDO2 Passkeys tested and adopted on primary online accounts', priority: 'recommended' },
      { id: 'mfa-6', itemText: 'SMS-based 2FA replaced with authenticator app where available', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If you receive an unsolicited MFA prompt or SMS code, do NOT approve it. Your password has been compromised.',
        'Immediately change your password from a trusted device and select "Sign out of all sessions".'
      ],
      containmentSteps: [
        'If you lost your phone, locate your printed single-use backup codes immediately to sign in and revoke the lost device authenticator token.',
        'Call your mobile carrier to request a SIM lock / port-freeze PIN if you suspect SIM-swapping activity.'
      ],
      recoverySteps: [
        'Pair a new authenticator device using your recovery codes.',
        'Regenerate a fresh set of one-time backup codes immediately.'
      ]
    },
    relatedChecklistIds: ['mfa-primary-email', 'password-manager-unique-passwords']
  },

  // 3. ACCOUNT RECOVERY
  {
    id: 'methodology-recovery',
    areaId: 'account-recovery',
    title: 'Account Recovery & Emergency Access Planning',
    category: 'accounts',
    tagline: 'Fortify the emergency channels through which lost accounts are restored, preventing backdoor hijacks.',
    iconName: 'RefreshCw',
    whatShouldIDo: 'Regularly audit and update recovery emails, backup phone numbers, emergency contacts, and fictional security question answers.',
    howShouldIDoIt: 'Review Account Security settings; remove old inactive numbers; configure trusted emergency contacts (e.g. Apple Legacy Contact, Google Inactive Account Manager).',
    whenShouldIDoIt: 'Audit every 6 months, and whenever you change your phone number, internet service provider, or physical address.',
    whyDoesItMatter: 'Attackers frequently target obsolete recovery emails or phone numbers to reset passwords through forgot-password backdoors without needing your current password.',
    risk: {
      summary: 'Recycled phone numbers, expired secondary email takeovers, and social engineering of recovery helpdesks.',
      threatActors: ['Identity impersonators', 'Opportunistic scavengers of expired domains/numbers', 'Stalkerware operators'],
      potentialImpact: 'Permanent loss of personal files, unauthorized password resets, and irreversible digital lockout.',
      realWorldScenario: 'A user switches cell carriers and forgets to update their old phone number on PayPal. Months later, a stranger buys that recycled number and uses SMS reset to hijack the PayPal balance.'
    },
    whyItMattersDetail: [
      'Telecom operators recycle inactive phone numbers after 90 days, granting new owners access to reset codes for linked accounts.',
      'Security questions with factual answers (mother’s maiden name, childhood pet) are easily discovered via public records and social media.',
      'Having a documented digital inheritance/recovery plan prevents family members from losing access to essential assets in an emergency.'
    ],
    recommendedPractice: {
      headline: 'Dedicated Recovery Channel with Fictionalized Answers',
      goldenRule: 'Treat security questions like secondary passwords and never link an abandoned phone number or school/work email as recovery.',
      standardsReference: 'NIST SP 800-63B Credential Recovery Protocols'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Audit All Recovery Phone Numbers and Email Addresses',
        timing: 'Immediate (15 minutes)',
        description: 'Verify that every account lists a currently active, privately owned phone number and an encrypted secondary email.',
        actionableDetail: 'Remove outdated college or former workplace email addresses that you no longer administratively control.',
        proTip: 'Never use an employer-issued email address as the recovery contact for your personal banking or identity accounts.'
      },
      {
        stepNumber: 2,
        title: 'Fictionalize and Vault All Security Question Answers',
        timing: 'Next 7 Days',
        description: 'Whenever forced to provide security questions, invent randomized answers and save them in your password manager.',
        actionableDetail: 'Question: "What high school did you attend?" -> Answer: "Tango#Orchid-98-Nebula". Do not write genuine biographical truths.',
        proTip: 'Attackers use genealogy tools, birth records, and Facebook birthday posts to guess real answers in minutes.'
      },
      {
        stepNumber: 3,
        title: 'Designate a Trusted Digital Emergency Contact',
        timing: 'Within 30 Days',
        description: 'Configure trusted contact features: Apple Legacy Contact, Google Inactive Account Manager, or Bitwarden Emergency Access.',
        actionableDetail: 'This grants a spouse, sibling, or trusted executor secure, authorized access if you are incapacitated.',
        proTip: 'Set a waiting period (e.g., 7 days) so you receive an alert and can cancel the request if you are healthy.'
      },
      {
        stepNumber: 4,
        title: 'Review Active Authorized Devices and Sessions',
        timing: 'Every 90 Days',
        description: 'Check "Logged-in Devices" or "Recent Activity" in Google, Apple, Microsoft, and bank accounts.',
        actionableDetail: 'Click "Log Out" on old laptops, traded-in phones, and public library computers.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Leaving an old phone number on bank or social accounts after changing phone contracts.',
        whyItsDangerous: 'Recycled phone numbers let new SIM owners request SMS resets and hijack your accounts.',
        betterAlternative: 'Update recovery phone numbers across all accounts prior to terminating an old SIM card.'
      },
      {
        mistake: 'Answering security questions honestly using real facts.',
        whyItsDangerous: 'Social engineering reconnaissance and public records reveal pets, mothers maiden names, and elementary schools.',
        betterAlternative: 'Provide random passphrases stored in your password manager.'
      }
    ],
    quickChecklist: [
      { id: 'rec-1', itemText: 'Recovery email on primary account is active and protected by strong MFA', priority: 'essential' },
      { id: 'rec-2', itemText: 'No abandoned, expired, or work/school email addresses used as personal recovery channels', priority: 'essential' },
      { id: 'rec-3', itemText: 'Active logged-in devices and sessions reviewed across Google/Apple/Microsoft', priority: 'recommended' },
      { id: 'rec-4', itemText: 'Security question answers randomized and stored in password manager', priority: 'recommended' },
      { id: 'rec-5', itemText: 'Emergency access or digital legacy contact configured for next of kin', priority: 'advanced' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If you receive an alert that recovery information was changed without your consent, click the official "It wasn’t me" rollback link in the security alert email.',
        'Attempt immediate password reset using remaining active recovery methods.'
      ],
      containmentSteps: [
        'Contact the service provider’s specialized account recovery team with proof of identity.',
        'Monitor financial accounts connected to that email address for fraudulent password reset requests.'
      ],
      recoverySteps: [
        'Re-establish your verified recovery email and phone number.',
        'Generate and download a brand new set of offline account recovery codes.'
      ]
    },
    relatedChecklistIds: ['audit-logged-in-sessions', 'fictional-security-questions']
  },

  // 4. DEVICE SECURITY
  {
    id: 'methodology-device-security',
    areaId: 'device-security',
    title: 'Physical & Endpoint Device Protection',
    category: 'devices',
    tagline: 'Fortify smartphones, tablets, and laptops against theft, shoulder-surfing, and hardware extraction.',
    iconName: 'Smartphone',
    whatShouldIDo: 'Implement strong 6+ digit alphanumeric screen locks, full-disk hardware encryption, biometric gates, and remote location/wipe capabilities.',
    howShouldIDoIt: 'Enable BitLocker (Windows) or FileVault (macOS); set phone auto-lock to 2 minutes; enable Apple Find My or Google Find Hub; install apps strictly from official stores.',
    whenShouldIDoIt: 'Configure immediately when setting up any new device; verify remote wipe test and lock timers monthly.',
    whyDoesItMatter: 'If a smartphone or laptop is stolen without encryption and a strong lock, thieves can extract your saved browser sessions, photos, and authenticators within minutes.',
    risk: {
      summary: 'Device theft, shoulder-surfing PINs in public, malicious USB rubber ducky attacks, and hardware forensic extraction.',
      threatActors: ['Street thieves', 'Opportunistic acquaintances', 'Stolen device fencing rings'],
      potentialImpact: 'Total device takeover, bank draining via unlocked payment apps, and blackmail with personal photos.',
      realWorldScenario: 'A thief in a bar watches someone enter a simple 4-digit PIN "1234", steals the phone, immediately changes the Apple ID password, revokes Find My, and empties banking apps within 20 minutes.'
    },
    whyItMattersDetail: [
      'Smartphones are digital identity hubs containing MFA apps, banking access, and personal credentials.',
      'Without full-disk encryption, removing a hard drive and plugging it into another PC grants instant access to all unencrypted files.',
      'Physical access without strong access barriers renders all cloud security controls irrelevant.'
    ],
    recommendedPractice: {
      headline: 'Cryptographic Hardware Encryption & Strict Screen Locks',
      goldenRule: 'Ensure your device locks automatically in under 2 minutes and encrypts storage at rest.',
      standardsReference: 'CIS Mobile Device Benchmark / NIST SP 800-124'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Upgrade Screen Lock to Alphanumeric or 6+ Digits',
        timing: 'Immediate (2 minutes)',
        description: 'Abandon 4-digit PINs and simple swipe patterns. Use a strong 6-digit numeric PIN or an alphanumeric passphrase.',
        actionableDetail: 'iOS/Android: Settings > Face ID & Passcode > Change Passcode > Passcode Options > Custom Alphanumeric or 6-digit PIN.',
        proTip: 'Enable Face ID or Fingerprint unlock so you do not expose your PIN to onlookers in crowded public areas.'
      },
      {
        stepNumber: 2,
        title: 'Enable Full-Disk Hardware Encryption',
        timing: 'Immediate',
        description: 'Modern smartphones are encrypted by default when locked. Ensure your laptops have disk encryption activated.',
        actionableDetail: 'macOS: System Settings > Privacy & Security > FileVault > Turn On. Windows 11/10: Settings > Privacy & Security > Device Encryption or BitLocker.',
        proTip: 'Print your 48-character BitLocker recovery key and keep it with physical documents.'
      },
      {
        stepNumber: 3,
        title: 'Configure Remote Tracking, Lock, and Wipe',
        timing: 'Day 1',
        description: 'Set up Apple "Find My" or Google "Find My Device" with offline finding capability.',
        actionableDetail: 'Verify that "Send Last Location" is enabled so the device broadcasts its position before the battery depletes.',
        proTip: 'Test logging into icloud.com/find or google.com/android/find from another device to ensure you remember credentials.'
      },
      {
        stepNumber: 4,
        title: 'Restrict Lock Screen Notifications and USB Accessories',
        timing: 'Next 7 Days',
        description: 'Prevent SMS verification codes and private messages from displaying on the lock screen while the device is locked.',
        actionableDetail: 'iOS: Settings > Notifications > Show Previews > "When Unlocked". Settings > Face ID & Passcode > Turn off "USB Accessories" when locked.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Setting phone display auto-lock timeout to "Never" or 10+ minutes.',
        whyItsDangerous: 'Setting down your phone on a café table allows anyone to pick it up and access all logged-in apps immediately.',
        betterAlternative: 'Set screen auto-lock to 1-2 minutes maximum.'
      },
      {
        mistake: 'Leaving USB debugging or unknown app sideloading enabled permanently on Android.',
        whyItsDangerous: 'Allows malicious charging kiosks or downloaded APKs to install malware without user consent.',
        betterAlternative: 'Disable USB debugging and keep Google Play Protect active.'
      }
    ],
    quickChecklist: [
      { id: 'dev-1', itemText: 'Screen lock is 6+ digits or alphanumeric, paired with biometrics', priority: 'essential' },
      { id: 'dev-2', itemText: 'Full-disk encryption enabled (FileVault on Mac, BitLocker on Windows)', priority: 'essential' },
      { id: 'dev-3', itemText: 'Screen auto-lock configured to 2 minutes or less', priority: 'essential' },
      { id: 'dev-4', itemText: 'Find My / Remote Wipe active and tested', priority: 'essential' },
      { id: 'dev-5', itemText: 'Lock screen previews hidden until unlocked to prevent SMS code spying', priority: 'recommended' },
      { id: 'dev-6', itemText: 'Sideloading of unknown apps disabled on mobile devices', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If a device is lost or stolen, immediately access icloud.com/find or google.com/android/find from any browser.',
        'Place the device in "Lost Mode" to lock the screen with a custom message and contact number.'
      ],
      containmentSteps: [
        'If the device cannot be retrieved or contains sensitive banking/work data, trigger a Remote Erase / Wipe command.',
        'Log into your Apple ID or Google Account and revoke authentication tokens for that device.',
        'Contact your mobile carrier to report the device stolen and block the IMEI number and SIM.'
      ],
      recoverySteps: [
        'Restore your digital life from your encrypted cloud or offline backup to a replacement device.',
        'File an official police report with your device serial number and IMEI for insurance and statutory claims.'
      ]
    },
    relatedChecklistIds: ['device-biometric-pin', 'remote-wipe-find-my', 'full-disk-encryption']
  },

  // 5. SOFTWARE UPDATES
  {
    id: 'methodology-updates',
    areaId: 'software-updates',
    title: 'Software Patching & Vulnerability Management',
    category: 'devices',
    tagline: 'Automate security updates to seal software zero-days and known vulnerabilities before exploits strike.',
    iconName: 'RefreshCw',
    whatShouldIDo: 'Turn on automatic updates across operating systems (iOS, Android, Windows, macOS), web browsers, and core daily applications.',
    howShouldIDoIt: 'Enable automatic OS updates; configure browsers to restart regularly; remove unused software and abandoned browser extensions.',
    whenShouldIDoIt: 'Apply critical security updates within 24-48 hours of release; review installed apps and extensions quarterly.',
    whyDoesItMatter: 'Over 80% of successful endpoint cyber attacks exploit publicly known vulnerabilities for which vendors have already published security patches.',
    risk: {
      summary: 'Zero-day exploits, drive-by browser downloads, remote code execution (RCE), and spyware installation.',
      threatActors: ['Commercial spyware vendors', 'Automated exploit kits', 'Ransomware distribution networks'],
      potentialImpact: 'Silent endpoint compromise, keylogging, camera/microphone hijacking, and file extortion.',
      realWorldScenario: 'An internet user visits a legitimate news website carrying a compromised advertising banner. Because their Chrome browser had not been updated in 6 months, an exploit automatically drops an infostealer onto the PC without any click.'
    },
    whyItMattersDetail: [
      'Software bugs are discovered continuously; vendors push security patches to fix these flaws before attackers weaponize them.',
      'Delaying updates gives attackers a window of opportunity to reverse-engineer published patches and attack unpatched machines.',
      'Outdated browser extensions often gain excessive permissions and can be acquired by malicious entities to inject ads and steal tokens.'
    ],
    recommendedPractice: {
      headline: 'Zero-Lag Automatic Patching',
      goldenRule: 'Never click "Remind me tomorrow" on a security patch—automate installs overnight.',
      standardsReference: 'CISA Known Exploited Vulnerabilities (KEV) Catalog / CIS Control 7'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Activate Automatic Operating System Updates',
        timing: 'Immediate (5 minutes)',
        description: 'Ensure Windows Update, macOS Software Update, and iOS/Android Automatic Updates are turned on.',
        actionableDetail: 'Windows: Settings > Windows Update > Turn on "Get latest updates as soon as they are available". macOS: Settings > General > Software Update > Enable Automatic Updates.',
        proTip: 'Allow overnight installation so system restarts do not interrupt your work.'
      },
      {
        stepNumber: 2,
        title: 'Keep Web Browsers Updated and Relaunched',
        timing: 'Weekly',
        description: 'Web browsers (Chrome, Edge, Firefox, Brave, Safari) receive critical security patches every 1-2 weeks.',
        actionableDetail: 'A browser update is NOT active until you relaunch the browser. Look for the "Relaunch to update" button in the top right corner.',
        proTip: 'Check chrome://settings/help or edge://settings/help to verify your browser is on the latest stable build.'
      },
      {
        stepNumber: 3,
        title: 'Prune Unused Software and Abandoned Browser Extensions',
        timing: 'Quarterly',
        description: 'Uninstall programs you have not used in the past 6 months to reduce your attack surface.',
        actionableDetail: 'Open your browser Extensions menu and delete old PDF converters, coupon scrapers, and novelty extensions.',
        proTip: 'Extensions run with high privileges and can read passwords or cookies on all visited websites.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Postponing operating system restarts for weeks or months.',
        whyItsDangerous: 'Patches are staged in temporary memory and provide zero protection until the computer reboots.',
        betterAlternative: 'Reboot your computer at least once a week or schedule automatic weekend restarts.'
      },
      {
        mistake: 'Using cracked, pirated, or unverified software downloads.',
        whyItsDangerous: 'Pirated keygens and torrents are the primary vector for infostealer malware and ransomware.',
        betterAlternative: 'Use legitimate open-source alternatives (e.g., LibreOffice, GIMP, VLC) or official vendor subscriptions.'
      }
    ],
    quickChecklist: [
      { id: 'upd-1', itemText: 'Automatic operating system updates enabled on phone, tablet, and PC', priority: 'essential' },
      { id: 'upd-2', itemText: 'Browser relaunched regularly to apply latest engine security fixes', priority: 'essential' },
      { id: 'upd-3', itemText: 'App Store / Google Play automatic app updates turned on', priority: 'essential' },
      { id: 'upd-4', itemText: 'Unused software and apps uninstalled from all personal devices', priority: 'recommended' },
      { id: 'upd-5', itemText: 'Browser extensions audited and trimmed to trusted essentials only', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If an alert indicates your system was exploited via an unpatched bug, disconnect the device from Wi-Fi immediately to cut off command-and-control servers.',
        'Run an offline Windows Defender or Malwarebytes deep scan.'
      ],
      containmentSteps: [
        'Boot into Safe Mode if ransomware or pop-up loops block normal operation.',
        'Install all pending operating system updates before reconnecting to the local network.'
      ],
      recoverySteps: [
        'If persistence malware is detected, perform a clean OS factory reset and restore clean files from backup.',
        'Change all passwords from a known-clean secondary device.'
      ]
    },
    relatedChecklistIds: ['os-auto-updates']
  },

  // 6. SAFE BROWSING
  {
    id: 'methodology-browsing',
    areaId: 'safe-browsing',
    title: 'Safe Web Browsing & Malicious Domain Defense',
    category: 'network',
    tagline: 'Defend against deceptive URLs, malicious typosquatting domains, rogue web downloads, and fake login portals.',
    iconName: 'Globe',
    whatShouldIDo: 'Enforce HTTPS-Only mode, inspect domain hostnames before entering credentials, install an ad/tracker blocker (uBlock Origin), and configure protective DNS.',
    howShouldIDoIt: 'Enable "Always Use Secure Connections" in browser settings; read URLs from right-to-left before the slash; install uBlock Origin; configure Quad9 DNS (9.9.9.9).',
    whenShouldIDoIt: 'Configure browser safeguards once; practice active domain verification every time you click an external link or type credentials.',
    whyDoesItMatter: 'Malicious websites disguise themselves with identical branding to legitimate banks or institutions to steal passwords, session tokens, and credit card numbers.',
    risk: {
      summary: 'Typosquatting, lookalike domains (Punycode attacks), malicious ad-redirects (malvertising), and credential-harvesting phishing portals.',
      threatActors: ['Phishing campaign operators', 'Malvertising syndicates', 'Scam call center web developers'],
      potentialImpact: 'Credential theft, financial transfer hijacking, rogue browser extension installs, and malware infections.',
      realWorldScenario: 'A user googles their bank name and clicks the top sponsored ad result. The URL is "online-mybank-secure.com" instead of "mybank.com". The fake page looks 100% authentic and steals their login credentials.'
    },
    whyItMattersDetail: [
      'Search engine sponsored ad results are routinely weaponized by scammers to promote fake download links and phishing portals.',
      'Visual appearance of a webpage can be duplicated perfectly with automated website scrapers in seconds; only the true domain name confirms identity.',
      'Protective DNS filters block millions of freshly registered phishing domains before your browser even renders the page.'
    ],
    recommendedPractice: {
      headline: 'Strict Domain Verification & Content Blocking',
      goldenRule: 'Never trust page appearance—always inspect the root domain before entering any login credential or personal detail.',
      standardsReference: 'NIST SP 800-162 / CISA Secure Web Browsing Practices'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Install an Open-Source Content Blocker (uBlock Origin)',
        timing: 'Immediate (2 minutes)',
        description: 'Add uBlock Origin to Chrome, Firefox, Edge, or Brave.',
        actionableDetail: 'This blocks malicious advertising networks, fraudulent download buttons, scam pop-ups, and covert tracking beacons.',
        proTip: 'Beware of fake ad-blockers in extension stores—verify the author is Raymond Hill.'
      },
      {
        stepNumber: 2,
        title: 'Turn on HTTPS-Only Mode in Your Browser',
        timing: 'Immediate',
        description: 'Ensure your browser strictly encrypts traffic and warns you before sending data over unencrypted HTTP.',
        actionableDetail: 'Chrome/Edge: Settings > Privacy and Security > Security > Turn on "Always use secure connections". Firefox: Settings > Privacy & Security > HTTPS-Only Mode.',
        proTip: 'Remember: HTTPS means the connection is encrypted, NOT that the website is trustworthy. Phishing sites have HTTPS too.'
      },
      {
        stepNumber: 3,
        title: 'Master Right-to-Left Domain Reading',
        timing: 'Habit Formation',
        description: 'Read the address bar right before the first single slash "/" to determine the real domain owner.',
        actionableDetail: 'In "paypal.com.customer-support-help.co/login", the true domain is "customer-support-help.co", NOT PayPal.',
        proTip: 'Bookmark your important banking, email, and tax portals and navigate ONLY via bookmarks or official apps.'
      },
      {
        stepNumber: 4,
        title: 'Configure Protective DNS Filtering',
        timing: 'Within 7 Days',
        description: 'Set your browser or router DNS to a threat-blocking provider such as Quad9 (9.9.9.9) or Cloudflare for Families (1.1.1.2).',
        actionableDetail: 'Browser Settings > Security > Use Secure DNS > Custom > Enter "https://dns.quad9.net/dns-query".'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Clicking the top "Sponsored Ad" links in Google/Bing search results for financial or login queries.',
        whyItsDangerous: 'Scammers pay for search ads to bypass SEO ranking and place deceptive phishing links at the very top of results.',
        betterAlternative: 'Scroll past sponsored ads to organic results, or type the known domain directly into the address bar.'
      },
      {
        mistake: 'Assuming the padlock icon means a website is safe or official.',
        whyItsDangerous: 'Over 90% of phishing websites use free automated SSL certificates and display the padlock.',
        betterAlternative: 'Verify the domain name spelling, not just the presence of the padlock.'
      }
    ],
    quickChecklist: [
      { id: 'brw-1', itemText: 'uBlock Origin or reputable ad/tracker blocker installed in web browser', priority: 'essential' },
      { id: 'brw-2', itemText: 'HTTPS-Only / Always Secure Connections mode enabled in browser settings', priority: 'essential' },
      { id: 'brw-3', itemText: 'Primary banking and email sites accessed via bookmarks rather than search results', priority: 'recommended' },
      { id: 'brw-4', itemText: 'Secure DNS (Quad9 or Cloudflare 1.1.1.2) enabled for automated malicious domain blocking', priority: 'recommended' },
      { id: 'brw-5', itemText: 'Browser pop-ups and automatic download permissions restricted', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If you entered credentials on a deceptive website, immediately open a clean browser tab and navigate to the legitimate service.',
        'Change your password immediately and choose "Log out all sessions".'
      ],
      containmentSteps: [
        'If a file was automatically downloaded, do NOT open or execute it. Delete it immediately and empty your trash.',
        'Clear browser cookies and cached site data for the last 24 hours.'
      ],
      recoverySteps: [
        'Report the fraudulent URL to Google Safe Browsing (safebrowsing.google.com) and Microsoft SmartScreen.',
        'Monitor accounts for unexpected login alerts or MFA push requests.'
      ]
    },
    relatedChecklistIds: ['secure-dns-filtering']
  },

  // 7. EMAIL SAFETY
  {
    id: 'methodology-email',
    areaId: 'email-safety',
    title: 'Email Safety & Phishing Neutralization',
    category: 'communications',
    tagline: 'Detect deceptive sender headers, inspect suspicious attachments, and neutralize social engineering traps.',
    iconName: 'MailWarning',
    whatShouldIDo: 'Treat unsolicited urgent emails with skepticism; inspect sender email addresses; never click unverified verification links or open unsolicited invoices.',
    howShouldIDoIt: 'Expand the sender details to check the actual domain; hover over links to preview destination URLs; use independent communication channels to verify requests.',
    whenShouldIDoIt: 'Practice on every incoming email that creates urgency, demands money, claims account suspension, or includes an attachment.',
    whyDoesItMatter: 'Email remains the #1 delivery vehicle for ransomware, business email compromise, and credential phishing worldwide.',
    risk: {
      summary: 'Spear-phishing, spoofed sender domains, malicious macro attachments (PDF/ZIP/Office), and extortion threats.',
      threatActors: ['State-sponsored actors', 'Ransomware syndicates', 'Gift-card scam networks', 'CEO fraudsters'],
      potentialImpact: 'System ransomware infection, account credential harvesting, wire fraud, and personal blackmail.',
      realWorldScenario: 'An employee receives an email titled "Urgent: Unpaid Invoice - Final Notice" from "billing@vendor-update.net" with a ZIP attachment. Opening the file executes malware that encrypts all files on their laptop.'
    },
    whyItMattersDetail: [
      'Email protocols were created in the 1980s without inherent cryptographic authentication; display names can be easily faked.',
      'Attackers use psychological triggers (panic, authority, curiosity) to short-circuit analytical thinking.',
      'A single click on an weaponized attachment can install hidden command-and-control software.'
    ],
    recommendedPractice: {
      headline: 'The SLAM Email Inspection Framework',
      goldenRule: 'Check Sender, Links, Attachments, and Message tone (SLAM) before taking any action.',
      standardsReference: 'CISA Phishing Awareness & Prevention / NIST SP 800-177'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Inspect the Genuine Sender Domain (Beyond Display Name)',
        timing: 'Immediate Check',
        description: 'Look past the friendly display name (e.g. "Netflix Support") and click to reveal the actual email address.',
        actionableDetail: 'If the display name says "Netflix" but the address is "service@customer-help-3829.ru", it is 100% fraudulent.',
        proTip: 'Look for subtle letter replacements (e.g., "rn" instead of "m", or "paypa1.com").'
      },
      {
        stepNumber: 2,
        title: 'Hover to Inspect Destination URLs Before Clicking',
        timing: 'Every Link',
        description: 'Never click a link blindly. Hover your mouse over the text or long-press on mobile to view the true destination.',
        actionableDetail: 'If the text says "Click here to verify your account" and points to an unfamiliar or shortened URL, do NOT click.',
        proTip: 'On touch devices, long-press a link to open the preview card showing the actual full URL.'
      },
      {
        stepNumber: 3,
        title: 'Treat Unsolicited Attachments as Radioactive',
        timing: 'Always',
        description: 'Never open unexpected attachments, especially .zip, .iso, .exe, .scr, or macro-enabled documents (.docm, .xlsm).',
        actionableDetail: 'Legitimate organizations (banks, streaming services) will rarely send unexpected zip archives or request you "Enable Macros".',
        proTip: 'If unsure, upload the file to VirusTotal.com for scanning by 70+ antivirus engines before opening.'
      },
      {
        stepNumber: 4,
        title: 'Verify Urgent Requests Through an Out-of-Band Channel',
        timing: 'When Urgency Strikes',
        description: 'If an email claims your account is locked, your card is charged $800, or a colleague needs urgent gift cards, PAUSE.',
        actionableDetail: 'Contact the person or company via a known, trusted phone number or open their official app independently.',
        proTip: 'Never reply directly to the suspicious email or call the phone number printed inside it.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Replying to spam or scam emails with "UNSUBSCRIBE" or angry replies.',
        whyItsDangerous: 'Replying confirms to spammers that your email address is active, causing your inbox to be flooded with 10x more attacks.',
        betterAlternative: 'Mark the message as "Spam / Phishing" and delete it without replying.'
      },
      {
        mistake: 'Trusting an email simply because it contains your name, old password, or home address.',
        whyItsDangerous: 'Data broker leaks expose millions of names and passwords; scammers merge this data into mass-mailed extortion scripts.',
        betterAlternative: 'Recognize this as automated fear-mongering and delete it immediately.'
      }
    ],
    quickChecklist: [
      { id: 'em-1', itemText: 'Sender email domain verified beyond the friendly display name', priority: 'essential' },
      { id: 'em-2', itemText: 'Links hovered and inspected for destination accuracy before clicking', priority: 'essential' },
      { id: 'em-3', itemText: 'Never enable macros on downloaded documents from external sources', priority: 'essential' },
      { id: 'em-4', itemText: 'Urgent requests independently confirmed via a second communication channel', priority: 'recommended' },
      { id: 'em-5', itemText: 'Spam and phishing reporting buttons utilized to train email filters', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If you clicked a suspicious link and typed your password, change that password immediately from an unaffected device.',
        'If you downloaded and opened an attachment, disconnect your computer from the internet (unplug ethernet / turn off Wi-Fi).'
      ],
      containmentSteps: [
        'Run a full system antimalware scan immediately.',
        'Review your email account settings for unauthorized forwarding rules or auto-reply filters (attackers use these to hide alerts).'
      ],
      recoverySteps: [
        'Revoke active sessions and check sent items for outbound phishing sent to your contacts.',
        'Alert IT / Security team if the email occurred on a work or academic account.'
      ]
    },
    relatedChecklistIds: ['mfa-primary-email', 'password-manager-unique-passwords']
  },

  // 8. SOCIAL MEDIA SAFETY
  {
    id: 'methodology-social-media',
    areaId: 'social-media',
    title: 'Social Media Hygiene & Oversharing Defense',
    category: 'social',
    tagline: 'Lock down profile privacy, eliminate oversharing vectors, and neutralize social-engineering impersonators.',
    iconName: 'Users',
    whatShouldIDo: 'Make personal profiles private, restrict audience visibility to approved friends/family, remove public contact information, and reject unsolicited friend requests.',
    howShouldIDoIt: 'Review Instagram, Facebook, and LinkedIn Privacy Settings; unlist phone/email from search; avoid posting boarding passes, real-time travel locations, or work ID badges.',
    whenShouldIDoIt: 'Conduct a privacy scrub every 6 months; pause before posting real-time vacation updates or identifiable personal milestones.',
    whyDoesItMatter: 'Attackers harvest public birthdays, family trees, pet names, and vacation dates to craft convincing spear-phishing attacks, answer security questions, or execute home burglaries.',
    risk: {
      summary: 'Open-Source Intelligence (OSINT) harvesting, account cloning, spear-phishing pretexts, and physical stalking/burglary.',
      threatActors: ['Doxxers', 'Social engineering scammers', 'Physical burglars', 'Identity impersonators'],
      potentialImpact: 'Cloned profiles tricking your friends for money, doxxing, targeted phone scams, and security question compromise.',
      realWorldScenario: 'A user posts a photo of their airline boarding pass on Instagram. A scammer scans the barcode from the photo, extracts the passenger record locator (PNR), cancels their return flight, and changes frequent flyer account details.'
    },
    whyItMattersDetail: [
      'Boarding passes, event tickets, and vehicle license plates contain encoded barcodes with sensitive identity and reservation data.',
      'Posting real-time vacation photos broadcasts to the world that your home is currently unoccupied.',
      'Scammers clone accounts using public profile pictures and message friends asking for emergency cash or gift cards.'
    ],
    recommendedPractice: {
      headline: 'The Principle of Least Sharing',
      goldenRule: 'If you wouldn’t tape it to the front door of your home, do not post it publicly online.',
      standardsReference: 'NIST Privacy Framework / CISA Social Media Best Practices'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Switch Profiles to Private / Friends Only',
        timing: 'Immediate (10 minutes)',
        description: 'Ensure your posts, followers list, and stories are visible only to people you personally know and have manually approved.',
        actionableDetail: 'Instagram: Settings > Account Privacy > Private Account. Facebook: Settings & Privacy > Privacy Checkup > "Who can see what you share".',
        proTip: 'LinkedIn: Hide your connections list and remove your personal phone number from public profile view.'
      },
      {
        stepNumber: 2,
        title: 'Eradicate Critical PII from Public View',
        timing: 'Day 1',
        description: 'Remove your full date of birth, home address, personal phone number, and mother’s maiden name from public bios.',
        actionableDetail: 'Change birth date visibility on Facebook to "Only Me" (show month and day if desired, never birth year).',
        proTip: 'Never answer viral social questionnaires like "Your first concert + your pet’s name is your rockstar name!"—these are security question mining traps.'
      },
      {
        stepNumber: 3,
        title: 'Delay Vacation and Real-Time Location Posts',
        timing: 'Habit Formation',
        description: 'Post trip photos and check-ins AFTER you return home, not while you are away.',
        actionableDetail: 'Disable precise geotagging in your camera app settings so GPS coordinates are not embedded in photo metadata.',
        proTip: 'Avoid posting photos of apartment keys, diplomas with student IDs, or office badges with visible employee barcodes.'
      },
      {
        stepNumber: 4,
        title: 'Audit Third-Party Connected Apps and Logins',
        timing: 'Quarterly',
        description: 'Review "Apps and Websites" authorized to log in via your Google, Facebook, or Apple account.',
        actionableDetail: 'Revoke permissions from old mobile games, online quizzes, and defunct services.',
        proTip: 'Many third-party apps maintain permanent read access to your friends list and email until manually revoked.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Accepting friend requests from people you are already connected with without verifying.',
        whyItsDangerous: 'Scammers clone legitimate profiles to message friends asking for emergency transfers or crypto schemes.',
        betterAlternative: 'Call or message the real person through an existing verified channel to confirm if their account was actually hacked.'
      },
      {
        mistake: 'Posting photos of boarding passes, concert tickets, or vaccination cards.',
        whyItsDangerous: 'Barcodes and 2D QR codes reveal full names, booking confirmation codes, passport info, and payment card details.',
        betterAlternative: 'Keep travel documents completely offline and out of sight.'
      }
    ],
    quickChecklist: [
      { id: 'soc-1', itemText: 'Social media profile visibility set to Private / Friends Only', priority: 'essential' },
      { id: 'soc-2', itemText: 'Full birth year, personal phone, and home address removed from public profiles', priority: 'essential' },
      { id: 'soc-3', itemText: 'MFA enabled on all social accounts (Instagram, LinkedIn, Facebook, X, TikTok)', priority: 'essential' },
      { id: 'soc-4', itemText: 'Camera geotagging turned off for public uploads; vacation photos posted after return', priority: 'recommended' },
      { id: 'soc-5', itemText: 'Third-party authorized apps audited and unused apps disconnected', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If your account is cloned, report the imposter profile directly to the platform using the official "Report Fake Account" tool.',
        'Post a warning story/status on your real profile alerting friends: "Ignore any messages or friend requests asking for money—my profile was cloned."'
      ],
      containmentSteps: [
        'If your account was hacked, navigate to the platform’s dedicated compromised account recovery portal (e.g. instagram.com/hacked).',
        'Verify that your recovery email and phone number were not changed by the attacker.'
      ],
      recoverySteps: [
        'Once access is regained, immediately change password, revoke all active sessions, and activate an authenticator app.',
        'Warn any friends who received scam links from your account while compromised.'
      ]
    },
    relatedChecklistIds: ['social-media-privacy-scrub', 'app-permissions-audit']
  },

  // 9. PUBLIC WI-FI
  {
    id: 'methodology-public-wifi',
    areaId: 'public-wifi',
    title: 'Public Wi-Fi & Untrusted Network Security',
    category: 'network',
    tagline: 'Shield data from packet sniffing, Evil Twin rogue access points, and insecure wireless hotspots.',
    iconName: 'Wifi',
    whatShouldIDo: 'Avoid accessing sensitive accounts on public Wi-Fi; use cellular data hotspots or an audited VPN; disable automatic Wi-Fi joining.',
    howShouldIDoIt: 'Turn off "Auto-Join Wi-Fi Networks"; connect via phone hotspot for banking; activate a trusted VPN (ProtonVPN, Mullvad); verify HTTPS.',
    whenShouldIDoIt: 'Whenever connecting at airports, cafés, hotels, public transit, conferences, or open municipal networks.',
    whyDoesItMatter: 'Attackers can set up cheap $15 rogue hotspots ("Evil Twin") with identical names (e.g. "Starbucks_Guest") to intercept your network traffic and route you to fake sites.',
    risk: {
      summary: 'Man-in-the-Middle (MitM) attacks, Evil Twin access points, packet eavesdropping, and malicious captive portal redirects.',
      threatActors: ['Opportunistic local hackers', 'Wi-Fi rogue access point operators', 'Public surveillance networks'],
      potentialImpact: 'Unencrypted credential interception, cookie theft, session hijacking, and forced malware updates.',
      realWorldScenario: 'A traveller at an airport connects to an open Wi-Fi network named "Airport_Free_WiFi". The network is operated by a hacker sitting nearby with a Wi-Fi Pineapple device, intercepting unencrypted DNS requests and redirecting them to a fake portal.'
    },
    whyItMattersDetail: [
      'Anyone in the room can set up a Wi-Fi hotspot with any SSID name they choose; your device cannot distinguish between the real café router and an attacker’s laptop.',
      'Unencrypted or poorly configured networks allow eavesdroppers on the same subnet to monitor connected device IP addresses and probe open ports.',
      'Captive login portals often demand personal emails or social logins, which can be harvested for spam or tracking.'
    ],
    recommendedPractice: {
      headline: 'Cellular First, Trusted VPN Second',
      goldenRule: 'Treat every network you do not personally administer as hostile and untrusted.',
      standardsReference: 'NIST SP 800-48 Guide to Securing Wireless Networks'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Disable Automatic Connection to Open Networks',
        timing: 'Immediate (2 minutes)',
        description: 'Prevent your phone and laptop from automatically associating with any open Wi-Fi network without your permission.',
        actionableDetail: 'iOS: Settings > Wi-Fi > Ask to Join Networks > Set to "Ask" or "Off". Turn off "Auto-Join Hotspots". Android: Settings > Network > Wi-Fi Preferences > Turn off "Connect to public networks".',
        proTip: 'Forget saved public networks after leaving a hotel or airport so your device stops broadcasting probe requests.'
      },
      {
        stepNumber: 2,
        title: 'Prioritize Personal Mobile Cellular Hotspots',
        timing: 'For Sensitive Work',
        description: 'For banking, tax filing, or entering passwords, use your smartphone’s 4G/5G cellular hotspot instead of public Wi-Fi.',
        actionableDetail: 'Cellular data is heavily encrypted over the air and immune to local Wi-Fi eavesdroppers.',
        proTip: 'Ensure your personal hotspot has a strong WPA3 passphrase.'
      },
      {
        stepNumber: 3,
        title: 'Use an Audited, Independently Verified VPN',
        timing: 'When Public Wi-Fi is Unavoidable',
        description: 'Route all device traffic through an encrypted tunnel using a trusted, no-logs VPN provider (such as ProtonVPN or Mullvad).',
        actionableDetail: 'Enable the VPN’s "Kill Switch" feature so traffic halts immediately if the VPN tunnel drops.',
        proTip: 'Avoid sketchy "100% Free VPN" mobile apps—they monetize by injecting advertisements and selling your browsing logs.'
      },
      {
        stepNumber: 4,
        title: 'Turn Off File Sharing and AirDrop Visibility',
        timing: 'On Laptops & Phones',
        description: 'Set network profile to "Public" on Windows, which disables local network discovery and printer sharing.',
        actionableDetail: 'macOS: System Settings > General > Sharing > Turn off file sharing. Set AirDrop to "Contacts Only" or "Receiving Off".'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Entering passwords or checking bank balances on open, unencrypted coffee shop Wi-Fi without a VPN.',
        whyItsDangerous: 'Nearby attackers running network sniffers can capture device hostnames, unencrypted traffic, and DNS queries.',
        betterAlternative: 'Switch to mobile cellular data or connect via an encrypted VPN.'
      },
      {
        mistake: 'Clicking "Accept certificate error" or "Ignore warning" on a public network.',
        whyItsDangerous: 'This warning frequently indicates an active Man-in-the-Middle proxy intercepting your SSL connection.',
        betterAlternative: 'Immediately disconnect from the network if a security certificate warning appears.'
      }
    ],
    quickChecklist: [
      { id: 'wifi-1', itemText: 'Auto-join open networks disabled on mobile phone and laptop', priority: 'essential' },
      { id: 'wifi-2', itemText: 'Cellular hotspot used for banking, shopping, and password management', priority: 'essential' },
      { id: 'wifi-3', itemText: 'Audited, trustworthy VPN active when using airport or hotel Wi-Fi', priority: 'recommended' },
      { id: 'wifi-4', itemText: 'Windows network profile set to "Public" (file & printer sharing blocked)', priority: 'recommended' },
      { id: 'wifi-5', itemText: 'AirDrop / Nearby Share set to "Contacts Only" or "Off" in public venues', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If a security warning pops up claiming an invalid certificate, disconnect from Wi-Fi immediately.',
        'Turn off Wi-Fi and forget the network in your device settings.'
      ],
      containmentSteps: [
        'Check whether any credentials were submitted during that browsing session; if so, change them over cellular data.',
        'Run an endpoint malware scan if an unexpected file was downloaded or a prompt requested a "network configuration profile".'
      ],
      recoverySteps: [
        'Inspect your device installed configuration profiles (Settings > VPN & Device Management) and remove any unknown profiles.',
        'Report rogue network access points to hotel or venue management.'
      ]
    },
    relatedChecklistIds: ['trusted-vpn-public-wifi']
  },

  // 10. ONLINE SHOPPING
  {
    id: 'methodology-shopping',
    areaId: 'online-shopping',
    title: 'Secure Online Shopping & Merchant Defense',
    category: 'financial',
    tagline: 'Defend credit cards against digital card skimming (Magecart), fraudulent storefronts, and unauthorized recurring charges.',
    iconName: 'ShoppingBag',
    whatShouldIDo: 'Use virtual credit card numbers or tokenized payment systems (Apple Pay, Google Pay); verify seller legitimacy; avoid debit cards for online purchases.',
    howShouldIDoIt: 'Generate single-use virtual cards (via Privacy.com or bank apps); pay via Apple/Google Pay; check domain age on whois; avoid too-good-to-be-true ads.',
    whenShouldIDoIt: 'Every time you buy online, particularly on new, unfamiliar, or niche merchant websites.',
    whyDoesItMatter: 'Debit cards draw directly from your checking account; if compromised, your real cash is gone until a lengthy bank dispute resolves.',
    risk: {
      summary: 'Digital skimming (Magecart scripts), fraudulent lookalike web shops, non-delivery scams, and recurring hidden subscriptions.',
      threatActors: ['Magecart skimmer groups', 'Counterfeit e-commerce syndicates', 'Rogue ad networks'],
      potentialImpact: 'Direct financial drain, fraudulent credit card charges, identity theft, and counterfeit or non-existent merchandise.',
      realWorldScenario: 'A consumer finds a $300 designer jacket advertised on social media for $39.99 on a site called "brand-clearance-outlet-store.xyz". They type their debit card number; the jacket never arrives and their card is charged $450 in fraudulent international transactions.'
    },
    whyItMattersDetail: [
      'Tokenized payment systems (Apple Pay / Google Pay) send dynamic one-time cryptographic tokens—merchants never see your real card number.',
      'Credit cards offer strong consumer protections and zero-liability fraud guarantees, whereas debit card theft directly freezes your living expenses.',
      'Small, unpatched e-commerce sites are frequently infected with covert JavaScript code that secretly copies credit card numbers as you type them.'
    ],
    recommendedPractice: {
      headline: 'Tokenized Payments & Virtual Numbers Only',
      goldenRule: 'Never type a raw debit card number into a web checkout form—use Apple Pay, Google Pay, or a virtual card.',
      standardsReference: 'FTC Consumer Protection Online Shopping Standards / PCI DSS Consumer Guidelines'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Use Virtual Cards or Digital Wallets (Apple Pay / Google Pay)',
        timing: 'Every Transaction',
        description: 'Choose digital wallets or bank-generated virtual credit card numbers rather than typing physical card numbers.',
        actionableDetail: 'Virtual card numbers can be locked to a single merchant and set with a strict maximum spend limit (e.g. $50).',
        proTip: 'If a compromised merchant suffers a data breach, the leaked virtual card cannot be used anywhere else.'
      },
      {
        stepNumber: 2,
        title: 'Favor Credit Cards Over Debit Cards for Web Purchases',
        timing: 'Always',
        description: 'Debit cards lack the statutory chargeback and zero-liability protections provided by credit cards.',
        actionableDetail: 'With a credit card, disputed fraudulent transactions are the bank’s money while under review, not your actual checking balance.',
        proTip: 'Keep a low-limit credit card designated exclusively for online shopping.'
      },
      {
        stepNumber: 3,
        title: 'Vet New and Unfamiliar Merchants Thoroughly',
        timing: 'Before Entering Payment',
        description: 'Check domain registration date, physical address, and independent reviews (Trustpilot, Better Business Bureau).',
        actionableDetail: 'If an e-commerce site was registered 3 weeks ago and only accepts wire transfers, crypto, or gift cards, it is a scam.',
        proTip: 'Legitimate e-commerce merchants always provide standard payment gateways, clear refund policies, and real contact information.'
      },
      {
        stepNumber: 4,
        title: 'Checkout as Guest Whenever Feasible',
        timing: 'During Checkout',
        description: 'Avoid creating a permanent account or saving credit card details on storefronts you visit only once.',
        actionableDetail: 'Choose "Checkout as Guest" to reduce the number of databases holding your billing profile.',
        proTip: 'Uncheck "Save payment information for future purchases".'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Falling for 80-90% discount deals on social media ads for luxury products or electronics.',
        whyItsDangerous: 'These ads lead to throwaway fake e-commerce sites set up solely to harvest credit card details.',
        betterAlternative: 'If the price is too good to be true, it is guaranteed to be a counterfeit or scam.'
      },
      {
        mistake: 'Paying an online seller using non-reversible methods (Zelle, Wire Transfer, Crypto, or Gift Cards).',
        whyItsDangerous: 'These channels offer zero buyer protection; once sent, funds cannot be recovered or charged back.',
        betterAlternative: 'Use credit cards or buyer-protected payment platforms (PayPal Goods & Services).'
      }
    ],
    quickChecklist: [
      { id: 'shp-1', itemText: 'Raw debit card never typed into online merchant checkout forms', priority: 'essential' },
      { id: 'shp-2', itemText: 'Apple Pay, Google Pay, or virtual cards used for checkout', priority: 'essential' },
      { id: 'shp-3', itemText: 'New merchants audited for physical contact info, reviews, and domain age', priority: 'essential' },
      { id: 'shp-4', itemText: '"Save my card" unselected on casual or one-time shopping sites', priority: 'recommended' },
      { id: 'shp-5', itemText: 'Immediate SMS/push notifications enabled for all card transactions', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If you spot an unauthorized charge, call your card issuer immediately using the number on the back of your card.',
        'Request an immediate card freeze/cancellation and dispute the fraudulent charge.'
      ],
      containmentSteps: [
        'Change passwords for any accounts associated with the merchant or shopping portal.',
        'Review recent transactions across all other cards to ensure no broader exposure.'
      ],
      recoverySteps: [
        'The bank will issue a replacement card with a new CVV and number.',
        'File an online complaint with the FTC (reportfraud.ftc.gov) or National Consumer Helpline.'
      ]
    },
    relatedChecklistIds: ['credit-freeze']
  },

  // 11. FINANCIAL SAFETY
  {
    id: 'methodology-financial',
    areaId: 'financial-safety',
    title: 'Financial Safety, Banking & Payment Hygiene',
    category: 'financial',
    tagline: 'Shield bank accounts, UPI transactions, credit files, and payment rails from unauthorized debits and social engineering.',
    iconName: 'CreditCard',
    whatShouldIDo: 'Enforce real-time transaction alerts, never enter a UPI PIN to receive money, place a freeze on credit bureau files, and monitor accounts weekly.',
    howShouldIDoIt: 'Enable push/SMS alerts for transactions > $1/₹1; freeze credit at Experian, Equifax, TransUnion; remember the Golden Rule of UPI (PIN is ONLY for sending).',
    whenShouldIDoIt: 'Set up alerts and credit freeze once; audit bank transactions weekly; apply the PIN rule every time you interact with payment apps.',
    whyDoesItMatter: 'Financial fraud drains life savings instantaneously; rapid detection within 24 hours dramatically increases the odds of fund recovery.',
    risk: {
      summary: 'UPI collect-request fraud, unauthorized debit card charges, loan identity theft, and bank impersonation scams.',
      threatActors: ['UPI scam syndicates', 'Identity theft rings', 'Fake bank representative callers'],
      potentialImpact: 'Empty bank balances, damaged credit scores, unauthorized loans in your name, and legal disputes.',
      realWorldScenario: 'A victim selling a sofa on OLX is sent a QR code by a "buyer" who claims "Scan this QR code and enter your UPI PIN to receive ₹15,000 advance payment." Scanning and entering the PIN transfers ₹15,000 OUT of the seller’s account.'
    },
    whyItMattersDetail: [
      'The Golden Rule of digital payments: You NEVER enter a PIN, password, or OTP to RECEIVE money.',
      'A credit freeze is free by law and stops anyone from opening loans, credit cards, or mortgages in your name even if your SSN/ID is leaked.',
      'Real-time alerts notify you within seconds of unauthorized activity, allowing you to freeze the card before secondary charges occur.'
    ],
    recommendedPractice: {
      headline: 'The Zero-Trust Financial Protocol',
      goldenRule: 'Entering a PIN always debits your account; banks never call asking for OTPs or remote access tools.',
      standardsReference: 'RBI Digital Payment Security Guidelines / FTC Credit Protection Rules'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Memorize the Fundamental UPI / Payment Golden Rule',
        timing: 'Fundamental Habit',
        description: 'Receiving money NEVER requires entering your UPI PIN, scanning a QR code, or sharing an OTP.',
        actionableDetail: 'If anyone tells you to enter a PIN to "verify" or "claim" incoming funds, they are attempting theft.',
        proTip: 'QR codes are for MAKING payments, never for receiving them.'
      },
      {
        stepNumber: 2,
        title: 'Turn on Real-Time Alerts for Every Transaction',
        timing: 'Immediate (5 minutes)',
        description: 'Configure your bank and credit card apps to send instant push notifications and SMS for every charge.',
        actionableDetail: 'Set the notification threshold to the lowest possible amount ($1 / ₹1) so test charges by thieves trigger immediate alerts.',
        proTip: 'Criminals often test stolen cards with small charges like $0.50 before making thousand-dollar purchases.'
      },
      {
        stepNumber: 3,
        title: 'Freeze Your Credit Files with All Major Credit Bureaus',
        timing: 'Within 7 Days',
        description: 'Place a free security freeze on Experian, TransUnion, and Equifax credit files.',
        actionableDetail: 'A freeze blocks lenders from pulling your credit report, making it impossible for identity thieves to open fraudulent loans.',
        proTip: 'You can unfreeze temporarily in 5 minutes via the bureau app when you actually want to apply for a loan.'
      },
      {
        stepNumber: 4,
        title: 'Never Share OTPs or Login Credentials Over the Phone',
        timing: 'Always',
        description: 'Legitimate bank employees will NEVER call you and ask for your OTP, CVV, or NetBanking password.',
        actionableDetail: 'If a caller claims to be your bank fraud department, hang up and dial the official phone number printed on the back of your card.',
        proTip: 'Caller ID can be easily spoofed using VoIP software to show your bank’s real customer care number.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Believing a caller who says "Your account will be blocked in 2 hours unless you verify this OTP".',
        whyItsDangerous: 'This is the universal urgency script used by scammers to hijack accounts or authorize money transfers.',
        betterAlternative: 'Hang up immediately and call the official bank helpline directly.'
      },
      {
        mistake: 'Keeping your entire life savings in a checking account linked directly to a debit card and payment apps.',
        whyItsDangerous: 'If your phone or debit card is compromised, the entire balance is vulnerable.',
        betterAlternative: 'Keep operating funds in checking, and store savings in an unlinked high-yield savings or deposit account.'
      }
    ],
    quickChecklist: [
      { id: 'fin-1', itemText: 'Golden Rule memorized: Receiving money never requires entering a PIN or OTP', priority: 'essential' },
      { id: 'fin-2', itemText: 'Instant transaction SMS and app push alerts enabled for all cards and accounts', priority: 'essential' },
      { id: 'fin-3', itemText: 'Credit files frozen with major credit bureaus (Experian, Equifax, TransUnion)', priority: 'recommended' },
      { id: 'fin-4', itemText: 'Daily transaction limits lowered on payment apps and debit cards to cap exposure', priority: 'recommended' },
      { id: 'fin-5', itemText: 'Bank accounts reviewed weekly for unfamiliar micro-charges or subscriptions', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If you fell for a payment scam, call your bank’s 24/7 fraud helpline immediately to block the account and report the transaction.',
        'In India, call the National Cybercrime Helpline at 1930 immediately to freeze fraudulent money transfers across beneficiary banks.'
      ],
      containmentSteps: [
        'Block the compromised debit card, UPI ID, or NetBanking access via mobile app or phone banking.',
        'Take full screenshots of transaction IDs, phone numbers, and chat logs as evidence.'
      ],
      recoverySteps: [
        'File an official cyber fraud complaint at cybercrime.gov.in (India) or IC3.gov / reportfraud.ftc.gov (US).',
        'Submit the police acknowledgment receipt to your bank within 24-72 hours to support your liability dispute.'
      ]
    },
    relatedChecklistIds: ['credit-freeze']
  },

  // 12. PRIVACY
  {
    id: 'methodology-privacy',
    areaId: 'privacy',
    title: 'Data Privacy & Surveillance Minimization',
    category: 'privacy',
    tagline: 'Take back control over digital footprint, ad tracking, location surveillance, and commercial data brokers.',
    iconName: 'Eye',
    whatShouldIDo: 'Audit mobile app permissions (location, camera, microphone, contacts); use privacy-respecting search engines; opt out of commercial data broker registries.',
    howShouldIDoIt: 'Set location permission to "While Using App" (disable Precise Location); use DuckDuckGo or Brave Search; request data broker opt-outs; enable Global Privacy Control.',
    whenShouldIDoIt: 'Audit app permissions every 90 days; enforce privacy settings upon purchasing any new smart device.',
    whyDoesItMatter: 'Aggregated location and telemetry data is bought and sold by brokers, creating comprehensive behavioral dossiers that follow you everywhere.',
    risk: {
      summary: 'Data broker profiling, covert geolocation tracking, cross-site telemetry surveillance, and behavioral ad targeting.',
      threatActors: ['Commercial data brokers', 'Ad-tech surveillance aggregators', 'Malicious app developers'],
      potentialImpact: 'Doxxing, intrusive targeting, location tracking, and exposure of personal health or political affiliations in broker leaks.',
      realWorldScenario: 'A free flashlight app requests permissions for contacts, microphone, and precise background GPS. It sells this continuous location stream to an ad-tech broker that traces the user’s home, workplace, and medical clinic visits.'
    },
    whyItMattersDetail: [
      'Data brokers assemble profiles with thousands of data points on individual citizens without explicit informed consent.',
      'Apps often request permissions (e.g. contacts or microphone) that have nothing to do with their stated functionality.',
      'Limiting location tracking prevents stalking and protects your physical privacy.'
    ],
    recommendedPractice: {
      headline: 'The Principle of Data Minimization',
      goldenRule: 'Grant apps only the absolute minimum permissions required for them to function, and revoke them when not in use.',
      standardsReference: 'NIST Privacy Framework (Version 1.0) / GDPR Article 5 Principles'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Conduct an App Permission Audit on Your Phone',
        timing: 'Immediate (10 minutes)',
        description: 'Review which applications have access to your Camera, Microphone, Contacts, and Location.',
        actionableDetail: 'iOS: Settings > Privacy & Security. Android: Settings > Privacy > Permission Manager. Revoke access from games, calculators, and shopping apps.',
        proTip: 'For maps and ride apps, select "While Using the App" and disable "Precise Location" when approximate city is sufficient.'
      },
      {
        stepNumber: 2,
        title: 'Opt Out of Major Commercial Data Brokers',
        timing: 'Within 30 Days',
        description: 'Submit opt-out requests to people-search aggregators (Whitepages, Spokeo, Radaris, LexisNexis).',
        actionableDetail: 'Use free opt-out guides (like DeleteMe DIY guides or opt-out forms) to remove your address, phone, and relatives from public lookups.',
        proTip: 'In jurisdictions with privacy laws (California CCPA, EU GDPR), exercise your legal "Right to Delete".'
      },
      {
        stepNumber: 3,
        title: 'Adopt Privacy-Focused Default Tools',
        timing: 'Next 7 Days',
        description: 'Switch default search engine from tracking-heavy engines to DuckDuckGo, Brave Search, or Startpage.',
        actionableDetail: 'Turn on "Global Privacy Control" (GPC) in your browser settings to automatically signal your opt-out from data sales.',
        proTip: 'Use Firefox or Brave as your daily browser with tracking protection set to "Strict".'
      },
      {
        stepNumber: 4,
        title: 'Review Smart Home Device Mic and Camera Settings',
        timing: 'Quarterly',
        description: 'Mute microphones on smart speakers (Echo, Nest) when not in active use and disable voice recording history retention.',
        actionableDetail: 'Disable "Send voice recordings to improve services" in Google Assistant / Alexa account settings.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Tapping "Allow" on every permission prompt when installing a new game or utility.',
        whyItsDangerous: 'Free apps frequently bundle third-party tracking SDKs to monetize user data.',
        betterAlternative: 'Always deny permissions first. If the app genuinely requires the camera (e.g. scanner), grant permission only for that session.'
      },
      {
        mistake: 'Believing browser "Incognito / Private" mode hides your activity from websites or your ISP.',
        whyItsDangerous: 'Incognito only stops saving cookies and history on your local machine; websites, ISPs, and network admins still see your full traffic.',
        betterAlternative: 'Use a trustworthy VPN and protective DNS alongside private browsing.'
      }
    ],
    quickChecklist: [
      { id: 'prv-1', itemText: 'Smartphone app permissions audited; microphone/camera revoked for non-essential apps', priority: 'essential' },
      { id: 'prv-2', itemText: 'Location tracking restricted to "While Using App" with precise location disabled where possible', priority: 'essential' },
      { id: 'prv-3', itemText: 'Browser tracking protection set to Strict; Global Privacy Control (GPC) enabled', priority: 'recommended' },
      { id: 'prv-4', itemText: 'Personal information removed from major people-search data broker directories', priority: 'recommended' },
      { id: 'prv-5', itemText: 'Smart speaker voice history retention turned off or auto-deleted after 3 months', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If personal contact details or private photos are leaked publicly on a site, submit an immediate DMCA/takedown request to the hosting provider.',
        'Request Google remove personally identifiable information (PII) from search results using the official removal form (g.co/removename).'
      ],
      containmentSteps: [
        'Change passwords for any accounts associated with the exposed email address.',
        'Audit social media accounts and tighten all privacy settings to completely private.'
      ],
      recoverySteps: [
        'Consider enrolling in a continuous data-broker removal service or monitoring tool.',
        'File an official complaint with data protection authorities if a regulated company violated privacy laws.'
      ]
    },
    relatedChecklistIds: ['app-permissions-audit', 'three-two-one-backups']
  },

  // 13. SCAM PREVENTION
  {
    id: 'methodology-scams',
    areaId: 'scam-prevention',
    title: 'Scam Detection & Social Engineering Defense',
    category: 'scams',
    tagline: 'Deconstruct psychological manipulation triggers, high-pressure pretexts, and fake authority figures.',
    iconName: 'AlertTriangle',
    whatShouldIDo: 'Implement a mandatory 10-minute pause whenever an urgent, high-emotion message arrives; verify claims through independent channels; never download remote access software.',
    howShouldIDoIt: 'Practice the STOP-CHECK-VERIFY-ACT mental reflex; hang up on cold callers claiming to be police, tax authorities, or tech support; establish a family emergency secret code word.',
    whenShouldIDoIt: 'Every single time you feel sudden panic, excitement, fear, or urgency driven by a phone call, SMS, or email.',
    whyDoesItMatter: 'Modern scams do not attack firewalls—they hack human psychology through fear, greed, authority, and manufactured panic.',
    risk: {
      summary: 'Digital arrest threats, courier package extortion, tech support remote hijack (AnyDesk/TeamViewer), and romance fraud.',
      threatActors: ['Organized call-center syndicates', 'Impersonation scam rings', 'Advance-fee fraud networks'],
      potentialImpact: 'Substantial financial loss, psychological distress, device compromise via remote access, and extortion.',
      realWorldScenario: 'A victim receives a call from an "officer" claiming their passport was found in a package of illegal drugs in another city. They are told to join a Skype call for a "digital arrest" and transfer their savings to an "RBI verification account".'
    },
    whyItMattersDetail: [
      'No law enforcement agency, court, or tax authority conducts "digital arrests" or demands money transfers over Skype/WhatsApp.',
      'Scammers rely on cognitive overload—making you act before your rational brain has time to analyze the absurdity of the claim.',
      'Installing remote access software (AnyDesk, TeamViewer) grants the attacker total control over your computer, screen, and keystrokes.'
    ],
    recommendedPractice: {
      headline: 'The STOP-CHECK-VERIFY Mental Firewall',
      goldenRule: 'Urgency is the fingerprint of a scam. The greater the pressure to act immediately, the higher the certainty of deception.',
      standardsReference: 'FTC Scam Defense Framework / CERT-In Cyber Hygiene Guidelines'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Apply the 10-Minute Emotional Pause Reflex',
        timing: 'Whenever Panicked',
        description: 'When someone claims your child is arrested, your bank account is frozen, or electricity will be cut in 1 hour, take a breath.',
        actionableDetail: 'Tell the caller: "I am in the middle of a meeting, I will call back." Hang up immediately. Legitimate emergencies do not prevent verification.',
        proTip: 'Scammers will threaten that hanging up will lead to immediate arrest—this is 100% proof that it is a scam.'
      },
      {
        stepNumber: 2,
        title: 'NEVER Download Remote Access Software on Request',
        timing: 'Absolute Rule',
        description: 'Never install AnyDesk, TeamViewer, QuickSupport, or RustDesk on the instruction of someone who called you.',
        actionableDetail: 'Scammers use remote access to black out your screen, access NetBanking, and drain funds while pretending to "fix your issue".',
        proTip: 'Tech support from Microsoft or Apple will never cold-call you out of the blue.'
      },
      {
        stepNumber: 3,
        title: 'Establish a Family Emergency Verification Code',
        timing: 'This Weekend (5 minutes)',
        description: 'Agree on a secret verbal code word with parents, children, and partners that only your family knows.',
        actionableDetail: 'With the rise of AI voice cloning, scammers clone a relative’s voice crying for bail money. The code word verifies their true identity immediately.',
        proTip: 'If they cannot provide the secret code word, hang up and dial their real phone number directly.'
      },
      {
        stepNumber: 4,
        title: 'Verify Authority Claims Independently',
        timing: 'Always',
        description: 'If someone claims to represent the police, customs, tax department, or electricity board, do NOT use their contact numbers.',
        actionableDetail: 'Look up the local police station or government agency website independently and call their verified public switchboard.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Believing video calls where callers wear fake police uniforms with logos.',
        whyItsDangerous: 'Criminal syndicates set up elaborate fake police station sets and wear realistic costumes to intimidate victims.',
        betterAlternative: 'Recognize that Indian Police, CBI, ED, and US FBI never interrogate or settle criminal cases via Skype or video calls.'
      },
      {
        mistake: 'Keeping the call secret because the scammer told you "This is a confidential national security investigation".',
        whyItsDangerous: 'Scammers isolate victims from family and friends so no one can point out the obvious red flags.',
        betterAlternative: 'Immediately speak to a trusted friend, family member, or local police officer before doing anything.'
      }
    ],
    quickChecklist: [
      { id: 'scm-1', itemText: 'Mandatory 10-minute pause reflex practiced for any urgent high-pressure demand', priority: 'essential' },
      { id: 'scm-2', itemText: 'Never install remote desktop software (AnyDesk, TeamViewer) from unsolicited calls', priority: 'essential' },
      { id: 'scm-3', itemText: 'Family emergency secret code word established with close relatives', priority: 'essential' },
      { id: 'scm-4', itemText: 'Recognize that police and tax agencies never demand money transfers over video calls', priority: 'essential' },
      { id: 'scm-5', itemText: 'Independent official phone directory used to verify any institutional claims', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If you shared sensitive banking information or transferred funds, contact your bank fraud department within 60 minutes.',
        'In India, call the 1930 Cyber Fraud Helpline immediately to attempt transaction interdiction.',
        'If you installed AnyDesk or TeamViewer, turn off Wi-Fi immediately and uninstall the application.'
      ],
      containmentSteps: [
        'Change all banking and email passwords from a different, clean device.',
        'Preserve all phone recordings, chat transcripts, payment slips, and caller phone numbers.'
      ],
      recoverySteps: [
        'File an official report on cybercrime.gov.in or reportfraud.ftc.gov.',
        'Do NOT pay any secondary "recovery specialists" who contact you on social media promising to get your money back—they are recovery scammers.'
      ]
    },
    relatedChecklistIds: ['fictional-security-questions']
  },

  // 14. PERSONAL INFORMATION PROTECTION
  {
    id: 'methodology-pii',
    areaId: 'pii-protection',
    title: 'Personal Identifiable Information (PII) Protection',
    category: 'privacy',
    tagline: 'Shield government IDs, Social Security/Aadhaar numbers, physical documents, and identity tokens.',
    iconName: 'Fingerprint',
    whatShouldIDo: 'Never share unmasked government IDs; shred physical identity documents; restrict sharing of national identification numbers; monitor credit for unauthorized inquiries.',
    howShouldIDoIt: 'Use Masked Aadhaar (where only last 4 digits show) or redacted ID copies with purpose watermarks; buy a cross-cut paper shredder; never store ID photos in unencrypted photo galleries.',
    whenShouldIDoIt: 'Whenever any hotel, gym, delivery agent, or service provider requests a copy of your government identity card.',
    whyDoesItMatter: 'Unmasked government ID cards are the holy grail for identity theft syndicates, used to open bank accounts, register SIM cards, and take out loans in your name.',
    risk: {
      summary: 'Synthetic identity theft, fraudulent SIM card registrations, unauthorized bank account opening, and extortion.',
      threatActors: ['Identity theft syndicates', 'Corrupt hotel/retail clerks', 'Unregulated micro-loan apps'],
      potentialImpact: 'Criminal records in your name, destruction of credit scores, loan debt collection harassment, and tax fraud.',
      realWorldScenario: 'A victim leaves a full unmasked photocopy of their driver’s license and passport at a hotel reception desk. An employee sells a digital photo of the document to an identity theft gang, who use it to open multiple fraudulent bank accounts and mobile phone lines.'
    },
    whyItMattersDetail: [
      'Once a high-resolution photo of your government ID is leaked, you cannot change your date of birth, photo, or national ID number easily.',
      'Scammers combine physical ID photos with leaked utility bills to bypass Know-Your-Customer (KYC) checks at financial institutions.',
      'Cross-cut shredding physical bills and bank statements prevents "dumpster diving" identity theft.'
    ],
    recommendedPractice: {
      headline: 'Watermark, Mask, and Shred',
      goldenRule: 'Whenever providing an ID photocopy, write a handwritten diagonal watermark with the exact date and specific purpose.',
      standardsReference: 'UIDAI Masked Aadhaar Guidelines / FTC Identity Theft Prevention Standards'
    },
    stepByStepMethod: [
      {
        stepNumber: 1,
        title: 'Use Masked Identity Documents Whenever Possible',
        timing: 'Every ID Request',
        description: 'In India, download and share only Masked Aadhaar (which shows only the last 4 digits and hides the first 8 digits).',
        actionableDetail: 'In the US/Europe, black out your full SSN / National Insurance number unless legally mandated for tax/banking reporting.',
        proTip: 'Masked Aadhaar is legally valid for all domestic verification purposes except government welfare programs.'
      },
      {
        stepNumber: 2,
        title: 'Apply a Handwritten Specific-Purpose Watermark',
        timing: 'Whenever Physical/Digital Copies Shared',
        description: 'Draw a diagonal line across any physical or digital copy of your ID and write: "Copy provided to [Hotel Name] solely for [Check-in] on [Date]."',
        actionableDetail: 'This renders the document completely useless if someone attempts to reuse it for opening bank accounts or buying SIM cards.',
        proTip: 'Never share clean, unwatermarked PDF or JPEG scans of your passport or ID.'
      },
      {
        stepNumber: 3,
        title: 'Secure or Delete ID Photos from Phone Camera Rolls',
        timing: 'Today (5 minutes)',
        description: 'Check your phone gallery for photos of your passport, driver’s license, credit cards, or tax forms.',
        actionableDetail: 'Move them into an encrypted vault (like Apple Notes Locked Note, Samsung Secure Folder, or Bitwarden) and delete them from the main gallery and cloud trash.',
        proTip: 'Many mobile apps request "All Photos" permissions and can upload document scans to their servers.'
      },
      {
        stepNumber: 4,
        title: 'Shred Physical Mail Containing Names and Addresses',
        timing: 'Weekly',
        description: 'Never discard medical bills, credit card solicitations, utility invoices, or package labels into the trash without destroying them.',
        actionableDetail: 'Use a cross-cut paper shredder or black out your address with an identity-theft roller stamp before recycling.',
        proTip: 'Peel off the shipping label from Amazon/delivery boxes before recycling cardboard.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Sending full unmasked photos of both sides of your ID card via WhatsApp or email to unverified agents.',
        whyItsDangerous: 'Unsecured messaging chats and unencrypted email servers leak documents permanently to unauthorized third parties.',
        betterAlternative: 'Share only watermarked, masked copies, or use official verification portals directly.'
      },
      {
        mistake: 'Throwing credit card receipts and pre-approved loan letters directly into home trash cans.',
        whyItsDangerous: 'Dumpster divers collect account numbers and addresses to initiate fraudulent mail redirects or account takeovers.',
        betterAlternative: 'Tear up or cross-cut shred all financial and identity mail.'
      }
    ],
    quickChecklist: [
      { id: 'pii-1', itemText: 'Masked IDs or redacted documents used for routine hotel/gym verifications', priority: 'essential' },
      { id: 'pii-2', itemText: 'Handwritten purpose watermark drawn across all shared ID photocopies and PDFs', priority: 'essential' },
      { id: 'pii-3', itemText: 'Raw photos of passports/IDs deleted from open phone camera roll and moved to secure vault', priority: 'essential' },
      { id: 'pii-4', itemText: 'Physical mail with personal addresses and financial numbers shredded before disposal', priority: 'recommended' },
      { id: 'pii-5', itemText: 'Shipping label addresses removed from delivery boxes before recycling', priority: 'recommended' }
    ],
    whatToDoIfSomethingGoesWrong: {
      immediateActions: [
        'If a full copy of your identity card is stolen, report it to the issuing authority immediately to flag the document as potentially compromised.',
        'Place a fraud alert and freeze with all credit bureaus.'
      ],
      containmentSteps: [
        'File an official police report for identity theft (this provides vital legal protection against future debts incurred in your name).',
        'In India, lock your Aadhaar biometrics using the official mAadhaar app or UIDAI portal.'
      ],
      recoverySteps: [
        'Regularly request your free annual credit report (annualcreditreport.com in US / CIBIL/Experian in India) to check for unauthorized accounts.',
        'Submit the police FIR to any bank where unauthorized accounts were opened.'
      ]
    },
    relatedChecklistIds: ['credit-freeze', 'fictional-security-questions']
  }
];
