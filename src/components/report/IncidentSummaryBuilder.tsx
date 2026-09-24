import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
  Calendar,
  Clock,
  DollarSign,
  Link2,
  User,
  MapPin,
} from 'lucide-react';
import { IncidentSummaryInput } from '../../types';
import { REPORT_PREPARATION_CHECKLIST } from '../../data/reportData';

interface IncidentSummaryBuilderProps {
  initialCategory?: string;
  initialUrl?: string;
  checkedEvidenceIds: string[];
}

export const IncidentSummaryBuilder: React.FC<IncidentSummaryBuilderProps> = ({
  initialCategory,
  initialUrl,
  checkedEvidenceIds,
}) => {
  // Form State
  const [category, setCategory] = useState(initialCategory || 'Financial Fraud');
  const [incidentDate, setIncidentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [incidentTime, setIncidentTime] = useState('14:30');
  const [platform, setPlatform] = useState('');
  const [suspectContact, setSuspectContact] = useState('');
  const [financialAmount, setFinancialAmount] = useState('');
  const [suspectUrlOrPhone, setSuspectUrlOrPhone] = useState(initialUrl || '');
  const [narrative, setNarrative] = useState('');

  // Copy & Download Feedback
  const [isCopied, setIsCopied] = useState(false);

  // Update if initialCategory or initialUrl changes
  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialUrl) setSuspectUrlOrPhone(initialUrl);
  }, [initialUrl]);

  // Build the clean structured text
  const generateFormattedSummary = (): string => {
    const evidenceLabels = REPORT_PREPARATION_CHECKLIST.filter((item) =>
      checkedEvidenceIds.includes(item.id)
    ).map((item) => item.label);

    const lines: string[] = [
      '=================================================================',
      'CYBERCRIME INCIDENT PREPARATION SUMMARY',
      'Prepared for submission to 1930 / cybercrime.gov.in / Local Police',
      '=================================================================',
      '',
      `1. INCIDENT CLASSIFICATION: ${category || 'Cybercrime Incident'}`,
      `2. DATE & APPROXIMATE TIME: ${incidentDate} at ${incidentTime} IST`,
      `3. PLATFORM / MEDIUM INVOLVED: ${platform.trim() || 'Not specified'}`,
      `4. SUSPECT CONTACT / SENDER ID: ${suspectContact.trim() || 'Not specified'}`,
      `5. SUSPECT URL / PHONE / IDENTIFIER: ${suspectUrlOrPhone.trim() || 'None recorded'}`,
      `6. FINANCIAL LOSS INVOLVED: ${financialAmount.trim() ? `INR ${financialAmount.trim()}` : 'No direct monetary loss reported'}`,
      '',
      '-----------------------------------------------------------------',
      '7. FACTUAL DESCRIPTION OF WHAT HAPPENED:',
      '-----------------------------------------------------------------',
      narrative.trim() || 'No detailed narrative provided yet.',
      '',
      '-----------------------------------------------------------------',
      '8. EVIDENCE ITEMS SECURED LOCALLY ON VICTIM DEVICE:',
      '-----------------------------------------------------------------',
      evidenceLabels.length > 0
        ? evidenceLabels.map((lbl, idx) => `[X] (${idx + 1}) ${lbl}`).join('\n')
        : 'No specific evidence items marked in checklist yet.',
      '',
      '=================================================================',
      'PREPARATION & PRIVACY NOTICE:',
      'This document was prepared locally by the user using the CyberSafe',
      'Incident Assistance tool. CyberSafe is an independent academic initiative',
      'and does NOT submit complaints. This summary contains no user passwords or PINs.',
      '=================================================================',
    ];

    return lines.join('\n');
  };

  const formattedText = generateFormattedSummary();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberSafe-Incident-Summary-${incidentDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setCategory('Financial Fraud');
    setPlatform('');
    setSuspectContact('');
    setFinancialAmount('');
    setSuspectUrlOrPhone('');
    setNarrative('');
  };

  return (
    <section id="incident-summary-builder" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-md border border-blue-200">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>Incident Summary Builder</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Build a report summary.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organize your facts into a clear, chronological statement. You can read this to the 1930 operator, paste it into the official government portal, or print it for a written police complaint.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 transition cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>
        </div>

        {/* Builder Layout: Input Form on Left (7 cols), Live Formatted Output on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Incident Information Fields
            </h3>

            {/* Category & Date/Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Incident Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Financial Fraud">Financial Fraud</option>
                  <option value="UPI / Payment Fraud">UPI / Payment Fraud</option>
                  <option value="Phishing">Phishing</option>
                  <option value="Suspicious Website">Suspicious Website</option>
                  <option value="Hacked Account">Hacked Account</option>
                  <option value="Social Media Abuse">Social Media Abuse</option>
                  <option value="Identity Theft">Identity Theft</option>
                  <option value="Cyberstalking / Harassment">Cyberstalking / Harassment</option>
                  <option value="Malware / Ransomware">Malware / Ransomware</option>
                  <option value="Digital Arrest / Impersonation">Digital Arrest / Impersonation</option>
                  <option value="Other Incident">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Date of Occurrence</label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Approximate Time</label>
                <input
                  type="time"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Platform & Suspect Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Where did it happen?</label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. WhatsApp, Instagram, Net Banking, SMS"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Who contacted you?</label>
                <input
                  type="text"
                  value={suspectContact}
                  onChange={(e) => setSuspectContact(e.target.value)}
                  placeholder="e.g. Posed as CBI Officer, fake courier desk"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Financial Loss & Suspect Link/Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Amount involved (INR) <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={financialAmount}
                  onChange={(e) => setFinancialAmount(e.target.value)}
                  placeholder="e.g. 25,000 (leave blank if none)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Suspect URL, Phone, or ID
                </label>
                <input
                  type="text"
                  value={suspectUrlOrPhone}
                  onChange={(e) => setSuspectUrlOrPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or https://fake-site.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Narrative */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Factual Narrative (What happened step-by-step?)
              </label>
              <textarea
                rows={4}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Briefly state what occurred in order: 'I received a message claiming my electricity bill was unpaid. I called the number and the caller sent me an APK link. After installing, an unauthorized debit of Rs 15,000 occurred...'"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Evidence items note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>
                Evidence items linked from checklist: <strong>{checkedEvidenceIds.length} secured</strong>
              </span>
              <span className="text-[11px] text-blue-700 font-bold">
                Auto-synced into summary
              </span>
            </div>
          </div>

          {/* Live Formatted Output Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Generated Incident Summary
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Ready to Copy
                </span>
              </div>

              {/* Formatted Output Area */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-[380px] overflow-y-auto leading-relaxed select-all">
                {formattedText}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  title="Download as .txt"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Advisory Boundary Note */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Preparation Notice:</span>
              </div>
              <p className="leading-relaxed">
                This structured text is for your own reporting convenience. CyberSafe does not submit or forward complaints to law enforcement. You must lodge the complaint directly with 1930, your bank, or cybercrime.gov.in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
