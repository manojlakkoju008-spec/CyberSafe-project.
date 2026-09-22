import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'Deceptive Account Suspension Notice',
    topic: 'Phishing',
    scenario: 'You receive an urgent email with the subject "URGENT: Your Cloud Account will be deactivated in 24 hours due to storage policy violations." The email displays the official logo and contains a prominent button reading "Verify Account Credentials Now". The sender address is "support@cloud-security-portal.xyz".',
    question: 'What is the most secure and appropriate action to take?',
    options: [
      {
        id: 'a',
        text: 'Click the button quickly and log in to inspect what storage violation occurred.',
        isCorrect: false,
        explanation: 'Clicking directs you to a credential harvesting clone site designed to record your username and password.'
      },
      {
        id: 'b',
        text: 'Do not click the button. Check the sender email domain, navigate directly to the official cloud provider website in a new tab, and check your account notifications.',
        isCorrect: true,
        explanation: 'Correct! Legitimate service providers never send policy warnings from disposable domain extensions (.xyz). Always log in directly via the official known URL or mobile app.'
      },
      {
        id: 'c',
        text: 'Reply to the email with your username asking for clarification.',
        isCorrect: false,
        explanation: 'Replying validates your email address as active and monitored, increasing future spear-phishing attacks.'
      },
      {
        id: 'd',
        text: 'Forward the email to your friends to warn them about the storage policy.',
        isCorrect: false,
        explanation: 'Forwarding unvetted scam emails risks having other contacts accidentally click the fraudulent link.'
      }
    ],
    warningSigns: [
      'Artificial deadline (24 hours) designed to provoke emotional panic',
      'Generic greeting instead of your full account name',
      'Mismatch between the brand name and the actual sender domain (@cloud-security-portal.xyz)'
    ],
    takeaway: 'Never click authentication buttons in unsolicited emails. Navigate to services independently through bookmarked URLs.'
  },
  {
    id: 2,
    title: 'Unauthorized Debit Bank SMS',
    topic: 'Fake Bank Messages',
    scenario: 'You receive an SMS: "Dear Customer, INR 48,500 has been debited from your A/C ending in 4102 via IMPS. If not done by you, immediately block your account at https://sbi-unfreeze-support.info/block within 15 minutes."',
    question: 'How should you respond to this message?',
    options: [
      {
        id: 'a',
        text: 'Click the link immediately to freeze the transfer before the money leaves your bank.',
        isCorrect: false,
        explanation: 'The link leads to a phishing page that prompts you to enter net banking credentials and OTPs, which actually initiates an unauthorized transaction.'
      },
      {
        id: 'b',
        text: 'Do not click the link. Open your official bank mobile app or check your passbook statement independently, or call the official bank helpline on the back of your debit card.',
        isCorrect: true,
        explanation: 'Correct! Banks never send account unfreeze or block links on unofficial domains (.info). Genuine bank alerts come through registered alphanumeric sender headers (e.g. VK-SBIINB).'
      },
      {
        id: 'c',
        text: 'Call the mobile number that sent the SMS to demand a refund.',
        isCorrect: false,
        explanation: 'The phone number connects directly to the scam syndicate, who will impersonate bank officers to trick you into sharing sensitive OTPs.'
      },
      {
        id: 'd',
        text: 'Take a screenshot and post it on social media tagging random bank handles.',
        isCorrect: false,
        explanation: 'Public posts attract fake support accounts in Twitter/X replies attempting to scam you again.'
      }
    ],
    warningSigns: [
      'Extreme urgency threatening account loss within 15 minutes',
      'Suspicious domain (.info) instead of official bank web portal',
      'Sent from an ordinary 10-digit mobile number instead of an authorized bank SMS sender ID'
    ],
    takeaway: 'Banks will never ask you to reverse a transaction by entering credentials on a web link. Always verify debits inside your official banking app.'
  },
  {
    id: 3,
    title: 'Marketplace "Scan to Receive Money" Trick',
    topic: 'QR-Code Scams',
    scenario: 'You list a bicycle for sale on an online marketplace. A buyer contacts you immediately on WhatsApp, agrees to the full price without bargaining, and sends a UPI QR code image saying: "I have sent the advance of ₹8,000. Please scan this QR code and enter your UPI PIN to receive the money into your bank account."',
    question: 'What is happening in this scenario?',
    options: [
      {
        id: 'a',
        text: 'Scanning the QR code and entering your UPI PIN will credit ₹8,000 to your bank.',
        isCorrect: false,
        explanation: 'Entering your UPI PIN ALWAYS authorizes a debit from your account, never a credit.'
      },
      {
        id: 'b',
        text: 'This is a scam. UPI PIN is only required to SEND money. Receiving money never requires scanning a QR code or entering a PIN.',
        isCorrect: true,
        explanation: 'Correct! A fundamental rule of UPI: You NEVER enter your UPI PIN or scan a QR code to receive money. Scanning this QR code will instantly debit ₹8,000 from your account.'
      },
      {
        id: 'c',
        text: 'You should enter a wrong UPI PIN three times to test if the buyer is honest.',
        isCorrect: false,
        explanation: 'Entering a wrong PIN will block your UPI app for 24 hours without providing any security advantage.'
      },
      {
        id: 'd',
        text: 'You should ask the buyer to send their Aadhaar card photo before scanning.',
        isCorrect: false,
        explanation: 'Scammers readily provide stolen or forged Aadhaar cards of other victims to gain trust.'
      }
    ],
    warningSigns: [
      'Buyer ready to pay without inspecting the product',
      'Claiming that scanning a QR code or entering a PIN is needed to "receive" funds',
      'Insisting on quick execution before you can consult anyone'
    ],
    takeaway: 'UPI PIN is strictly for debiting your account. To receive money, the sender only needs your mobile number or UPI ID.'
  },
  {
    id: 4,
    title: 'Search Engine Customer Care Number',
    topic: 'Fake Customer Support',
    scenario: 'Your courier package is delayed. You search Google for "XYZ Courier customer care number", call the first phone number shown in the top sponsored search result, and the representative says: "Your parcel is held at the hub. Download the AnyDesk/TeamViewer app so I can help you pay the ₹5 address verification fee."',
    question: 'Why is this request dangerous?',
    options: [
      {
        id: 'a',
        text: 'Downloading AnyDesk allows the representative to view your screen and take remote control of your phone, stealing banking OTPs and passwords.',
        isCorrect: true,
        explanation: 'Correct! Scammers buy sponsored search ads with fake helpline numbers. Asking victims to install screen-sharing or remote desktop tools (AnyDesk, TeamViewer, RustDesk) enables attackers to view your screen and steal banking passwords and OTPs in real time.'
      },
      {
        id: 'b',
        text: 'It is not dangerous as long as you pay the ₹5 fee using a credit card.',
        isCorrect: false,
        explanation: 'Once the remote access app is running, the scammer records your card numbers and intercepts the transaction OTP.'
      },
      {
        id: 'c',
        text: 'It is only dangerous if the courier service is international.',
        isCorrect: false,
        explanation: 'Remote access fraud operates identically across domestic and international delivery scams.'
      },
      {
        id: 'd',
        text: 'The representative just needs to verify your phone model.',
        isCorrect: false,
        explanation: 'Legitimate customer care never requires remote desktop access to your phone for courier tracking.'
      }
    ],
    warningSigns: [
      'Helpline number found from an unverified web search ad rather than the official package slip or website',
      'Request to install remote desktop or screen sharing apps (AnyDesk, QuickSupport)',
      'Small token fee (₹5 or ₹10) used as a pretext to open banking apps on screen'
    ],
    takeaway: 'Never install remote-sharing tools at the request of an unknown caller, and never obtain helpline numbers from search engine ad snippets.'
  },
  {
    id: 5,
    title: 'Part-Time "Like Videos & Earn" Offer',
    topic: 'Job Scams',
    scenario: 'You are added to a Telegram group offering a work-from-home opportunity: "Earn ₹2,000–₹5,000 daily by simply liking YouTube videos and rating Google Maps places." To prove it works, they transfer ₹150 to your UPI. Then they assign a "Prepaid Task": deposit ₹5,000 to earn ₹8,500 guaranteed within 30 minutes.',
    question: 'What is the true nature of this scheme?',
    options: [
      {
        id: 'a',
        text: 'It is a legitimate digital marketing gig because they already paid you ₹150.',
        isCorrect: false,
        explanation: 'Paying a small initial sum (₹100–₹200) is standard bait used by task fraud syndicates to build trust before requesting large deposits.'
      },
      {
        id: 'b',
        text: 'It is a classic "Task-Based Ponzi Scam". Once you deposit larger sums (₹5,000, ₹50,000), they will fabricate excuses and demand more money to withdraw your funds.',
        isCorrect: true,
        explanation: 'Correct! Fraudsters create artificial dashboards showing huge profits, but lock your money behind "tax clearance fees" or "credit score penalties." Victims never recover deposited funds.'
      },
      {
        id: 'c',
        text: 'You should deposit ₹5,000 once and immediately quit after getting ₹8,500.',
        isCorrect: false,
        explanation: 'The moment you deposit ₹5,000, your money is gone and withdrawals will be blocked.'
      },
      {
        id: 'd',
        text: 'It is only a scam if they do not provide a company registration certificate.',
        isCorrect: false,
        explanation: 'Scammers freely produce forged Ministry of Corporate Affairs certificates and fake GST documents.'
      }
    ],
    warningSigns: [
      'Unsolicited addition to Telegram or WhatsApp job channels',
      'Unrealistically high payouts for trivial tasks (liking videos)',
      'Requiring you to deposit your own money to unlock earnings or tasks'
    ],
    takeaway: 'Genuine employers pay you for work; they never demand that you pay money to unlock tasks or withdraw earnings.'
  },
  {
    id: 6,
    title: 'Friend or Relative in Medical Distress',
    topic: 'Impersonation',
    scenario: 'You receive a WhatsApp message from an unknown number displaying the profile picture of your close cousin: "Hey, my phone was stolen and I am at the emergency clinic with a friend who had an accident. My UPI is blocked. Please urgently transfer ₹25,000 to this hospital doctor UPI ID. I will pay you back tomorrow."',
    question: 'What is the most prudent step before sending any money?',
    options: [
      {
        id: 'a',
        text: 'Send the ₹25,000 immediately because medical emergencies cannot wait.',
        isCorrect: false,
        explanation: 'Emotional urgency is the primary weapon of social engineers. Once transferred, recovery is extremely difficult.'
      },
      {
        id: 'b',
        text: 'Call your cousin on their original, known phone number, or contact their parents/spouse to verbally verify the situation.',
        isCorrect: true,
        explanation: 'Correct! Impersonation scams rely on stolen profile photos and emotional distress. Always verify identity through an independent voice call or through common relatives before transferring money.'
      },
      {
        id: 'c',
        text: 'Ask the sender to send a selfie from the hospital room.',
        isCorrect: false,
        explanation: 'Scammers frequently use AI-generated images or excuse themselves by saying cameras are not permitted.'
      },
      {
        id: 'd',
        text: 'Transfer half the money (₹12,500) to minimize your risk.',
        isCorrect: false,
        explanation: 'Sending any amount of money directly rewards the criminal.'
      }
    ],
    warningSigns: [
      'Contact from a new, unknown number using a photo copied from public social media',
      'High-stakes emergency (accident, hospital, police detention) requiring rapid money transfer',
      'Pressure to transfer to a third-party UPI ID or account rather than their own'
    ],
    takeaway: 'Always pause and verify unexpected emergency money requests through an out-of-band voice call to a known telephone number.'
  },
  {
    id: 7,
    title: 'Electricity Bill Disconnection Threat',
    topic: 'OTP Scams',
    scenario: 'At 7:00 PM, you receive an SMS: "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from the power office because your previous month bill was not updated. Please immediately contact our officer at 98765-XXXXX." When you call, the officer asks you to share the 6-digit OTP sent to your phone to "update the server status."',
    question: 'What should you do?',
    options: [
      {
        id: 'a',
        text: 'Share the OTP because having your household electricity cut off at night is disruptive.',
        isCorrect: false,
        explanation: 'The OTP is actually an authorization code for net banking, UPI registration, or an e-commerce transaction initiated by the scammer.'
      },
      {
        id: 'b',
        text: 'Do not share the OTP. Power utility companies do not disconnect power at night without formal written notices, nor do they collect OTPs over private mobile numbers.',
        isCorrect: true,
        explanation: 'Correct! Government and private power discoms adhere to statutory disconnection procedures and never use personal mobile numbers or demand OTPs to update payment status.'
      },
      {
        id: 'c',
        text: 'Read the OTP backwards so the caller cannot use it.',
        isCorrect: false,
        explanation: 'Engaging with scammers wastes time and risks accidental disclosure.'
      },
      {
        id: 'd',
        text: 'Ask for the officer employee ID badge before giving the OTP.',
        isCorrect: false,
        explanation: 'Fake credentials can be easily forged or fabricated on the spot.'
      }
    ],
    warningSigns: [
      'Threat of power disconnection late in the evening (outside official business hours)',
      'Direct mobile phone number provided in the SMS instead of an official customer care portal',
      'Request for a 6-digit OTP to "verify" or "update" bill records'
    ],
    takeaway: 'Never share an OTP with anyone over the phone under any circumstance. Power companies never demand OTPs to prevent disconnections.'
  },
  {
    id: 8,
    title: 'Overdue Invoice Email Attachment',
    topic: 'Malicious Attachments',
    scenario: 'You receive an email from "accounts@vendor-billing-services.com" with the message: "Please find attached the past due statement for invoice #INV-88912. Payment is overdue by 14 days." Attached is a file named "Invoice_Statement_Oct2024.pdf.exe" or a password-protected ZIP file containing an executable script.',
    question: 'What danger does this attachment present?',
    options: [
      {
        id: 'a',
        text: 'Double extension files (like .pdf.exe) are executable programs or malware disguised as documents. Opening it will execute trojan spyware or ransomware on your system.',
        isCorrect: true,
        explanation: 'Correct! Attackers use double extensions (.pdf.exe, .docx.scr) knowing that default Windows settings often hide known file extensions. Running the file installs malware, keystroke loggers, or ransomware.'
      },
      {
        id: 'b',
        text: 'It is a legitimate PDF that requires a special reader plugin.',
        isCorrect: false,
        explanation: 'Legitimate PDF documents end strictly with .pdf, never .exe, .scr, or .bat.'
      },
      {
        id: 'c',
        text: 'It is safe to open as long as your email provider did not show a warning banner.',
        isCorrect: false,
        explanation: 'Email filters cannot detect 100% of newly obfuscated zero-day malware files.'
      },
      {
        id: 'd',
        text: 'Opening it in Notepad is completely safe and will show your invoice.',
        isCorrect: false,
        explanation: 'Interacting with malicious binaries risks accidental execution.'
      }
    ],
    warningSigns: [
      'Double file extensions (.pdf.exe) or password-protected ZIP archives designed to bypass antivirus scanners',
      'Vague vendor name that your organization or household has never done business with',
      'Urgent allegations of overdue penalties'
    ],
    takeaway: 'Never open unexpected email attachments with executable or script extensions (.exe, .scr, .vbs, .bat, .apk).'
  },
  {
    id: 9,
    title: 'Lucky Draw & Lottery Prize Claim',
    topic: 'Fake Giveaways',
    scenario: 'You receive a letter or WhatsApp notification showing a celebrity and government seal: "Congratulations! Your mobile number has won the Kaun Banega Crorepati (KBC) Lucky Draw of ₹25,00,000! To release the bank draft into your account, deposit ₹12,500 for government GST and processing fees to this bank account."',
    question: 'How should you evaluate this prize announcement?',
    options: [
      {
        id: 'a',
        text: 'Paying ₹12,500 is a fair tax fee to receive ₹25,00,000 in return.',
        isCorrect: false,
        explanation: 'You will never receive any prize. Once paid, the scammers will ask for additional fees (RBI clearance, insurance, currency fees).'
      },
      {
        id: 'b',
        text: 'This is an advance-fee fraud lottery scam. You cannot win a lottery or contest you never purchased a ticket or registered for, and real prizes never demand upfront fees.',
        isCorrect: true,
        explanation: 'Correct! In advance-fee scams, criminals invent grand prizes to trick victims into paying endless "processing fees," "taxes," or "customs duties." No prize exists.'
      },
      {
        id: 'c',
        text: 'Ask them to deduct the ₹12,500 from the ₹25,00,000 prize and send the rest.',
        isCorrect: false,
        explanation: 'While logical, scammers will simply make up excuses that regulations require advance deposit.'
      },
      {
        id: 'd',
        text: 'Verify the certificate serial number on WhatsApp.',
        isCorrect: false,
        explanation: 'Scammers manage the fake validation lines themselves.'
      }
    ],
    warningSigns: [
      'Winning a massive prize in a contest you never entered',
      'Requirement to pay money upfront (GST, registration, transfer fees) to claim winnings',
      'Use of official logos, national emblems, or celebrity portraits pasted on counterfeit certificates'
    ],
    takeaway: 'If you didn’t buy a ticket, you didn’t win. Legitimate prize distributions never require winners to pay advance fees.'
  },
  {
    id: 10,
    title: 'High-Yield Trading Group with "Guaranteed 500% Returns"',
    topic: 'Investment Scams',
    scenario: 'You are added to a WhatsApp group named "Elite Institutional Wealth & Stock Tips." Members frequently post screenshots of massive profits (e.g. ₹5,00,000 gained in 48 hours). The "Mentor" advises you to install a special trading app via an APK download link and promises guaranteed 500% monthly returns through automated institutional algorithms.',
    question: 'What is taking place in this investment community?',
    options: [
      {
        id: 'a',
        text: 'It is a legitimate insider trading desk offering retail investors institutional access.',
        isCorrect: false,
        explanation: 'Guaranteed high returns do not exist in genuine financial markets. All trading carries risk.'
      },
      {
        id: 'b',
        text: 'It is a syndicated investment fraud (Pig Butchering scam). The group members are accomplices or bots, the APK is an untrusted counterfeit app with simulated profits, and invested money cannot be withdrawn.',
        isCorrect: true,
        explanation: 'Correct! Scammers create counterfeit trading apps where market charts and account balances are manipulated manually. When victims attempt to withdraw money, the scammers demand 30% "income tax" deposits before disappearing.'
      },
      {
        id: 'c',
        text: 'You should invest a small sum like ₹1,000 to test if the trading algorithm works.',
        isCorrect: false,
        explanation: 'Installing unofficial APKs compromises device security, and any deposited funds feed criminal operations.'
      },
      {
        id: 'd',
        text: 'The app must be SEBI-registered if other group members are making money.',
        isCorrect: false,
        explanation: 'Group members posting profits are either syndicate accomplices or burner accounts controlled by the scam operator.'
      }
    ],
    warningSigns: [
      'Promises of "guaranteed" or "risk-free" exorbitant returns (e.g., 500% per month)',
      'Requirement to install unofficial APK packages outside the official Google Play / Apple App Store',
      'Coordinated social proof: group members enthusiastically thanking the mentor with screenshots of luxury goods'
    ],
    takeaway: 'There is no such thing as guaranteed high financial returns. Only invest through SEBI-registered brokers downloaded from official app stores.'
  }
];
