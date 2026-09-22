import { PracticalMethodology, AttackScenario } from '../types';

export const PRACTICAL_METHODOLOGIES: PracticalMethodology[] = [
  {
    id: 'stop-check-verify-act',
    title: 'Universal Scam Defense Protocol',
    acronym: 'STOP → CHECK → VERIFY → ACT',
    shortTagline: 'The essential mental filter for any unexpected incoming message, call, or email.',
    category: 'Universal Communication',
    whenToUse: 'Whenever you receive an unsolicited message claiming urgent trouble, account suspension, legal threats, or unexpected financial gain.',
    whyItWorks: 'Attackers rely on emotional hijacking to provoke immediate action before your critical reasoning engages. Inserting a deliberate 60-second pause breaks the psychological trance.',
    relatedThreatIds: ['phishing', 'smishing-vishing', 'identity-theft'],
    steps: [
      {
        stepLabel: 'STOP',
        actionTitle: 'Step Back & Recognize Emotional Triggers',
        description: 'Do not click, tap, reply, or transfer money. Take a deep breath. Notice if the message is making you feel panicked, rushed, or overly excited.',
        practicalExample: 'Message says: "Your electricity connection will be cut off tonight at 9:30 PM due to unpaid bill. Call 98765-XXXXX immediately."',
        pitfallToAvoid: 'Rushing to call the number in the SMS because you fear the power being cut off.'
      },
      {
        stepLabel: 'CHECK',
        actionTitle: 'Inspect Technical Red Flags & Sender Headers',
        description: 'Look at the sender’s actual email address, phone number, spelling, grammar, and generic greetings. Search for lookalike characters or unofficial domain extensions.',
        practicalExample: 'Sender says "Electricity Dept", but the SMS came from a regular personal 10-digit mobile number instead of an authorized government alphanumeric header.',
        pitfallToAvoid: 'Trusting the caller ID name displayed on Truecaller or phone screen, which scammers easily spoof.'
      },
      {
        stepLabel: 'VERIFY',
        actionTitle: 'Contact the Organization Independently',
        description: 'Verify through an official, out-of-band channel that you find yourself (e.g. your printed bill, physical card, or official bookmarked app).',
        practicalExample: 'Open your official electricity utility app or check your last physical paper bill to see if any balance is genuinely pending.',
        pitfallToAvoid: 'Calling the phone number or tapping the web link provided inside the suspicious message.'
      },
      {
        stepLabel: 'ACT',
        actionTitle: 'Report & Securely Dismiss',
        description: 'Block the sender, report the message as spam/phishing to your carrier or provider, and alert family members who might receive the same pretext.',
        practicalExample: 'Forward the fraudulent SMS to 1909 / 7726 (SPAM) and delete it.',
        pitfallToAvoid: 'Replying with abusive language, which only confirms your number is active to scam call centers.'
      }
    ]
  },
  {
    id: 'inspect-hover-decode-decide',
    title: 'Suspicious Link Verification Protocol',
    acronym: 'INSPECT → HOVER → DECODE → DECIDE',
    shortTagline: 'Safely evaluate hyperlinks before clicking on computers and mobile devices.',
    category: 'Links & Fake Websites',
    whenToUse: 'Before clicking links in emails, text messages, social media posts, or search engine ads.',
    whyItWorks: 'Hyperlink text can say anything, but the underlying destination URL reveals the real server you are connecting to.',
    relatedThreatIds: ['phishing', 'fake-websites', 'malware'],
    steps: [
      {
        stepLabel: 'INSPECT',
        actionTitle: 'Examine Anchor Text vs Destination',
        description: 'Check whether the visible blue text says a trustworthy name (like www.google.com) while the real link points somewhere completely different.',
        practicalExample: 'A button reads "Update Netflix Payment", but the URL starts with "https://netflix-billing-portal.cc/login".',
        pitfallToAvoid: 'Assuming that because a brand name is written inside the message, the link belongs to that brand.'
      },
      {
        stepLabel: 'HOVER',
        actionTitle: 'Preview Destination Without Clicking',
        description: 'On desktop, hover your mouse cursor over the link to preview the target in the bottom-left browser status bar. On mobile, perform a long-press (tap and hold) to preview the destination URL.',
        practicalExample: 'Hovering over an email link reveals: "http://192.168.1.10/fake-login.php" instead of an official domain.',
        pitfallToAvoid: 'Tapping rapidly on touchscreens without inspecting the long-press preview preview dialog.'
      },
      {
        stepLabel: 'DECODE',
        actionTitle: 'Identify the Root Domain',
        description: 'Read the address from right to left before the first single slash (/). The characters immediately before that slash constitute the actual domain being contacted.',
        practicalExample: 'In "paypal.com.account-check.xyz/login", the root domain is NOT paypal.com; it is account-check.xyz.',
        pitfallToAvoid: 'Being fooled by legitimate brand names tucked into subdomains or path parameters.'
      },
      {
        stepLabel: 'DECIDE',
        actionTitle: 'Open Independently or Discard',
        description: 'If you need to access the service, open a clean browser tab, type the well-known web address manually, or use your saved bookmark.',
        practicalExample: 'Close the email tab. Open browser, navigate to paypal.com manually, and check notifications.',
        pitfallToAvoid: 'Using Google Search and clicking the top sponsored ad result, which can also be spoofed.'
      }
    ]
  },
  {
    id: 'pause-check-call-neverpay',
    title: 'Urgent Financial & UPI Defense',
    acronym: 'PAUSE → INDEPENDENT_CHECK → CALL_OFFICIAL → NEVER_PAY',
    shortTagline: 'Guaranteed protection against fraudulent payment requests, QR code tricks, and refund scams.',
    category: 'Financial Fraud & UPI',
    whenToUse: 'When anyone asks you to send money, approve a UPI request, scan a QR code, or enter your UPI PIN to "receive" funds.',
    whyItWorks: 'UPI architecture is mathematically simple: You NEVER need to enter your PIN or scan a QR code to receive money.',
    relatedThreatIds: ['upi-fraud', 'financial-fraud'],
    steps: [
      {
        stepLabel: 'PAUSE',
        actionTitle: 'Remember the Golden Rule of UPI',
        description: 'ENTERING A UPI PIN DEDUCTS MONEY FROM YOUR BANK. It is technically impossible to receive money by entering a UPI PIN.',
        practicalExample: 'Buyer on OLX says: "I sent you Rs. 5,000 for the sofa. Scan this QR code and enter your PIN to claim the money in your account."',
        pitfallToAvoid: 'Believing that scanning a QR code or entering a PIN can credit your account.'
      },
      {
        stepLabel: 'INDEPENDENT_CHECK',
        actionTitle: 'Verify Bank Passbook or Official App',
        description: 'Check your actual bank balance in your official banking app. Do not trust screenshots of transfer receipts sent by the buyer on WhatsApp.',
        practicalExample: 'Scammer sends a convincing graphic claiming "Payment Successful: Rs 15,000 transferred". Bank balance shows Rs. 0 change.',
        pitfallToAvoid: 'Accepting WhatsApp screenshots as proof of a successful financial wire.'
      },
      {
        stepLabel: 'CALL_OFFICIAL',
        actionTitle: 'Verify via Official Hotline If Panicked',
        description: 'If a caller claims your card is blocked or tax penalty is due, dial your bank’s official 24x7 customer care number printed on your physical card.',
        practicalExample: 'Caller claims to be from RBI demanding immediate fine transfer. Hang up and call your bank branch.',
        pitfallToAvoid: 'Continuing to converse with aggressive or fast-talking callers.'
      },
      {
        stepLabel: 'NEVER_PAY',
        actionTitle: 'Decline Any Request via Unofficial Channels',
        description: 'Refuse all payment requests demanding cryptocurrency, gift cards, remote app downloads, or UPI transfers to unknown individuals.',
        practicalExample: 'Decline the transaction on PhonePe / Google Pay / Paytm and block the requester.',
        pitfallToAvoid: 'Sending small "test amounts" of Rs. 1 or Rs. 10 to see if the recipient is genuine.'
      }
    ]
  },
  {
    id: 'isolate-revoke-reset-audit',
    title: 'Emergency Compromise Containment',
    acronym: 'ISOLATE → REVOKE → RESET → AUDIT',
    shortTagline: 'Immediate step-by-step incident response when you suspect your account or device is hacked.',
    category: 'Incident Response',
    whenToUse: 'If you accidentally gave away credentials, downloaded an unknown file, or see unauthorized logins.',
    whyItWorks: 'Stops ongoing attacker data exfiltration and severs active session tokens before attackers can lock you out.',
    relatedThreatIds: ['ransomware', 'malware', 'identity-theft'],
    steps: [
      {
        stepLabel: 'ISOLATE',
        actionTitle: 'Sever Network Connections Immediately',
        description: 'Turn off Wi-Fi and mobile data on your device, or unplug the Ethernet cable. Put your smartphone into Airplane Mode.',
        practicalExample: 'PC screen starts moving on its own or ransomware notice appears. Unplug internet instantly to stop malware phone-home.',
        pitfallToAvoid: 'Leaving the computer connected to Wi-Fi while searching online for what to do.'
      },
      {
        stepLabel: 'REVOKE',
        actionTitle: 'Terminate All Active Sessions',
        description: 'From a clean, uncompromised secondary device (e.g. family member’s phone), log into your primary account settings and click "Sign out of all sessions".',
        practicalExample: 'In Google Account > Security > Your devices > "Sign out of all other sessions".',
        pitfallToAvoid: 'Only changing the password without revoking existing attacker authorization tokens.'
      },
      {
        stepLabel: 'RESET',
        actionTitle: 'Change Passwords & Enable Hardware MFA',
        description: 'Create a fresh, high-entropy 16+ character passphrase. Update your Multi-Factor Authentication method and generate fresh backup recovery codes.',
        practicalExample: 'Set a new passphrase using a password manager and switch SMS 2FA to an Authenticator app.',
        pitfallToAvoid: 'Using a slight variation of your previous password (e.g. adding "1" to the end).'
      },
      {
        stepLabel: 'AUDIT',
        actionTitle: 'Check Recovery Rules & Account Forwarding',
        description: 'Review account settings for sneaky attacker backdoors: email forwarding rules, new recovery phone numbers, or linked third-party OAuth apps.',
        practicalExample: 'Check Gmail Settings > Filters and Blocked Addresses to verify the hacker did not set up a rule forwarding all bank emails to their address.',
        pitfallToAvoid: 'Assuming you are completely safe without auditing email forwarding rules.'
      }
    ]
  },
  {
    id: 'hangup-neverinstall-checkdevice',
    title: 'Fake Tech Support & Remote Screen Defense',
    acronym: 'HANG_UP → NEVER_INSTALL → CHECK_DEVICE',
    shortTagline: 'Block high-pressure callers demanding remote access software like AnyDesk or TeamViewer.',
    category: 'Social Engineering',
    whenToUse: 'When a caller claiming to be from Microsoft, Apple, your bank, or courier asks you to download an app or give them a 9-digit code.',
    whyItWorks: 'Remote access software allows criminals to see your screen in real time, watch you enter passwords, and transfer your funds.',
    relatedThreatIds: ['smishing-vishing', 'malware'],
    steps: [
      {
        stepLabel: 'HANG_UP',
        actionTitle: 'Immediately Terminate the Call',
        description: 'Legitimate tech companies (Microsoft, Apple, Google) NEVER place unsolicited phone calls to consumers about computer viruses.',
        practicalExample: 'Caller says: "Your Windows computer has been breached by Russian hackers. I will help you clean it."',
        pitfallToAvoid: 'Arguing with the caller or believing their fake employee badge numbers.'
      },
      {
        stepLabel: 'NEVER_INSTALL',
        actionTitle: 'Refuse Remote Screen Sharing Software',
        description: 'Never install AnyDesk, TeamViewer, QuickSupport, RustDesk, or UltraViewer at the direction of an unsolicited caller or text message.',
        practicalExample: 'Caller says: "Download QuickSupport from Play Store so I can refund your money." Refuse and hang up.',
        pitfallToAvoid: 'Reading aloud the 9-digit session code shown on your screen to anyone over the phone.'
      },
      {
        stepLabel: 'CHECK_DEVICE',
        actionTitle: 'Inspect & Uninstall Unknown Apps',
        description: 'If you already installed an app, uninstall it immediately. Run an offline scan with built-in Windows Defender or mobile security tools.',
        practicalExample: 'Go to Settings > Apps > Installed Apps, locate AnyDesk or TeamViewer, and tap "Uninstall".',
        pitfallToAvoid: 'Leaving remote management software installed on your device for "future support".'
      }
    ]
  }
];

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'scenario-fake-bank-sms',
    title: 'The "Debit Alert with Cancellation Link" Trap',
    threatCategory: 'Financial Scams',
    attackerPretext: 'Scammers send an SMS spoofing a major bank warning that a large sum of money has been debited via IMPS or wire transfer.',
    victimPerspective: 'The user receives an alert: "Rs. 48,500 debited from your A/c. If not done by you, immediately cancel at https://sbi-unfreeze-secure.info/cancel within 15 mins." Panicked, the victim fears losing their savings and rushes to click the link.',
    psychologicalTrigger: 'Artificial Urgency & Fear of Financial Loss',
    redFlagsPresent: [
      'Artificial 15-minute deadline designed to prevent rational consultation',
      'Unofficial domain extension (.info) instead of official bank website (.sbi or bank URL)',
      'Bank alerts do not require visiting third-party cancellation portals to dispute charges',
      'Sent from an unknown 10-digit mobile number rather than verified bank sender code'
    ],
    whatVictimShouldDo: [
      'Do not click the link or reply to the text.',
      'Open your bank mobile app directly or check your mini-statement independently.',
      'Notice that no such deduction has actually occurred.',
      'Report the phishing SMS to your carrier by forwarding to 1909 or 7726.'
    ],
    takeaway: 'Scammers create panic about a fake deduction to trick you into entering credentials on a clone page, which actually causes the real theft.',
    relatedThreatId: 'phishing'
  },
  {
    id: 'scenario-parcel-delivery-smishing',
    title: 'The "Missed Postal Delivery & Address Correction" Scam',
    threatCategory: 'Deception & Fraud',
    attackerPretext: 'An SMS pretending to be India Post, USPS, or FedEx claiming a package cannot be delivered due to an incomplete street address.',
    victimPerspective: 'User is expecting a package (or wonders what surprise it might be) and reads: "Your parcel is held at the hub. Update your address and pay Rs. 25 redelivery fee at indiapost-tracking-hub.in/update."',
    psychologicalTrigger: 'Curiosity & Low Cost Trap (Small nominal fee)',
    redFlagsPresent: [
      'Link domain does not match official postal website (.gov.in or official courier app)',
      'Demands payment of a tiny Rs. 25 or $1.50 fee to capture full credit card details and CVV',
      'No specific tracking number or recipient name mentioned in the message'
    ],
    whatVictimShouldDo: [
      'Never tap links in postal delivery text messages.',
      'Check tracking numbers exclusively inside official carrier apps or bookmarked portals.',
      'Remember that postal services do not demand online credit card payments via SMS.'
    ],
    takeaway: 'The tiny "nominal redelivery fee" is a decoy: entering your card details gives criminals your card number, expiration, and CVV for unauthorized foreign transactions.',
    relatedThreatId: 'smishing-vishing'
  },
  {
    id: 'scenario-olx-qr-receive-scam',
    title: 'The "Scan QR Code to Receive Payment" Fraud',
    threatCategory: 'Financial Fraud',
    attackerPretext: 'A buyer on an online marketplace (OLX, Facebook Marketplace) agrees immediately to buy your listed item without bargaining and offers to pay via UPI.',
    victimPerspective: 'The buyer sends a QR code image on WhatsApp saying: "I have transferred the money. Scan this QR code in Google Pay or PhonePe to receive Rs. 12,000 into your account."',
    psychologicalTrigger: 'Eagerness to Sell & Technical Confusion',
    redFlagsPresent: [
      'Buyer is too eager and does not negotiate price or inspect the physical item',
      'Insistence on sending money immediately via a QR code',
      'The UPI payment screen says "Paying" instead of "Receiving"'
    ],
    whatVictimShouldDo: [
      'Refuse to scan any QR code sent by an unknown buyer.',
      'Remind them that UPI credits occur automatically to your phone number/VPA without any action on your phone.',
      'Block the buyer immediately on WhatsApp and the marketplace platform.'
    ],
    takeaway: 'Scanning a QR code and entering your UPI PIN always sends money from your account. You NEVER need to scan a QR code to receive money.',
    relatedThreatId: 'upi-fraud'
  },
  {
    id: 'scenario-whatsapp-family-impersonation',
    title: 'The "Hi Mom / Hi Dad, I Lost My Phone" Emergency',
    threatCategory: 'Social Engineering',
    attackerPretext: 'A message arrives on WhatsApp from an unknown number: "Hi Mom, I dropped my phone in water. This is my temporary number. I have an urgent bill due today, can you transfer Rs. 25,000 to this UPI ID?"',
    victimPerspective: 'A concerned parent reads the message, assumes their child is in genuine distress, and feels protective urgency to send funds immediately.',
    psychologicalTrigger: 'Parental Love, Empathy & Urgent Distress',
    redFlagsPresent: [
      'New number claiming to be a close family member',
      'Immediate request for emergency funds via UPI or wire transfer',
      'Excuses for why they cannot speak on a voice phone call right now ("Microphone is broken")'
    ],
    whatVictimShouldDo: [
      'Immediately call your family member on their EXISTING, known phone number.',
      'Ask a question that only the real family member would know (e.g. "What is our pet’s name?").',
      'Never send funds to unverified UPI IDs based purely on text messages.'
    ],
    takeaway: 'Always verify family emergencies using a voice phone call to their existing number or through mutually known relatives before sending money.',
    relatedThreatId: 'identity-theft'
  }
];

