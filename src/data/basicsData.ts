import { SafetyBasic } from '../types';

export const BASICS_DATA: SafetyBasic[] = [
  {
    id: 'passwords-passphrases',
    title: 'Strong Passwords & Passphrases',
    category: 'Authentication',
    iconName: 'Key',
    summary: 'Replace predictable passwords with memorable 4-word passphrases or long random combinations managed by a secure vault.',
    detail: 'Short passwords like "Password123!" or "Summer2023" can be cracked by standard brute-force graphics cards in seconds. Passphrases composed of four or five unrelated words (e.g. "velvet-dolphin-tractor-sunset") provide massive entropy (over 70 bits of cryptographic strength) while remaining effortless to type and recall.',
    checklist: [
      'Use at least 15+ characters for all important accounts',
      'Never reuse the same password across multiple websites',
      'Store complex credentials inside an encrypted password manager',
      'Avoid using personal facts like birth years, child names, or street addresses'
    ],
    commonPitfall: 'Changing just the last digit or exclamation mark when a service forces a password reset (e.g. Winter2022! to Winter2023!). Hackers anticipate this pattern instantly.',
    quickStat: 'Over 81% of data breaches involve weak, reused, or stolen passwords.'
  },
  {
    id: 'multi-factor-auth',
    title: 'Multi-Factor Authentication (MFA)',
    category: 'Authentication',
    iconName: 'ShieldCheck',
    summary: 'Add a crucial secondary layer of defense so stolen passwords alone cannot unlock your accounts.',
    detail: 'Multi-Factor Authentication requires two pieces of evidence before granting access: something you know (password) and something you have (an authenticator app or hardware key). Even if an attacker buys your password on the dark web, they cannot breach your account without your physical secondary token.',
    checklist: [
      'Enable MFA first on your primary email, banking, and password manager',
      'Prefer Authenticator apps (Google Authenticator, Aegis, Bitwarden) over SMS codes',
      'Save your one-time backup recovery codes in a secure, offline location',
      'Consider physical FIDO2 security keys (YubiKey) for high-value accounts'
    ],
    commonPitfall: 'Approving push notifications blindly on your phone ("MFA fatigue") without checking who is attempting to log in.',
    quickStat: 'MFA blocks up to 99.9% of automated account takeover attacks.'
  },
  {
    id: 'software-updates',
    title: 'Software & OS Updates',
    category: 'System Hardening',
    iconName: 'RefreshCw',
    summary: 'Apply security patches promptly to close known vulnerability doorways before attackers exploit them.',
    detail: 'Software vendors continuously fix newly discovered software flaws (CVEs). When an update is released, cybercriminals immediately reverse-engineer the patch to build exploits targeting users who have not updated yet. Delaying updates leaves your digital doors unlocked.',
    checklist: [
      'Turn on "Automatic Updates" for Windows, macOS, iOS, and Android',
      'Keep web browsers (Chrome, Firefox, Safari, Edge) updated to the latest build',
      'Update router firmware and home smart devices (IoT) at least twice a year',
      'Uninstall unused software and browser extensions you no longer need'
    ],
    commonPitfall: 'Clicking "Remind me tomorrow" repeatedly for weeks on system update prompts.',
    quickStat: 'Over 60% of corporate and consumer breaches involve a vulnerability for which a patch was already available.'
  },
  {
    id: 'recognizing-red-flags',
    title: 'Recognizing Social Engineering',
    category: 'Human Defense',
    iconName: 'Eye',
    summary: 'Cultivate healthy digital skepticism against high-pressure tactics, unexpected attachments, and emotional urgency.',
    detail: 'Scammers know that emotional panic short-circuits rational thought. Whenever a message creates intense panic, excitement, or fear (e.g., "Account suspended!", "IRS warrant!", "You won $10,000!"), stop and step back. The emotion itself is your number-one warning indicator.',
    checklist: [
      'Pause for at least 60 seconds before responding to any urgent digital communication',
      'Verify unexpected requests through an independent, pre-existing contact method',
      'Inspect sender email domains for subtle misspellings (e.g. netfIix.com with capital I)',
      'Never allow remote desktop access to someone who called you unsolicited'
    ],
    commonPitfall: 'Assuming that because a message includes your real name or last 4 digits of your card, it must be authentic. That data often comes from previous public breaches.',
    quickStat: '90% of successful cyberattacks begin with a human social engineering trick.'
  },
  {
    id: 'safe-browsing-https',
    title: 'Safe Browsing & HTTPS Security',
    category: 'Network & Web',
    iconName: 'Globe',
    summary: 'Verify website authenticity, look for padlock encryption, and avoid downloading files from suspicious sources.',
    detail: 'HTTPS encrypts the traffic between your web browser and the website, preventing eavesdroppers from intercepting passwords or credit card numbers. However, remember that HTTPS alone does not guarantee a website is legitimate—many modern phishing sites also use HTTPS certificates.',
    checklist: [
      'Check that the browser address bar displays "https://" and the lock icon',
      'Carefully inspect the full domain name before typing credentials or payment info',
      'Use a reputable ad-blocker and anti-tracker to filter malicious advertisements (malvertising)',
      'Never bypass browser security certificate warning screens'
    ],
    commonPitfall: 'Believing that an HTTPS padlock means a website is honest or safe. The lock only means connection encryption; scammers can put locks on fake stores too.',
    quickStat: 'Over 80% of phishing sites now use valid SSL/TLS certificates to appear legitimate.'
  },
  {
    id: 'data-backups',
    title: 'Data Backup Best Practices',
    category: 'Resilience',
    iconName: 'Database',
    summary: 'Ensure your critical files, tax documents, and cherished memories survive ransomware, hardware failure, or theft.',
    detail: 'The only foolproof recovery against ransomware is having intact, isolated backups that the malware could not reach. Follow the industry-standard 3-2-1 backup strategy: maintain three copies of your data, on two different media types, with at least one copy stored safely offsite or offline.',
    checklist: [
      'Backup primary files to an encrypted cloud storage service (Google Drive, iCloud, OneDrive, Backblaze)',
      'Keep an external hard drive backup and disconnect it when not actively backing up',
      'Test your backups twice a year by restoring a random folder to verify integrity',
      'Enable automated daily mobile photo and contact backups'
    ],
    commonPitfall: 'Leaving the backup external drive plugged into your PC 24/7. When ransomware hits, it will encrypt the backup drive too.',
    quickStat: '140,000 hard drives fail in the United States every week, and ransomware claims a new victim every 11 seconds.'
  },
  {
    id: 'secure-wifi-vpn',
    title: 'Secure Wi-Fi & VPN Protection',
    category: 'Network & Web',
    iconName: 'Wifi',
    summary: 'Protect your home router with WPA3 encryption and shield your network traffic on public networks.',
    detail: 'Your home router is the front door to every phone, computer, and smart appliance in your house. Default router administrative passwords (like "admin" / "password") leave you exposed to botnet infection. Outside the home, public Wi-Fi in airports or hotels should always be paired with a VPN or mobile cellular hotspot.',
    checklist: [
      'Change the default admin login and password on your home internet router',
      'Use WPA2-AES or WPA3 encryption with a robust wireless password',
      'Turn off WPS (Wi-Fi Protected Setup) and Remote Administration in router settings',
      'Use a reliable VPN or mobile cellular data when working on public Wi-Fi'
    ],
    commonPitfall: 'Naming your home Wi-Fi network with your apartment number or family name, which helps attackers target your physical residence.',
    quickStat: 'More than 25% of public Wi-Fi hotspots globally lack encryption.'
  },
  {
    id: 'device-locks-biometrics',
    title: 'Device Locks & Screen Security',
    category: 'Device Hardening',
    iconName: 'Fingerprint',
    summary: 'Guard physical access with biometric locks, alphanumeric PINs, and automated screen lock timeouts.',
    detail: 'If a smartphone or laptop is stolen or left unattended for three minutes, an attacker with physical access has full access to emails, notes, two-factor authenticator apps, and stored browser passwords. Robust device locks and full-disk encryption (BitLocker / FileVault) make the stolen hardware useless to thieves.',
    checklist: [
      'Set an alphanumeric PIN or strong biometric (Face ID / Fingerprint) on mobile devices',
      'Configure auto-lock timeout to 2 minutes or less on phones and laptops',
      'Enable Find My Device / remote wipe capabilities on all phones and laptops',
      'Enable full-disk encryption (FileVault on Mac, BitLocker on Windows)'
    ],
    commonPitfall: 'Using simple 4-digit PINs like "1234", "0000", or your birth year that anyone glancing over your shoulder can memorize.',
    quickStat: 'A 6-digit numeric PIN takes up to 24 hours to crack, while an 8-character alphanumeric passcode takes years.'
  },
  {
    id: 'privacy-app-permissions',
    title: 'Privacy Settings & App Permissions',
    category: 'Data Breach & Privacy',
    iconName: 'Sliders',
    summary: 'Audit app permissions to stop excessive tracking of your microphone, camera, contacts, and precise location.',
    detail: 'Free apps frequently monetize user data by harvesting location histories, contact lists, and device identifiers for data brokers and advertising networks. Regularly auditing and trimming permissions protects your personal sovereignty and battery life.',
    checklist: [
      'Set location permissions to "While Using App" or "Ask Every Time" rather than "Always Allow"',
      'Revoke microphone, camera, and contact permissions for apps that have no legitimate need for them',
      'Turn off personalized ad tracking and cross-app tracking in phone privacy settings',
      'Review social media privacy controls and set personal profiles to Private'
    ],
    commonPitfall: 'Tapping "Allow" on every permission request during initial app installation without reading the prompt.',
    quickStat: 'The average smartphone app shares data with an average of 10 third-party tracker companies.'
  },
  {
    id: 'social-media-discretion',
    title: 'Social Media & Oversharing Discretion',
    category: 'Human Defense',
    iconName: 'Share2',
    summary: 'Protect personal intelligence that criminals harvest to answer security questions or execute targeted social engineering.',
    detail: 'Casual posts revealing your mother’s maiden name, your first pet, your high school mascot, or vacation dates provide attackers with answers to account recovery security questions. Real-time vacation posts also broadcast to thieves that your home is currently unoccupied.',
    checklist: [
      'Never post photos of boarding passes, tickets with barcodes, keys, or official IDs',
      'Wait until you return home before posting travel albums and location check-ins',
      'Use bogus, randomized answers for "security questions" and store them in your password manager',
      'Filter your friend lists and purge strangers or inactive accounts'
    ],
    commonPitfall: 'Participating in viral social media questionnaire games ("Your royal name is your pet name + street you grew up on!"). These are data-mining operations for security questions.',
    quickStat: 'Over 78% of burglars admitted to checking social media to locate empty homes during vacations.'
  }
];
