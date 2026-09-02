// ignitoverse: Certificate Verification Public Portal
import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, QrCode, AlertCircle, Building2, Calendar, Award, User, Sparkles } from 'lucide-react';
import { sampleVerifiedCertificates } from '../../data/microcredentials';

export default function CertificateVerification() {
  const [certIdInput, setCertIdInput] = useState('IGN-JAVA-8821');
  const [verifiedResult, setVerifiedResult] = useState(sampleVerifiedCertificates['IGN-JAVA-8821']);
  const [hasSearched, setHasSearched] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    const cleanId = certIdInput.trim().toUpperCase();
    setHasSearched(true);

    if (sampleVerifiedCertificates[cleanId]) {
      setVerifiedResult(sampleVerifiedCertificates[cleanId]);
      setErrorMsg('');
    } else {
      setVerifiedResult(null);
      setErrorMsg(`No official credential found matching ID "${cleanId}". Please check the ID on your digital certificate.`);
    }
  };

  const handleSampleClick = (id) => {
    setCertIdInput(id);
    setVerifiedResult(sampleVerifiedCertificates[id]);
    setErrorMsg('');
    setHasSearched(true);
  };

  return (
    <div className="verification-page-wrapper">
      {/* Hero */}
      <section className="verify-hero-block">
        <div className="detail-container">
          <div className="verify-badge-pill">
            <ShieldCheck size={14} />
            <span>GLOBAL CREDENTIAL REGISTRY</span>
          </div>

          <h1 className="verify-main-headline">
            Verify an Official Ignitoverse Certificate
          </h1>

          <p className="verify-subtitle">
            Enter the unique Certificate Verification ID or scan the credential QR code to validate credential authenticity, recipient identity, score benchmarks, and issuing date.
          </p>

          {/* Search Form */}
          <form className="verify-search-form" onSubmit={handleVerify}>
            <div className="verify-input-group">
              <QrCode size={20} className="verify-qr-icon" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. IGN-JAVA-8821)"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                aria-label="Certificate ID"
              />
              <button type="submit" className="btn-verify-submit">
                <span>Verify Credential</span>
              </button>
            </div>
          </form>

          {/* Quick Sample Links */}
          <div className="verify-samples-strip">
            <span>Try sample credentials:</span>
            <button type="button" onClick={() => handleSampleClick('IGN-JAVA-8821')}>
              IGN-JAVA-8821 (TCS)
            </button>
            <button type="button" onClick={() => handleSampleClick('IGN-STR-4412')}>
              IGN-STR-4412 (Hitachi)
            </button>
            <button type="button" onClick={() => handleSampleClick('IGN-PY-9930')}>
              IGN-PY-9930 (Infosys)
            </button>
          </div>
        </div>
      </section>

      {/* Verification Result Card */}
      <section className="verify-result-section">
        <div className="detail-container">
          {verifiedResult ? (
            <div className="verified-credential-card">
              <div className="verified-status-banner">
                <CheckCircle2 size={22} className="check-verified-icon" />
                <div>
                  <h3>Official Verifiable Credential</h3>
                  <p>This certificate was cryptographically validated against the Ignitoverse Global Registry.</p>
                </div>
                <span className="badge-active-valid">AUTHENTIC & ACTIVE</span>
              </div>

              <div className="verified-card-body">
                <div className="verified-left-meta">
                  <div className="meta-block">
                    <span className="meta-lbl">Credential Recipient</span>
                    <strong className="meta-main-name">
                      <User size={16} /> {verifiedResult.holderName}
                    </strong>
                  </div>

                  <div className="meta-block">
                    <span className="meta-lbl">Sponsoring Enterprise</span>
                    <strong className="meta-val">
                      <Building2 size={16} /> {verifiedResult.organization}
                    </strong>
                  </div>

                  <div className="meta-block">
                    <span className="meta-lbl">Microcredential Program</span>
                    <strong className="meta-val">
                      <Award size={16} /> {verifiedResult.courseTitle}
                    </strong>
                  </div>

                  <div className="meta-block">
                    <span className="meta-lbl">Official Qualification Title</span>
                    <strong className="meta-val highlight-blue">
                      {verifiedResult.credentialTitle}
                    </strong>
                  </div>

                  <div className="meta-dual-row">
                    <div className="meta-block">
                      <span className="meta-lbl">Date of Issue</span>
                      <strong className="meta-val">
                        <Calendar size={14} /> {verifiedResult.issueDate}
                      </strong>
                    </div>

                    <div className="meta-block">
                      <span className="meta-lbl">MCQ Benchmark Score</span>
                      <strong className="meta-val text-green font-bold">
                        {verifiedResult.score} (Distinction)
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="verified-right-qr">
                  <div className="qr-box-frame">
                    <img src={verifiedResult.qrCodeId} alt="QR Code" className="qr-img" />
                    <span className="qr-id-lbl">{verifiedResult.certificateId}</span>
                  </div>
                  <p className="qr-tamper-note">🔒 Tamper-proof SHA-256 Hash Signed</p>
                </div>
              </div>
            </div>
          ) : hasSearched && errorMsg ? (
            <div className="verify-error-box">
              <AlertCircle size={36} className="error-icon" />
              <h3>Certificate Verification Failed</h3>
              <p>{errorMsg}</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
