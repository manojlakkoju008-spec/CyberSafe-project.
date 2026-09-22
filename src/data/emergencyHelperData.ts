import { EmergencySituation } from '../types';

export const EMERGENCY_SITUATIONS: EmergencySituation[] = [
  {
    id: 'money-stolen',
    title: 'Money was stolen (Unauthorized Transaction)',
    shortTag: 'Financial Fraud',
    iconName: 'CreditCard',
    urgency: 'critical',
    summary: 'Money was debited from your bank account, credit card, or UPI wallet without your consent.',
    calmNotice: 'Act swiftly but methodically. The initial 1 to 2 hours ("Golden Hours") offer the highest statistical probability of freezing the beneficiary account before the fraudster withdraws the stolen funds.',
    relatedCategoryId: 'financial-fraud',
    step1Immediate: {
      title: 'What to do immediately',
      description: 'Stop any further money outflow and initiate interbank emergency lien.',
      criticalActionCallout: 'Dial National Cybercrime Helpline 1930 immediately, then call your bank 24/7 hotline to freeze UPI & block cards.',
      bullets: [
        'Call the National Cyber Crime Helpline at 1930 immediately (Toll-Free, 24/7 across India) to register the fraudulent transaction with the Indian Cyber Crime Coordination Centre (I4C) citizen financial fraud management system.',
        'Call your bank or payment app (Paytm, PhonePe, Google Pay) 24/7 emergency customer care immediately to block debit/credit cards, freeze net banking access, and de-link UPI.',
        'Request your bank fraud desk to place an urgent interbank hold / lien on the beneficiary transaction reference (UTR) to prevent subsequent ATM withdrawals or transfers.'
      ]
    },
    step2Secure: {
      title: 'What to secure',
      description: 'Isolate other accounts and prevent recurring unauthorized debits.',
      bullets: [
        'Immediately change your Net Banking login password, transaction password, and UPI PINs from a secure, clean phone or computer.',
        'Review and disable auto-debit mandates, standing instructions, and linked third-party merchant authorizations in your banking app.',
        'Log out of all active online banking sessions and revoke browser password-autofill for financial portals.'
      ]
    },
    step3Evidence: {
      title: 'What evidence to preserve',
      description: 'Preserve immutable transaction records before they are purged or lost.',
      bullets: [
        'Save the debit SMS notification showing the 12-digit Unique Transaction Reference (UTR) number, timestamp, and amount.',
        'Download the official PDF bank statement highlighting the specific fraudulent line-item transaction.',
        'Screenshot the payment receipt screen inside your UPI app showing the recipient UPI VPA (e.g., fraudster@upi) or account details.',
        'Preserve any scam phone call recordings, SMS messages, or fake transaction confirmation receipts without altering them.'
      ]
    },
    step4Contact: {
      title: 'Who to contact',
      description: 'Reach out to authorized financial and law enforcement support personnel.',
      contacts: [
        {
          label: 'National Cyber Crime Helpline (India)',
          role: 'Emergency Interbank Fund Freeze Desk',
          method: 'phone',
          value: '1930',
          detail: 'Dial 1930 immediately. Keep your bank account number, debit UTR number, and incident timestamp ready for the police operator.',
          isOfficialGov: true
        },
        {
          label: 'Your Bank Fraud Cell / Grievance Officer',
          role: 'Bank Card & Account Hotlisting',
          method: 'phone',
          detail: 'Call the verified emergency toll-free number printed on the back of your debit/credit card or inside your official mobile banking app.'
        },
        {
          label: 'UPI / Wallet Support (PhonePe, GPay, Paytm, etc.)',
          role: 'Payment Aggregator Dispute Unit',
          method: 'in-app',
          detail: 'Navigate in-app to Transaction History > Need Help > Report Fraudulent Transaction to create an internal ticket reference.'
        }
      ]
    },
    step5Report: {
      title: 'Where to report',
      description: 'Lodge formal complaints on official statutory government portals.',
      routes: [
        {
          name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
          description: 'Official Government of India portal for filing formal police FIR / cybercrime complaints.',
          url: 'https://cybercrime.gov.in/',
          isOfficialGov: true,
          notes: 'File under "Financial Fraud" within 24 hours. You will receive an official Acknowledgement Number.'
        },
        {
          name: 'Local Police Cyber Crime Cell',
          description: 'Physically visit your nearest district cyber crime police station if online filing requires supplementary local affidavit.',
          notes: 'Bring printed copies of your bank statement, UTR records, and written incident timeline.'
        },
        {
          name: 'RBI Banking Ombudsman (CMS Portal)',
          description: 'If your bank fails to respond within 30 days or rejects your zero-liability claim unjustly.',
          url: 'https://cms.rbi.org.in/',
          isOfficialGov: true,
          notes: 'File under the Reserve Bank of India Charter of Customer Rights (Zero/Limited Liability in Unauthorized Electronic Transactions).'
        }
      ]
    },
    step6Avoid: {
      title: 'What to avoid doing',
      description: 'Critical warnings to avoid worsening the loss or falling for secondary traps.',
      bullets: [
        'DO NOT trust or call customer care numbers found on Google Search or Google Maps reviews. Scammers publish fake toll-free numbers to steal remaining funds.',
        'DO NOT install any remote-desktop utility (such as AnyDesk, TeamViewer, RustDesk, or QuickSupport) suggested by anyone claiming they will "help refund your money".',
        'DO NOT pay "fund recovery agents" or hackers claiming on social media that they can recover stolen funds for a fee. 100% of these third-party recovery services are secondary recovery scams.',
        'DO NOT assume recovery is guaranteed. Interbank freezing depends on how fast the alert reaches beneficiary institutions before cashout; remain vigilant and document all official complaint numbers.'
      ]
    }
  },
  {
    id: 'account-hacked',
    title: 'My account was hacked (Unauthorized Access)',
    shortTag: 'Account Takeover',
    iconName: 'Lock',
    urgency: 'critical',
    summary: 'An unauthorized person gained access to your social media, email, messaging, or cloud storage account.',
    calmNotice: 'Act methodically. Most major platforms retain security audit trails and temporary grace periods that allow legitimate owners to recover access even if passwords were altered.',
    relatedCategoryId: 'account-hacking',
    step1Immediate: {
      title: 'What to do immediately',
      description: 'Evict the intruder and regain control of account authentication.',
      criticalActionCallout: 'Initiate official account recovery immediately and terminate all active sessions.',
      bullets: [
        'Navigate to the platform official account recovery flow (e.g., accounts.google.com/signin/recovery, instagram.com/hacked) from a device and Wi-Fi network you have previously used.',
        'If you still have partial access, go to Account Security Settings and click "Log Out of All Other Devices" or "Terminate All Sessions" immediately.',
        'Check whether the attacker changed the linked primary recovery email address or recovery phone number; revert changes immediately if permitted.'
      ]
    },
    step2Secure: {
      title: 'What to secure',
      description: 'Lock down recovery paths and dependent linked accounts.',
      bullets: [
        'Create a brand new, unique 16+ character passphrase that has never been used on any other website.',
        'Enable Multi-Factor Authentication (MFA) using an Authenticator App (Google Authenticator, Microsoft Authenticator, or Aegis). Avoid SMS-based 2FA if SIM-swap is suspected.',
        'Check connected third-party apps and OAuth permissions (e.g., "Sign in with Google/Facebook") and revoke access to any unrecognized applications.'
      ]
    },
    step3Evidence: {
      title: 'What evidence to preserve',
      description: 'Preserve platform security logs before the session history is overwritten.',
      bullets: [
        'Screenshot the "Recent Security Activity" or "Devices & IP Addresses" log showing the attacker IP address, device model, and location.',
        'Preserve platform email alerts stating "Password changed", "New login from unverified device", or "2-Step Verification disabled".',
        'Save screenshots of any fraudulent messages, spam posts, or direct messages the attacker broadcasted from your profile.'
      ]
    },
    step4Contact: {
      title: 'Who to contact',
      description: 'Alert the platform trust & safety team and your immediate network.',
      contacts: [
        {
          label: 'Platform Dedicated Account Recovery Center',
          role: 'Official Platform Recovery Specialist',
          method: 'portal',
          detail: 'Submit identity verification (video selfie or previously linked phone) through the official platform recovery tool.'
        },
        {
          label: 'Friends, Family & Professional Contacts',
          role: 'Fraud Warning Broadcast',
          method: 'action',
          detail: 'Alert your close contacts via an alternative channel (phone call, SMS, or mutual friend) warning them that your account was compromised and to ignore requests for money or suspicious links.'
        }
      ]
    },
    step5Report: {
      title: 'Where to report',
      description: 'File law enforcement and platform violation reports.',
      routes: [
        {
          name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
          description: 'Official Government of India portal for filing hacking and unauthorized computer access incidents.',
          url: 'https://cybercrime.gov.in/',
          isOfficialGov: true,
          notes: 'Report under "Cyber Crime Against Individuals" > "Unauthorized Access / Hacking".'
        },
        {
          name: 'Platform In-App Support & Trust/Safety',
          description: 'Submit an account compromise report directly to Google, Meta (Instagram/Facebook), X, or WhatsApp.',
          notes: 'Use in-app dedicated reporting options to escalate account hijacking.'
        }
      ]
    },
    step6Avoid: {
      title: 'What to avoid doing',
      description: 'Pitfalls that could permanently lock you out or compromise other accounts.',
      bullets: [
        'DO NOT message "Instagram recovery experts" or "hackers for hire" on X, Instagram, or Telegram. They are scammers who demand upfront payment and deliver nothing.',
        'DO NOT delete the compromise notification emails sent to your backup inbox; they contain vital recovery cryptographic rollback links.',
        'DO NOT reuse the compromised password on your personal email, bank, or other online accounts.'
      ]
    }
  },
  {
    id: 'shared-otp',
    title: 'I shared an OTP (One-Time Password)',
    shortTag: 'OTP Compromise',
    iconName: 'Smartphone',
    urgency: 'critical',
    summary: 'You read out or submitted an SMS or email OTP to a caller or deceptive webpage.',
    calmNotice: 'Act immediately. An OTP is typically valid for 3 to 10 minutes. If the attacker has not completed the transaction or login yet, you can still invalidate it or lock the target service.',
    relatedCategoryId: 'financial-fraud',
    step1Immediate: {
      title: 'What to do immediately',
      description: 'Invalidate credentials and block the targeted service before the token executes.',
      criticalActionCallout: 'Lock your net banking or card immediately if it was a banking OTP, or log out of all sessions if it was a login OTP.',
      bullets: [
        'Check the SMS text to identify what the OTP was for (e.g., net banking login, card debit, UPI registration, Aadhaar authentication, or WhatsApp verification).',
        'If it was a banking or card OTP: Call your bank helpline immediately and request an instant block on all electronic channels and card debit privileges.',
        'If it was an Aadhaar OTP: Lock your Aadhaar biometrics immediately on the UIDAI mAadhaar app or myaadhaar.uidai.gov.in.',
        'If it was a WhatsApp 6-digit registration code: Re-enter your phone number in WhatsApp and request a new code immediately to revoke the attacker session.'
      ]
    },
    step2Secure: {
      title: 'What to secure',
      description: 'Eliminate secondary exploitation avenues.',
      bullets: [
        'Reset the main account password and transaction PIN associated with the service immediately.',
        'Check for unauthorized forwarding rules configured on your SMS or email inbox.',
        'Notify your telecom provider if you suspect SIM-swap activity (e.g., sudden lack of cellular signal or unrequested eSIM conversion).'
      ]
    },
    step3Evidence: {
      title: 'What evidence to preserve',
      description: 'Document the conversation and authentication attempt.',
      bullets: [
        'Preserve the original SMS message containing the OTP, sender header (e.g., VM-HDFCBK, AX-SBIINB), and exact timestamp.',
        'Take a screenshot of your phone call history showing the scammer incoming phone number and call duration.',
        'If the OTP was entered on a website, copy the exact web address (URL) from your browser history.'
      ]
    },
    step4Contact: {
      title: 'Who to contact',
      description: 'Directly inform the affected issuing authority.',
      contacts: [
        {
          label: 'Bank 24/7 Fraud & Hotlisting Cell',
          role: 'Card & Net Banking Lockdown',
          method: 'phone',
          detail: 'Call your bank immediate fraud number to halt outgoing transfers and confirm if any debit was authorized.'
        },
        {
          label: 'Cybercrime Helpline (India)',
          role: 'Emergency Fraud Desk',
          method: 'phone',
          value: '1930',
          detail: 'If funds were debited, dial 1930 right away to initiate beneficiary account lien.',
          isOfficialGov: true
        }
      ]
    },
    step5Report: {
      title: 'Where to report',
      description: 'Submit an official incident report.',
      routes: [
        {
          name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
          description: 'Official Government of India portal for filing cyber fraud and OTP deception complaints.',
          url: 'https://cybercrime.gov.in/',
          isOfficialGov: true,
          notes: 'Document the scammer telephone number and any financial loss incurred.'
        },
        {
          name: 'DoT Chakshu Portal (Sanchar Saathi)',
          description: 'Department of Telecommunications platform to report fraudulent caller numbers and SMS headers.',
          url: 'https://sancharsaathi.gov.in/sfc/',
          isOfficialGov: true,
          notes: 'Helps telecom authorities blacklist and disconnect fraudulent SIM connections across India.'
        }
      ]
    },
    step6Avoid: {
      title: 'What to avoid doing',
      description: 'Essential preventive guidelines for OTP incidents.',
      bullets: [
        'DO NOT share any subsequent "cancellation" or "refund" OTPs. Scammers often call back pretending to be bank security officers helping you reverse the previous charge.',
        'DO NOT stay on the call with the scammer; terminate the call immediately.',
        'NEVER share an OTP with anyone under any circumstances. Genuine bank staff, police, and customer support representatives NEVER ask for an OTP.'
      ]
    }
  },
  {
    id: 'clicked-suspicious-link',
    title: 'I clicked a suspicious link (Deceptive URL / Phishing)',
    shortTag: 'Phishing Exposure',
    iconName: 'Link',
    urgency: 'high',
    summary: 'You tapped on a suspicious link in an SMS, email, WhatsApp message, or social media post.',
    calmNotice: 'Merely clicking a link does not automatically mean your bank account is drained, but prompt precautions prevent credential theft and silent script payloads.',
    relatedCategoryId: 'phishing-scam',
    step1Immediate: {
      title: 'What to do immediately',
      description: 'Contain the browser session and determine if input was provided.',
      criticalActionCallout: 'Close the browser tab immediately. If you submitted passwords or payment info, reset those credentials immediately from a clean device.',
      bullets: [
        'Close the browser tab and clear your browser recent history, cookies, and cache for that site.',
        'Determine if you entered any information: Did you type a password, card number, UPI PIN, or personal info? If yes, treat those credentials as compromised immediately.',
        'If a file or installer automatically started downloading, do NOT open or run it. Cancel the download or delete the file from your Downloads folder immediately.'
      ]
    },
    step2Secure: {
      title: 'What to secure',
      description: 'Neutralize potential credential leakage and browser sessions.',
      bullets: [
        'If you entered credentials for any service (Google, Facebook, bank, etc.), change the password for that service immediately on a known secure device.',
        'Enable Multi-Factor Authentication (MFA) on the affected service.',
        'Review recent login activity and revoke all active sessions in the settings of the affected account.'
      ]
    },
    step3Evidence: {
      title: 'What evidence to preserve',
      description: 'Capture the phishing vector before the scam link is taken down.',
      bullets: [
        'Copy the exact full web address (URL) from your browser history (do NOT click it again).',
        'Screenshot the incoming message or email showing the sender email address, phone number, or SMS header.',
        'Save the timestamp and any communication context (e.g. electricity bill threat, parcel delivery notice).'
      ]
    },
    step4Contact: {
      title: 'Who to contact',
      description: 'Alert affected account providers if credentials were submitted.',
      contacts: [
        {
          label: 'Customer Care of the Service You Submitted',
          role: 'Account Security Notification',
          method: 'action',
          detail: 'If you typed your bank credentials, contact your bank fraud cell. If work credentials, notify your company IT / security administrator.'
        }
      ]
    },
    step5Report: {
      title: 'Where to report',
      description: 'Submit the malicious link to global and national protection systems.',
      routes: [
        {
          name: 'Google Safe Browsing Report Phishing',
          description: 'Flag deceptive links to trigger warning screens across Chrome, Firefox, Safari, and Android.',
          url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
          isOfficialGov: false,
          notes: 'Protects millions of internet users by blocking the domain in browsers.'
        },
        {
          name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
          description: 'Official Government of India portal for reporting phishing attempts and online fraud.',
          url: 'https://cybercrime.gov.in/',
          isOfficialGov: true,
          notes: 'Report under "Report Other Cyber Crimes" > "Phishing / Social Engineering".'
        },
        {
          name: 'DoT Chakshu Portal (Sanchar Saathi)',
          description: 'Report suspected fraudulent SMS links to the Department of Telecommunications.',
          url: 'https://sancharsaathi.gov.in/sfc/',
          isOfficialGov: true,
          notes: 'Submits the scam sender header and message text for telecommunication scrutiny.'
        }
      ]
    },
    step6Avoid: {
      title: 'What to avoid doing',
      description: 'Avoid actions that expose additional data.',
      bullets: [
        'DO NOT reply to the sender, test the link again, or forward the link to family or colleagues.',
        'DO NOT grant browser permissions (e.g., "Allow Notifications", "Allow Location", or "Install Profile") if prompted by suspicious pages.',
        'DO NOT assume the link was safe just because it looked like a legitimate website—modern phishing kits make pixel-perfect clones.'
      ]
    }
  },
  {
    id: 'installed-suspicious-app',
    title: 'I installed something suspicious (APK / Malware / Remote Access)',
    shortTag: 'Malware / APK Infection',
    iconName: 'ShieldAlert',
    urgency: 'critical',
    summary: 'You installed an APK from a link, downloaded an unknown executable, or installed a remote screen-sharing utility at someone request.',
    calmNotice: 'Turn on Airplane Mode immediately. Isolating the device from the internet halts remote control commands, data exfiltration, and auto-forwarding of SMS OTPs.',
    relatedCategoryId: 'other-cybercrime',
    step1Immediate: {
      title: 'What to do immediately',
      description: 'Sever internet connectivity and revoke device administrative rights.',
      criticalActionCallout: 'Turn ON Airplane Mode and disconnect Wi-Fi immediately to cut off the attacker remote connection.',
      bullets: [
        'Turn ON Airplane Mode and turn OFF Wi-Fi and Bluetooth immediately. This severs the attacker connection and prevents background SMS exfiltration.',
        'Go to Settings > Apps > Special App Access > Device Admin Apps. Check if any suspicious app has Device Administrator or Accessibility privileges, and revoke them.',
        'Uninstall the suspicious application immediately (look out for hidden apps with transparent icons, generic names like "Settings", "System Update", or customer support names).'
      ]
    },
    step2Secure: {
      title: 'What to secure',
      description: 'Audit critical services and sanitize the device.',
      bullets: [
        'Perform a complete malware scan using a reputable mobile antivirus tool (Google Play Protect, Bitdefender, or Malwarebytes).',
        'From a separate clean device (NOT the infected phone), change your banking, email, and social media passwords immediately.',
        'If the malware had Accessibility permissions or cannot be removed normally, back up essential photos/contacts and perform a complete Factory Data Reset.'
      ]
    },
    step3Evidence: {
      title: 'What evidence to preserve',
      description: 'Record malware origin before factory resetting.',
      bullets: [
        'Take a clear photo (using a secondary phone) of the suspicious app name, package name, icon, and permissions.',
        'Preserve the message, website link, or QR code from which the file or APK was downloaded.',
        'Record the phone number or username of the person who instructed you to install the app.'
      ]
    },
    step4Contact: {
      title: 'Who to contact',
      description: 'Alert financial institutions in case banking trojans intercepted SMS.',
      contacts: [
        {
          label: 'Your Bank Customer Care',
          role: 'Financial Account Monitoring',
          method: 'phone',
          detail: 'Call your bank from another phone to verify no unauthorized transactions took place while the app was active, and request a temporary electronic freeze if in doubt.'
        }
      ]
    },
    step5Report: {
      title: 'Where to report',
      description: 'Submit technical malware details to CERT-In and Cybercrime portal.',
      routes: [
        {
          name: 'CERT-In (Indian Computer Emergency Response Team)',
          description: 'National nodal agency for tracking malicious applications, trojans, and cyber threats.',
          url: 'https://www.cert-in.org.in/',
          helpline: '1800-11-4949',
          isOfficialGov: true,
          notes: 'Submit the APK file or download link to incident@cert-in.org.in for threat analysis.'
        },
        {
          name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
          description: 'Official Government of India portal for reporting malware and malicious apps.',
          url: 'https://cybercrime.gov.in/',
          isOfficialGov: true,
          notes: 'Report under "Other Cyber Crime" > "Ransomware / Malware / Remote Access Tool abuse".'
        }
      ]
    },
    step6Avoid: {
      title: 'What to avoid doing',
      description: 'Crucial rules to prevent further compromise.',
      bullets: [
        'DO NOT log into your banking or payment apps on this device until it is verified clean or factory reset.',
        'DO NOT leave the phone connected to the internet while troubleshooting.',
        'DO NOT download APK files or install apps from WhatsApp links, Telegram channels, or unknown websites in the future; only use official app stores.'
      ]
    }
  },
  {
    id: 'someone-impersonating-me',
    title: 'Someone is impersonating me (Fake Profile / Identity Theft)',
    shortTag: 'Impersonation / Fake Profile',
    iconName: 'UserX',
    urgency: 'high',
    summary: 'A scammer created a social media profile, WhatsApp account, or website using your name, photos, or personal credentials.',
    calmNotice: 'Fake profiles are created to deceive your friends and family. A prompt public notice and official platform report typically results in the clone profile being swiftly taken down.',
    relatedCategoryId: 'fake-profile',
    step1Immediate: {
      title: 'What to do immediately',
      description: 'Alert your network and report the counterfeit profile on the host platform.',
      criticalActionCallout: 'Post a public story or notice from your genuine account alerting contacts NOT to send money or respond to the imposter.',
      bullets: [
        'Publish a clear advisory story/post on your verified genuine accounts: "Warning: A fake profile is impersonating me. I have not created a new account and I will never ask for money or OTPs."',
        'Use the built-in reporting mechanism on the platform where the fake profile is hosted (Report Profile > Pretending to Be Someone > Me).',
        'Ask trusted friends to also report the fake profile to expedite automated Trust & Safety review by the platform algorithms.'
      ]
    },
    step2Secure: {
      title: 'What to secure',
      description: 'Protect your genuine social profiles from further scraping.',
      bullets: [
        'Switch your personal social media accounts to Private so strangers cannot download additional personal photos.',
        'Review your friend/follower list and remove suspicious or anonymous accounts.',
        'Hide your friend list or mutual connections if the platform permits to prevent scammers from targeting them.'
      ]
    },
    step3Evidence: {
      title: 'What evidence to preserve',
      description: 'Gather documentation before the scammer modifies or deletes the profile.',
      bullets: [
        'Copy the direct web link (URL) of the fraudulent profile (e.g., instagram.com/imposter_username).',
        'Take full screenshots of the fake profile page showing the profile photo, username handle, bio, and follower count.',
        'Screenshot any messages the impersonator sent to your contacts, especially those asking for money, gift cards, or UPI transfers.'
      ]
    },
    step4Contact: {
      title: 'Who to contact',
      description: 'Coordinate with platform safety teams and victims.',
      contacts: [
        {
          label: 'Platform Trust & Safety Team',
          role: 'Account Takedown Request',
          method: 'in-app',
          detail: 'Submit a formal impersonation claim via platform support (Meta, X, LinkedIn, or Google) providing your government ID if requested for verification.'
        }
      ]
    },
    step5Report: {
      title: 'Where to report',
      description: 'File an official law enforcement complaint.',
      routes: [
        {
          name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
          description: 'Official Government of India portal for filing cyber impersonation and identity theft complaints.',
          url: 'https://cybercrime.gov.in/',
          isOfficialGov: true,
          notes: 'Report under "Report Cyber Crime Against Women/Children" or "Report Other Cyber Crime" > "Impersonation / Fake Profile".'
        }
      ]
    },
    step6Avoid: {
      title: 'What to avoid doing',
      description: 'Actions to avoid during impersonation incidents.',
      bullets: [
        'DO NOT pay any money, ransom, or extortion fees to the imposter to "take down" the profile.',
        'DO NOT engage in aggressive arguments or hostile exchanges with the scammer via direct messages.',
        'DO NOT click any links sent by the imposter in private messages.'
      ]
    }
  },
  {
    id: 'harassed-online',
    title: 'I am being harassed online (Cyberbullying / Stalking / Blackmail)',
    shortTag: 'Harassment & Cyberbullying',
    iconName: 'AlertOctagon',
    urgency: 'high',
    summary: 'You are receiving repeated threatening, abusive, or blackmailing messages, non-consensual image manipulation, or doxxing.',
    calmNotice: 'You are not alone, and you are not at fault. Do not give in to blackmail demands—extortionists never stop after one payment. Focus on preserving proof and using official protective tools.',
    relatedCategoryId: 'cyberbullying',
    step1Immediate: {
      title: 'What to do immediately',
      description: 'Protect your safety, preserve evidence, and refuse extortion demands.',
      criticalActionCallout: 'DO NOT pay any money or send additional images if being blackmailed (sextortion). Extortionists will only demand more.',
      bullets: [
        'If you face immediate physical danger or threats to your life, dial 112 (National Emergency Response Support System India) immediately.',
        'DO NOT negotiate, plead, or pay any money to blackmailer demands. Payment does not stop exposure; it marks you as a paying target.',
        'Before blocking the perpetrator, take complete screenshots of all abusive chats, profiles, voice notes, and phone numbers.'
      ]
    },
    step2Secure: {
      title: 'What to secure',
      description: 'Lock down digital visibility and prevent intimate image circulation.',
      bullets: [
        'Lock your social media profiles, restrict direct messages from unknown senders, and turn off location tagging.',
        'If non-consensual intimate images or morphed photos are threatened, visit StopNCII.org (for adults) or TakeItDown.ncmec.org (for under-18s) to generate secure digital hashes that stop image uploads across major platforms.',
        'Block and report the harasser accounts across all communication platforms once evidence is securely archived.'
      ]
    },
    step3Evidence: {
      title: 'What evidence to preserve',
      description: 'Preserve complete, unedited communication records for police prosecution.',
      bullets: [
        'Save uncropped screenshots showing the harasser profile handle, phone number, exact message text, and timestamps.',
        'Do NOT delete the chat history; export the full chat transcript (e.g. WhatsApp Export Chat without media or with media) and store it in a secure folder.',
        'Save the direct URL links to any abusive posts, comments, or public forums where personal information was doxxed.'
      ]
    },
    step4Contact: {
      title: 'Who to contact',
      description: 'Access emergency, counseling, and law enforcement resources.',
      contacts: [
        {
          label: 'National Emergency Response (Police India)',
          role: 'Immediate Physical Safety Emergency',
          method: 'phone',
          value: '112',
          detail: 'Dial 112 if you are in physical danger or experiencing real-world stalking/threats.',
          isOfficialGov: true
        },
        {
          label: 'National Commission for Women (NCW) Helpline',
          role: 'Support for Women Facing Cyber Harassment',
          method: 'phone',
          value: '7827170170',
          detail: '24/7 dedicated helpline for women facing cyberstalking, harassment, or online abuse.',
          isOfficialGov: true
        },
        {
          label: 'Kiran Mental Health Rehabilitation Helpline',
          role: 'Psychological Support & Distress Counseling',
          method: 'phone',
          value: '1800-599-0019',
          detail: 'Toll-free 24/7 government mental health support helpline for emotional distress.'
        }
      ]
    },
    step5Report: {
      title: 'Where to report',
      description: 'File statutory complaints with dedicated cybercrime branches.',
      routes: [
        {
          name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
          description: 'Dedicated portal with specific option for "Report Cyber Crime Against Women/Children" with anonymous reporting options.',
          url: 'https://cybercrime.gov.in/',
          isOfficialGov: true,
          notes: 'Allows victims to report non-consensual intimate imagery, stalking, and harassment securely.'
        },
        {
          name: 'StopNCII.org',
          description: 'Global non-profit platform operated by SWGfL to stop non-consensual intimate image sharing on participating tech platforms.',
          url: 'https://stopncii.org/',
          isOfficialGov: false,
          notes: 'Generates secure cryptographic hashes directly on your device without uploading your photos.'
        }
      ]
    },
    step6Avoid: {
      title: 'What to avoid doing',
      description: 'Actions that harm evidence integrity or worsen mental distress.',
      bullets: [
        'DO NOT delete messages or destroy your device out of panic; the digital trail is necessary for police to trace IP addresses and phone numbers.',
        'DO NOT retaliate with abusive messages, doxxing, or counter-threats.',
        'DO NOT isolate yourself; confide in a trusted family member, mentor, or professional counselor.'
      ]
    }
  },
  {
    id: 'shared-personal-info',
    title: 'I shared personal information (Aadhaar / PAN / Sensitive PII)',
    shortTag: 'Data / PII Exposure',
    iconName: 'ShieldAlert',
    urgency: 'high',
    summary: 'You uploaded copies of your Aadhaar card, PAN card, passport, address proof, or personal details to a fake portal or scammer.',
    calmNotice: 'Aadhaar and PAN details can be misused for synthetic identity creation or unauthorized SIM registrations. Proactively locking your credentials stops scammers in their tracks.',
    relatedCategoryId: 'identity-theft',
    step1Immediate: {
      title: 'What to do immediately',
      description: 'Lock your biometrics and audit active connections.',
      criticalActionCallout: 'Lock your Aadhaar biometrics immediately on UIDAI (myaadhaar.uidai.gov.in) to prevent unauthorized e-KYC authentication.',
      bullets: [
        'Lock Aadhaar Biometrics immediately: Visit myaadhaar.uidai.gov.in or use the mAadhaar mobile app to lock your biometric authentication. This instantly prevents anyone from using your fingerprint or iris scan for fraudulent SIM card issuance or micro-ATM withdrawals.',
        'Check active mobile connections: Visit the official DoT Sanchar Saathi TAFCOP portal (tafcop.sancharsaathi.gov.in) to see all mobile numbers registered against your Aadhaar card and report any unrecognized numbers for immediate disconnection.',
        'Monitor your credit score: Check your CIBIL, Experian, or CRIF High Mark credit report for unauthorized loan inquiries or newly opened credit lines.'
      ]
    },
    step2Secure: {
      title: 'What to secure',
      description: 'Enforce two-factor authentication and alert identity registrars.',
      bullets: [
        'Use Masked Aadhaar (which shows only the last 4 digits) for any future identity verification requirements.',
        'Update passwords for your Income Tax e-Filing portal, EPFO, and DigiLocker accounts.',
        'Enable SMS transaction alerts for all your bank accounts so you are notified of any account activity instantly.'
      ]
    },
    step3Evidence: {
      title: 'What evidence to preserve',
      description: 'Document where and how your documents were collected.',
      bullets: [
        'Save the exact web address (URL), email, or WhatsApp chat through which the documents were requested.',
        'Keep records of the specific documents, front/back photos, or IDs you uploaded or emailed.',
        'Save any reference emails or fake appointment letters issued by the fraudulent portal.'
      ]
    },
    step4Contact: {
      title: 'Who to contact',
      description: 'Alert issuing authorities and financial bureaus.',
      contacts: [
        {
          label: 'UIDAI Aadhaar Support (India)',
          role: 'Aadhaar Identity Helpline',
          method: 'phone',
          value: '1947',
          detail: 'Toll-free helpline 1947 for assistance with locking Aadhaar or reporting suspected identity misuse.',
          isOfficialGov: true
        },
        {
          label: 'Credit Rating Agencies (CIBIL / Experian)',
          role: 'Credit Monitoring & Fraud Alerts',
          method: 'portal',
          detail: 'Request a fraud alert placed on your credit profile so lenders perform heightened verification before approving loans in your name.'
        }
      ]
    },
    step5Report: {
      title: 'Where to report',
      description: 'File an official identity theft and document misuse report.',
      routes: [
        {
          name: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
          description: 'Official Government of India portal for filing identity theft and data fraud complaints.',
          url: 'https://cybercrime.gov.in/',
          isOfficialGov: true,
          notes: 'Report under "Report Other Cyber Crimes" > "Identity Theft".'
        },
        {
          name: 'DoT TAFCOP Portal (Sanchar Saathi)',
          description: 'Official portal to report and disconnect unauthorized SIM cards issued against your identity documents.',
          url: 'https://tafcop.sancharsaathi.gov.in/',
          isOfficialGov: true,
          notes: 'Allows citizens to submit disconnection requests directly to telecom operators.'
        }
      ]
    },
    step6Avoid: {
      title: 'What to avoid doing',
      description: 'Best practices to avoid repeated identity exposure.',
      bullets: [
        'DO NOT share unmasked photocopies of your Aadhaar card with unverified agents, hotels, or rental apps.',
        'DO NOT ignore sudden SMS alerts from unknown lenders or credit inquiry notifications.',
        'DO NOT upload identity documents to random online converters, compression sites, or unverified job portals.'
      ]
    }
  }
];
