import React, { useState, useEffect } from 'react';
import { HelpCenterHero } from '../components/report/HelpCenterHero';
import { ImmediateHelpStrip } from '../components/report/ImmediateHelpStrip';
import { SmartReportingGuide } from '../components/report/SmartReportingGuide';
import { NearbyHelpDashboard } from '../components/report/NearbyHelpDashboard';
import { ReportReadinessAssistant } from '../components/report/ReportReadinessAssistant';
import { IncidentSummaryBuilder } from '../components/report/IncidentSummaryBuilder';
import { OfficialReportingSection } from '../components/report/OfficialReportingSection';
import { SafetyRemindersSection } from '../components/report/SafetyRemindersSection';
import { CyberSafeDisclaimerSection } from '../components/report/CyberSafeDisclaimerSection';
import { REPORT_CATEGORIES } from '../data/reportData';

export interface ReportPageProps {
  initialIncidentId?: string;
  initialUrl?: string;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  initialIncidentId,
  initialUrl,
}) => {
  // Selected incident category for guide and summary builder
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    if (initialIncidentId) {
      const match = REPORT_CATEGORIES.find(
        (c) => c.id === initialIncidentId || c.title.toLowerCase().includes(initialIncidentId.toLowerCase())
      );
      if (match) return match.id;
    }
    return 'financial-fraud';
  });

  // State for Report Ready Checklist (synchronized with Summary Builder)
  const [checkedEvidenceIds, setCheckedEvidenceIds] = useState<string[]>(() => {
    // If an initialUrl was passed from Detect, pre-check the URL evidence item
    if (initialUrl) return ['url'];
    return ['datetime', 'description'];
  });

  // Category name for Summary Builder
  const [summaryCategoryTitle, setSummaryCategoryTitle] = useState<string>(() => {
    const cat = REPORT_CATEGORIES.find((c) => c.id === selectedCategoryId);
    return cat ? cat.title : 'Financial Fraud';
  });

  // URL passed from Detect
  const [prefilledUrl, setPrefilledUrl] = useState<string | undefined>(initialUrl);

  // Sync if initialIncidentId or initialUrl prop updates
  useEffect(() => {
    if (initialIncidentId) {
      const match = REPORT_CATEGORIES.find(
        (c) => c.id === initialIncidentId || c.title.toLowerCase().includes(initialIncidentId.toLowerCase())
      );
      if (match) {
        setSelectedCategoryId(match.id);
        setSummaryCategoryTitle(match.title);
      }
    }
  }, [initialIncidentId]);

  useEffect(() => {
    if (initialUrl) {
      setPrefilledUrl(initialUrl);
      setCheckedEvidenceIds((prev) => (prev.includes('url') ? prev : [...prev, 'url']));
      setSelectedCategoryId('suspicious-website');
      setSummaryCategoryTitle('Suspicious Website');
    }
  }, [initialUrl]);

  // Smooth scroll helpers
  const scrollToElement = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleEvidenceItem = (id: string) => {
    setCheckedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetEvidence = () => {
    setCheckedEvidenceIds([]);
  };

  const handlePrepareSummaryWithCategory = (categoryTitle: string) => {
    setSummaryCategoryTitle(categoryTitle);
    scrollToElement('incident-summary-builder');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 1. Hero Section */}
      <HelpCenterHero
        onScrollToReport={() => scrollToElement('official-reporting-options')}
        onScrollToMap={() => scrollToElement('nearby-help-dashboard')}
        onScrollToGuide={() => scrollToElement('smart-reporting-guide')}
      />

      {/* 2. Immediate Help Strip */}
      <ImmediateHelpStrip
        onSelectCategory={(categoryId) => {
          setSelectedCategoryId(categoryId);
          const cat = REPORT_CATEGORIES.find((c) => c.id === categoryId);
          if (cat) setSummaryCategoryTitle(cat.title);
          scrollToElement('smart-reporting-guide');
        }}
      />

      {/* 3. Smart Reporting Guide ("What happened?") */}
      <SmartReportingGuide
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          const cat = REPORT_CATEGORIES.find((c) => c.id === catId);
          if (cat) setSummaryCategoryTitle(cat.title);
        }}
        onPrepareSummaryWithCategory={handlePrepareSummaryWithCategory}
      />

      {/* 4 & 5. Nearby Help Live Map Dashboard & Results */}
      <NearbyHelpDashboard />

      {/* 6 & 7. Report Ready Assistant (Checklist & Evidence Security) */}
      <ReportReadinessAssistant
        checkedItemIds={checkedEvidenceIds}
        onToggleItem={handleToggleEvidenceItem}
        onResetItems={handleResetEvidence}
        onScrollToSummaryBuilder={() => scrollToElement('incident-summary-builder')}
      />

      {/* 8. Incident Summary Builder */}
      <IncidentSummaryBuilder
        initialCategory={summaryCategoryTitle}
        initialUrl={prefilledUrl}
        checkedEvidenceIds={checkedEvidenceIds}
      />

      {/* 9. Official Reporting Options in India */}
      <OfficialReportingSection />

      {/* 10. Safety Reminders ("Before you report: What NOT to do") */}
      <SafetyRemindersSection />

      {/* 11. CyberSafe Boundaries & Public Service Disclaimer */}
      <CyberSafeDisclaimerSection />
    </div>
  );
};
