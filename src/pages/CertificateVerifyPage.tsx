import React, { useEffect, useState } from 'react';
import { Certificate } from '../types/index';
import { api } from '../services/api';
import { Award, CheckCircle2, Search, Printer, ArrowLeft } from 'lucide-react';

interface CertificateVerifyPageProps {
  initialCode?: string;
  onNavigate: (route: string) => void;
}

export const CertificateVerifyPage: React.FC<CertificateVerifyPageProps> = ({ initialCode = '', onNavigate }) => {
  const [code, setCode] = useState(initialCode);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  const handleVerify = async (queryCode: string) => {
    if (!queryCode.trim()) return;
    setIsSearching(true);
    setErrorMessage('');

    try {
      const res = await api.verifyCertificate(queryCode.trim());
      setCertificate(res.certificate);
    } catch (err: any) {
      setErrorMessage(err.message || 'Certificate code not found');
      setCertificate(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-4">
        <div>
          <button
            onClick={() => onNavigate('/academy')}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#7A7469] hover:text-[#1A1A1A] mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Academy
          </button>
          <h1 className="font-serif text-3xl text-[#1A1A1A]">Official Credential Registry</h1>
        </div>

        <span className="text-xs text-[#7A7469]">Verifiable Ledger</span>
      </div>

      {/* Code Search Input */}
      <div className="p-6 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs space-y-3">
        <label className="block text-xs uppercase tracking-wider text-[#666] font-semibold">
          Enter Certificate Verification Identifier:
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. CERT-2026-ATELIER-01"
              className="w-full bg-white border border-[#D8D2C5] pl-9 pr-3 py-2 text-xs text-[#1A1A1A] font-mono rounded"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5 pointer-events-none" />
          </div>
          <button
            onClick={() => handleVerify(code)}
            disabled={isSearching}
            className="px-6 py-2 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#333] transition-colors"
          >
            {isSearching ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-[#991B1B] font-medium pt-1">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Credential Certificate View */}
      {certificate && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-[#3F7535] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Authenticity Verified by Atelier Official Registry</span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 border border-[#D8D2C5] bg-white text-xs text-[#1A1A1A] rounded hover:bg-[#F5F2EB] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print Diploma
            </button>
          </div>

          {/* Luxury Certificate Layout */}
          <div className="bg-[#FCFBF8] border-8 border-double border-[#C2A676] p-8 sm:p-14 text-center space-y-8 shadow-2xl relative overflow-hidden">
            {/* Subtle corner watermark accents */}
            <div className="absolute top-2 left-2 text-[#C2A676]/30 text-xs">◆ ◆ ◆</div>
            <div className="absolute top-2 right-2 text-[#C2A676]/30 text-xs">◆ ◆ ◆</div>
            <div className="absolute bottom-2 left-2 text-[#C2A676]/30 text-xs">◆ ◆ ◆</div>
            <div className="absolute bottom-2 right-2 text-[#C2A676]/30 text-xs">◆ ◆ ◆</div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#8C7A54] font-semibold block">
                Atelier & Académie de Haute Couture
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide uppercase font-medium">
                Diploma of Technical Mastery
              </h2>
              <p className="text-xs text-[#7A7469] italic">
                Paris · London · Milan
              </p>
            </div>

            <div className="space-y-2 py-4 border-y border-[#E8E2D5] max-w-xl mx-auto">
              <p className="text-xs text-[#7A7469] uppercase tracking-widest">
                This is to officially certify that
              </p>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] italic">
                {certificate.studentName}
              </h3>
              <p className="text-xs text-[#554F44] leading-relaxed pt-2">
                has successfully fulfilled all technical requirements, pattern drafting specifications,
                and master toile critiques for the program:
              </p>
              <h4 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-semibold pt-1">
                {certificate.courseTitle}
              </h4>
            </div>

            {/* Seal & Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-4 max-w-2xl mx-auto text-xs">
              <div className="space-y-1">
                <span className="font-serif italic text-lg text-[#1A1A1A] block underline decoration-[#C2A676]/60">
                  {certificate.instructorName}
                </span>
                <span className="text-[10px] text-[#7A7469] block">{certificate.instructorTitle}</span>
              </div>

              {/* Gold Seal Graphic */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C2A676] bg-[#FAF5EB] flex items-center justify-center text-[#C2A676] shadow-sm">
                  <Award className="w-8 h-8 stroke-[1.5]" />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#C2A676] font-bold mt-1">
                  OFFICIAL ATELIER SEAL
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-xs text-[#1A1A1A] block">
                  {certificate.issueDate}
                </span>
                <span className="text-[10px] text-[#7A7469] block">Conferral Date · Grade: {certificate.grade}</span>
              </div>
            </div>

            <div className="pt-4 text-[10px] text-[#8C8476] font-mono tracking-wider">
              Registry Credential ID: {certificate.certificateCode}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