export const LEARNING_TRACKS = [
  {
    id: 'track-citizen-basics',
    title: 'Digital Citizen Safety Fundamentals',
    target: 'Everyday Internet Users & Families',
    estimatedMinutes: 12,
    badgeColor: 'blue',
    description: 'Master the 4 fundamental habits that protect you against 95% of common online threats.',
    modules: [
      { id: 'phishing', title: 'Recognize Phishing & Deception', type: 'threat' },
      { id: 'stop-check-verify-act', title: 'Universal Scam Filter (STOP-CHECK-VERIFY-ACT)', type: 'methodology' },
      { id: 'passwords-passphrases', title: 'Strong Passphrases & Password Vaults', type: 'basic' },
      { id: 'multi-factor-auth', title: 'Multi-Factor Authentication (MFA)', type: 'basic' }
    ]
  },
  {
    id: 'track-financial-shield',
    title: 'UPI, Banking & Payment Guardian',
    target: 'Active Digital Banking & E-Commerce Users',
    estimatedMinutes: 15,
    badgeColor: 'emerald',
    description: 'Learn how to detect fake bank alerts, QR code payment traps, and deceptive e-commerce stores.',
    modules: [
      { id: 'upi-fraud', title: 'UPI & Mobile Payment Scams', type: 'threat' },
      { id: 'pause-check-call-neverpay', title: 'Financial & UPI Defense Methodology', type: 'methodology' },
      { id: 'scenario-fake-bank-sms', title: 'Real-World Case: Bank SMS Cancellation Trap', type: 'scenario' },
      { id: 'scenario-olx-qr-receive-scam', title: 'Real-World Case: QR Code Marketplace Trap', type: 'scenario' }
    ]
  },
  {
    id: 'track-device-hygiene',
    title: 'Device & Remote Attack Defense',
    target: 'Students, Remote Workers & Professionals',
    estimatedMinutes: 14,
    badgeColor: 'purple',
    description: 'Safeguard your devices against ransomware, fake tech support, and remote screen hijacking.',
    modules: [
      { id: 'ransomware', title: 'Ransomware & Extortion Defense', type: 'threat' },
      { id: 'hangup-neverinstall-checkdevice', title: 'Fake Support & Remote Screen Protocol', type: 'methodology' },
      { id: 'isolate-revoke-reset-audit', title: 'Emergency Compromise Response (ISOLATE-REVOKE-RESET)', type: 'methodology' },
      { id: 'software-updates', title: 'Software & Patch Management', type: 'basic' }
    ]
  }
];
