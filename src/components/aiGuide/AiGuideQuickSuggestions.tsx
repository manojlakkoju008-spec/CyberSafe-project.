import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useAiGuide } from '../../context/AiGuideContext';

export const AiGuideQuickSuggestions: React.FC = () => {
  const { sendMessage, activeContextPage } = useAiGuide();

  const getSuggestions = () => {
    switch (activeContextPage) {
      case 'detect':
        return [
          'How do I know if this website is real?',
          'What is a homograph / punycode attack?',
          'I clicked a suspicious link. What should I do now?',
          'Why are short links dangerous?',
        ];
      case 'report':
        return [
          'I lost money through UPI. What immediate steps should I take?',
          'What evidence is required when calling 1930?',
          'Someone is threatening me online with private photos.',
          'How does the Golden Hour work for interbank liens?',
        ];
      case 'learn':
        return [
          'Teach me how phishing works.',
          'What is Zero Trust for everyday users?',
          'How can I protect my parents from online scams?',
          'What should I learn about cybersecurity?',
        ];
      case 'prevent':
        return [
          'How should I set up strong passwords and MFA?',
          'What should I do if someone is asking for my Aadhaar?',
          'My phone is infected with a suspicious APK.',
          'How do I secure my WhatsApp and social media?',
        ];
      case 'quiz':
        return [
          'What are the most common phishing red flags?',
          'How do attackers impersonate banks?',
          'What is the difference between phishing and smishing?',
          'Give me a real-world scam scenario to test.',
        ];
      default:
        return [
          'I received a message saying my bank account will be blocked.',
          'My Instagram account was hacked.',
          'I gave someone my OTP by mistake.',
          'I lost money through UPI.',
          'How do I know if this website is real?',
          'Teach me how phishing works.',
        ];
    }
  };

  const suggestions = getSuggestions();

  return (
    <div className="p-3.5 bg-[#F7F9FC] border-t border-[#E5E7EB]">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B1F33] mb-2 uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-[#1261A0]" />
        <span>Quick Questions & Scenarios</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(s)}
            className="text-xs bg-white hover:bg-[#F7F9FC] text-[#14202B] hover:text-[#1261A0] px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#1261A0] transition-colors cursor-pointer text-left flex items-center gap-1 group shadow-2xs"
          >
            <span className="truncate max-w-[280px]">{s}</span>
            <ArrowUpRight className="w-3 h-3 text-[#667085] group-hover:text-[#1261A0] shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
