'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  RefreshCw,
  Table,
  Layers,
} from 'lucide-react';
import { ClayCard } from '../ui/ClayCard';
import { ClayBadge } from '../ui/ClayBadge';
import { ClayButton } from '../ui/ClayButton';
import {
  CSVValidationReport,
  validateStudentCSV,
  commitCSVStudentImport,
} from '@/lib/data/admin';

export function CSVImporter() {
  const [report, setReport] = useState<CSVValidationReport | null>(null);
  const [csvRawText, setCsvRawText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample CSV with valid and flawed rows for testing
  const sampleCSV = [
    'reg_no,full_name,section,cgpa,attendance_pct,backlogs',
    '"241FA18080","Kunal Deshmukh","A","8.4","82.0","0"',
    '"241FA18081","Priyanka Sharma","A","7.9","78.5","0"',
    '"241FA18082","Vikas Patel","B","11.5","64.0","1"',      // Error: CGPA > 10.0
    '"241FA18083","Rohan Joshi","B","6.8","105.0","2"',       // Error: Attendance > 100
    '"241FA18080","Duplicate Kunal","A","8.4","82.0","0"',     // Error: Duplicate reg_no
    '"241FA18084","Harsh Mehta","C","9.1","90.0","0"',
    '"241FA18085","Suhani Sen","C","5.9","45.0","-1"',        // Error: Backlogs negative
    '"241FA18086","Zoya Khan","C","8.7","85.0","0"',
  ].join('\n');

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CampusPulse_Students_Ingestion_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunValidation = (text: string) => {
    setImportSuccess(null);
    setCsvRawText(text);
    const rep = validateStudentCSV(text);
    setReport(rep);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleRunValidation(text);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCommit = async () => {
    if (!report || report.valid_records.length === 0) return;
    setImporting(true);
    const res = await commitCSVStudentImport(report.valid_records);
    setImporting(false);
    setImportSuccess(`Successfully ingested and synchronized ${res.imported_count} student profiles into the institutional cohort database.`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <ClayBadge variant="teal" icon={<Upload className="h-3.5 w-3.5" />}>
              Data Ingestion Engine
            </ClayBadge>
            <ClayBadge variant="indigo" size="sm">Schema Zod Verification</ClayBadge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--clay-text)] tracking-tight">
            CSV Cohort Importer & Pre-Ingestion Validator
          </h2>
          <p className="text-xs sm:text-sm text-[var(--clay-muted)]">
            Audited bulk telemetry ingestion with automated row-level constraint checks, deduplication, and anomaly reporting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ClayButton variant="default" size="sm" onClick={handleDownloadSample}>
            <Download className="h-3.5 w-3.5 text-[#5B6CFF]" />
            <span>Download Sample CSV</span>
          </ClayButton>
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FF7A59] text-white font-heading font-extrabold text-xs shadow-[var(--shadow-clay-coral)] hover:opacity-95 active:scale-95 transition-all">
              <Upload className="h-3.5 w-3.5" />
              Upload & Validate CSV
            </span>
          </label>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{importSuccess}</span>
        </div>
      )}

      {/* CSV Input / Paste Testing Tray */}
      <ClayCard className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-base text-[var(--clay-text)] flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#5B6CFF]" />
            <span>CSV Source Data</span>
          </h3>
          <button
            type="button"
            onClick={() => handleRunValidation(sampleCSV)}
            className="text-xs font-bold text-[#FF7A59] hover:underline"
          >
            Load Sample Test Data (with Intentional Anomalies)
          </button>
        </div>

        <textarea
          rows={5}
          value={csvRawText}
          onChange={(e) => handleRunValidation(e.target.value)}
          placeholder="Paste raw CSV content here or upload a file above..."
          className="w-full rounded-2xl bg-[var(--clay-card)] border border-[var(--clay-border)] text-[var(--clay-text)] font-mono text-xs p-3.5 shadow-[var(--shadow-clay-input)] outline-none resize-none focus:ring-2 focus:ring-[#FF7A59]"
        />
      </ClayCard>

      {/* Validation Report Card */}
      {report && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Summary Stat Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ClayCard className="p-4 text-center">
              <span className="text-[10px] font-heading font-extrabold text-[var(--clay-muted)] uppercase block">
                Total Rows Evaluated
              </span>
              <span className="font-heading font-black text-2xl text-[var(--clay-text)] tabular-nums">
                {report.total_rows}
              </span>
            </ClayCard>

            <ClayCard className="p-4 text-center bg-emerald-500/5 border-emerald-500/30">
              <span className="text-[10px] font-heading font-extrabold text-emerald-600 dark:text-emerald-400 uppercase block">
                Validated Rows (OK)
              </span>
              <span className="font-heading font-black text-2xl text-emerald-600 dark:text-emerald-400 tabular-nums">
                {report.valid_rows_count}
              </span>
            </ClayCard>

            <ClayCard className="p-4 text-center bg-rose-500/5 border-rose-500/30">
              <span className="text-[10px] font-heading font-extrabold text-rose-500 uppercase block">
                Rejected Rows (Failed)
              </span>
              <span className="font-heading font-black text-2xl text-rose-600 dark:text-rose-400 tabular-nums">
                {report.failed_rows_count}
              </span>
            </ClayCard>
          </div>

          {/* Detailed Error Table (if errors exist) */}
          {report.errors.length > 0 && (
            <ClayCard className="p-5 space-y-3 border-rose-500/30 bg-rose-500/5">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-heading font-extrabold text-sm">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span>Validation Anomaly Report ({report.errors.length} Issues Flagged)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[var(--clay-muted)] font-heading font-extrabold uppercase border-b border-rose-500/20">
                    <tr>
                      <th className="py-2.5 px-3">Row #</th>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Violation Rule</th>
                      <th className="py-2.5 px-3">Submitted Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-500/15 font-semibold text-rose-900 dark:text-rose-200">
                    {report.errors.map((err, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-mono font-bold">Line {err.row}</td>
                        <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">{err.field}</td>
                        <td className="py-2.5 px-3">{err.error}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] bg-rose-500/10 rounded">{err.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ClayCard>
          )}

          {/* Valid Records Preview & Commit Bar */}
          {report.valid_rows_count > 0 && (
            <ClayCard className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--clay-border)]">
                <div>
                  <h4 className="font-heading font-extrabold text-base text-[var(--clay-text)]">
                    Valid Telemetry Records Ready to Commit ({report.valid_rows_count})
                  </h4>
                  <p className="text-xs text-[var(--clay-muted)]">
                    Passed all constraint audits, uniqueness checks, and schema sanitization.
                  </p>
                </div>

                <ClayButton
                  variant="coral"
                  size="md"
                  onClick={handleCommit}
                  disabled={importing}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{importing ? 'Committing...' : `Commit ${report.valid_rows_count} Valid Profiles`}</span>
                </ClayButton>
              </div>

              {/* Sample Table of Valid Rows */}
              <div className="overflow-x-auto max-h-48">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--clay-pressed)] text-[var(--clay-muted)] font-heading font-extrabold uppercase">
                    <tr>
                      <th className="py-2 px-3">Reg No</th>
                      <th className="py-2 px-3">Full Name</th>
                      <th className="py-2 px-3">Section</th>
                      <th className="py-2 px-3">CGPA</th>
                      <th className="py-2 px-3">Attendance</th>
                      <th className="py-2 px-3">Backlogs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--clay-border)]">
                    {report.valid_records.slice(0, 5).map((rec, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-mono font-bold text-[var(--clay-text)]">{rec.reg_no}</td>
                        <td className="py-2 px-3 font-bold">{rec.full_name}</td>
                        <td className="py-2 px-3">{rec.section}</td>
                        <td className="py-2 px-3 tabular-nums">{rec.cgpa}</td>
                        <td className="py-2 px-3 tabular-nums text-emerald-600">{rec.attendance_pct}%</td>
                        <td className="py-2 px-3 tabular-nums">{rec.backlogs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ClayCard>
          )}
        </div>
      )}
    </div>
  );
}
