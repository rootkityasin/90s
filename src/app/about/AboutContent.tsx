"use client";

import React from 'react';
import { WHATSAPP_PHONE, WHATSAPP_WA_LINK } from '../../lib/config';

const processSteps = [
  {
    title: 'Brief & Tech Pack Intake',
    detail: 'Collect mood boards, tech packs, target costs, and launch timeline to align on scope and deliverables.',
    icon: '✍',
    palette: {
      background: 'linear-gradient(135deg, #FFE8DA 0%, #FFC6A6 100%)',
      border: '#E66F46',
      inner: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.05) 65%), repeating-linear-gradient(45deg, rgba(230,111,70,0.12) 0 6px, transparent 6px 12px)',
      strap: 'linear-gradient(90deg, #F6895A 0%, #D5512E 100%)',
      iconBg: 'radial-gradient(circle at 30% 30%, #FFB394 0%, #D5512E 75%)',
      iconRing: '#FFE2D5',
      iconColor: '#ffffff',
      shadow: '6px 6px 0 #C05032, 0 24px 40px -22px rgba(214,81,46,0.55)',
      hoverShadow: '6px 6px 0 #B64328, 0 32px 62px -28px rgba(214,81,46,0.6)',
      stepColor: '#6B2D1C',
      titleColor: '#3D160E',
      bodyColor: '#402319'
    }
  },
  {
    title: 'Fabric / Trim Matrix & Target Cost',
    detail: 'Curate mill and trim options with pricing ladders so you can pick the mix that fits margin goals.',
    icon: '✂',
    palette: {
      background: 'linear-gradient(135deg, #FFF4D2 0%, #FFE0A1 100%)',
      border: '#D79B25',
      inner: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.05) 65%), repeating-linear-gradient(45deg, rgba(215,155,37,0.12) 0 6px, transparent 6px 12px)',
      strap: 'linear-gradient(90deg, #F6B53C 0%, #D3841C 100%)',
      iconBg: 'radial-gradient(circle at 30% 30%, #FFD98A 0%, #D3841C 75%)',
      iconRing: '#FFECC2',
      iconColor: '#4B3206',
      shadow: '6px 6px 0 #C27A1D, 0 24px 40px -22px rgba(210,132,28,0.45)',
      hoverShadow: '6px 6px 0 #B77716, 0 32px 62px -28px rgba(210,132,28,0.5)',
      stepColor: '#7B4A05',
      titleColor: '#4B3206',
      bodyColor: '#574018'
    }
  },
  {
    title: 'Sample Development & Fit Iterations',
    detail: 'Coordinate proto, fit, and pre-production samples with tracked feedback loops until final approvals.',
    icon: '⚙',
    palette: {
      background: 'linear-gradient(135deg, #E1F6F2 0%, #BFE9DE 100%)',
      border: '#2F8F82',
      inner: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.08) 65%), repeating-linear-gradient(45deg, rgba(47,143,130,0.12) 0 6px, transparent 6px 12px)',
      strap: 'linear-gradient(90deg, #58C3B6 0%, #2F8F82 100%)',
      iconBg: 'radial-gradient(circle at 30% 30%, #9EE4D6 0%, #2F8F82 75%)',
      iconRing: '#CFF1EA',
      iconColor: '#064B40',
      shadow: '6px 6px 0 #2C7A70, 0 24px 40px -22px rgba(44,122,112,0.45)',
      hoverShadow: '6px 6px 0 #276F65, 0 32px 62px -28px rgba(44,122,112,0.5)',
      stepColor: '#1D5A52',
      titleColor: '#0F3C36',
      bodyColor: '#1E514B'
    }
  },
  {
    title: 'PP Approval / Bulk Line Allocation',
    detail: 'Lock production slots, confirm PP samples, and assign factories that match category expertise.',
    icon: '⚑',
    palette: {
      background: 'linear-gradient(135deg, #EDE7FF 0%, #CCC2FF 100%)',
      border: '#5E4BC6',
      inner: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.08) 65%), repeating-linear-gradient(45deg, rgba(94,75,198,0.14) 0 6px, transparent 6px 12px)',
      strap: 'linear-gradient(90deg, #8A78FF 0%, #5E4BC6 100%)',
      iconBg: 'radial-gradient(circle at 30% 30%, #CBBFFF 0%, #5E4BC6 75%)',
      iconRing: '#E3DCFF',
      iconColor: '#2B1B7A',
      shadow: '6px 6px 0 #4D3AA2, 0 24px 40px -22px rgba(77,58,162,0.45)',
      hoverShadow: '6px 6px 0 #43319A, 0 32px 62px -28px rgba(77,58,162,0.5)',
      stepColor: '#4933A3',
      titleColor: '#2D1E78',
      bodyColor: '#332753'
    }
  },
  {
    title: 'Inline & Final QC / Compliance Docs',
    detail: 'Layered QA gates and documentation keep quality consistent and audit-ready for every shipment.',
    icon: '☑',
    palette: {
      background: 'linear-gradient(135deg, #FFE4F1 0%, #FFC3DF 100%)',
      border: '#C8578B',
      inner: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.08) 65%), repeating-linear-gradient(45deg, rgba(200,87,139,0.12) 0 6px, transparent 6px 12px)',
      strap: 'linear-gradient(90deg, #F482B6 0%, #C8578B 100%)',
      iconBg: 'radial-gradient(circle at 30% 30%, #FFBAD9 0%, #C8578B 75%)',
      iconRing: '#FFD6E8',
      iconColor: '#6E2144',
      shadow: '6px 6px 0 #B04378, 0 24px 40px -22px rgba(176,67,120,0.45)',
      hoverShadow: '6px 6px 0 #9C356B, 0 32px 62px -28px rgba(176,67,120,0.5)',
      stepColor: '#8E2F5D',
      titleColor: '#5A1C3D',
      bodyColor: '#642844'
    }
  },
  {
    title: 'Consolidation & Dispatch',
    detail: 'Manage packing, carton coding, and freight coordination so orders depart on time with clear paperwork.',
    icon: '✈',
    palette: {
      background: 'linear-gradient(135deg, #E4F2FF 0%, #C7E1FF 100%)',
      border: '#3B81D3',
      inner: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.08) 65%), repeating-linear-gradient(45deg, rgba(59,129,211,0.12) 0 6px, transparent 6px 12px)',
      strap: 'linear-gradient(90deg, #6AA8FF 0%, #3B81D3 100%)',
      iconBg: 'radial-gradient(circle at 30% 30%, #A9D2FF 0%, #3B81D3 75%)',
      iconRing: '#D6E8FF',
      iconColor: '#153A6A',
      shadow: '6px 6px 0 #2F6AB0, 0 24px 40px -22px rgba(47,106,176,0.45)',
      hoverShadow: '6px 6px 0 #255896, 0 32px 62px -28px rgba(47,106,176,0.5)',
      stepColor: '#2C5E9A',
      titleColor: '#1E4170',
      bodyColor: '#244B7F'
    }
  }
];

const processGridAreas: Record<number, string> = {
  0: 'step1',
  1: 'step2',
  2: 'step3',
  3: 'step4',
  4: 'step5',
  5: 'step6'
};

const bottomStepIndices = new Set<number>([3, 4, 5]);

type AboutAudience = 'retail' | 'client';

export function AboutContent({ audience = 'retail' }: { audience?: AboutAudience }) {
  return (
    <div className="container" style={{ marginTop: '1.5rem', marginBottom: '4rem' }}>
      <section className="panel hero-texture" style={{ padding: '2.6rem 2.2rem 2.8rem', display: 'grid', gap: '2.2rem' }}>
        <header>
          <h1 className="hero-headline about-hero-title">About 90's Legacy</h1>
          <p style={{ maxWidth: 720, lineHeight: 1.5, fontSize: '.9rem', textAlign: 'center', margin: '0 auto' }}>
            A sourcing and apparel solutions studio delivering cost-smart fashion, rapid sampling, and reliable volume execution. 
            Founded in 2023, we combine textile expertise with modern production management to help brands scale profitably.
          </p>
        </header>

        <Section title="Mission">
          <p>Empower emerging and established fashion labels to build profitable, high-quality apparel lines through unified design refinement, fabric development, ethical manufacturing, and agile logistics—all delivered with a relationship-driven, solutions-focused approach.</p>
        </Section>

        <Section title="Company Overview">
          <ul style={listStyle}>
            <li><strong>Established:</strong> 2023</li>
            <li><strong>Production Capacity:</strong> Unlimited (scalable through our manufacturing network)</li>
            <li><strong>Certifications:</strong> VAT/TAX Certificate, TIN, Trade License</li>
            <li><strong>Core Team:</strong>
              <ul style={{ marginTop: '.4rem', paddingLeft: '1.2rem' }}>
                <li><strong>Mehrab Kabbo</strong> - Co-Founder & Technical Director (BSc in Textile Engineering, Merchandising Expert) (<a href="/CV_Mehrab_Kabyo_Merchandiser.pdf" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: '#008F7D', textDecoration: 'underline' }}>View CV</a>)</li>
                <li><strong>Yasin Arafat</strong> - Co-Founder & Business Development (<a href="https://yarafat.framer.website" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: '#008F7D', textDecoration: 'underline' }}>View Portfolio</a>)</li>
              </ul>
            </li>
          </ul>
        </Section>

        <Section title="Core Services">
          <ul style={listStyle}>
            <li><strong>Fabric & Trim Sourcing:</strong> Extensive mill and trim network, MOQ negotiations, lab dips, and quality hand-feel curation.</li>
            <li><strong>Rapid Sampling:</strong> Fast proto → fit → pre-production cycles with SKU/token tracking for complete transparency.</li>
            <li><strong>Production Management:</strong> Comprehensive line planning, capacity booking, inline QC, and AQL final inspection.</li>
            <li><strong>Cost Engineering:</strong> Yield optimization, fabric alternatives, and process consolidation to maximize value.</li>
            <li><strong>Compliance & Documentation:</strong> Complete certification support and regulatory compliance assistance.</li>
            <li><strong>Logistics Coordination:</strong> Professional packing standards, consolidation, freight, and customs liaison.</li>
          </ul>
        </Section>

        <Section title="Why Brands Choose Us">
          <ul style={listStyle}>
            <li><span aria-hidden="true" style={{ marginRight: '.45rem' }}>✦</span><strong>Speed:</strong> Optimized sample lead times and rapid turnaround on bulk orders.</li>
            <li><span aria-hidden="true" style={{ marginRight: '.45rem' }}>✹</span><strong>Transparency:</strong> SKU/token system providing full traceability for every quote and sample.</li>
            <li><span aria-hidden="true" style={{ marginRight: '.45rem' }}>✷</span><strong>Versatility:</strong> Knit, woven, denim, and specialty fabrics—from small runs to large-scale production.</li>
            <li><span aria-hidden="true" style={{ marginRight: '.45rem' }}>✂</span><strong>Quality Discipline:</strong> Multi-layer QC gates covering fabric inspection, inline monitoring, and final packing checks.</li>
            <li><span aria-hidden="true" style={{ marginRight: '.45rem' }}>☌</span><strong>Competitive Pricing:</strong> Strategic vendor relationships ensuring market-leading landed costs.</li>
            <li><span aria-hidden="true" style={{ marginRight: '.45rem' }}>✒</span><strong>Fully Certified:</strong> VAT/TAX compliant with proper business licensing for professional operations.</li>
          </ul>
        </Section>

        <Section title="Compliance & Quality">
          <p>
            90's Legacy operates as a fully licensed and certified business entity. We maintain VAT/TAX certification, Trade License, 
            and TIN registration, ensuring complete regulatory compliance. Our quality assurance process includes multiple inspection 
            points—from raw material receipt through final packing—to guarantee consistent standards across all deliveries.
          </p>
        </Section>

        <Section title="Process Snapshot">
          <div className="process-snapshot">
            <svg
              className="process-snapshot__loop"
              viewBox="0 0 1000 520"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M80 180 H920 Q960 180 960 220 V300 Q960 340 920 340 H80 Q40 340 40 300 V220 Q40 180 80 180 Z"
                fill="none"
                stroke="#22160c"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="process-snapshot__grid">
              {processSteps.map((step, index) => {
                const area = processGridAreas[index];
                const isBottom = bottomStepIndices.has(index);
                const palette = step.palette;
                const styleVars = {
                  gridArea: area
                } as React.CSSProperties & Record<string, string>;

                if (palette) {
                  styleVars['--process-bg'] = palette.background;
                  styleVars['--process-border'] = palette.border;
                  styleVars['--process-inner'] = palette.inner;
                  styleVars['--process-strap'] = palette.strap;
                  styleVars['--process-icon-bg'] = palette.iconBg;
                  styleVars['--process-icon-ring'] = palette.iconRing;
                  styleVars['--process-icon-color'] = palette.iconColor;
                  styleVars['--process-shadow'] = palette.shadow;
                  styleVars['--process-hover-shadow'] = palette.hoverShadow ?? palette.shadow;
                  styleVars['--process-step-color'] = palette.stepColor;
                  styleVars['--process-title-color'] = palette.titleColor;
                  styleVars['--process-body-color'] = palette.bodyColor;
                }

                return (
                  <div
                    key={step.title}
                    className={`process-card ${isBottom ? 'process-card--bottom' : 'process-card--top'}`}
                    style={styleVars}
                  >
                    <div className="process-card__icon">
                      <span>{step.icon}</span>
                    </div>
                    <span className="process-card__step">Step {String(index + 1).padStart(2, '0')}</span>
                    <h3 className="process-card__title">{step.title}</h3>
                    <p className="process-card__body">{step.detail}</p>
                    {index < processSteps.length - 1 && (
                      <span className="process-card__mobile-arrow" aria-hidden="true">↓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        <Section title="Our Journey">
          <p>
            Since our founding in 2023, 90's Legacy has established itself as a trusted partner for brands seeking 
            quality garment production with professional service. Our unlimited production capacity through strategic 
            manufacturing partnerships allows us to scale with your business needs from initial sampling to full production runs.
          </p>
        </Section>
        {audience === 'retail' && (
          <Section title="Wholesale Access">
            <p>
              Retail partners looking to review wholesale assortments or secure bulk pricing can head to our client portal.
              Visit <a href="/client" style={{ fontWeight: 600 }}>90&apos;s Client</a> to request access or log in.
            </p>
          </Section>
        )}

        <Section title="Get In Touch">
          <p>Tap WhatsApp to start a cost discussion or request a sampling slot.</p>
          <a href={`${WHATSAPP_WA_LINK}?text=Hi%20I%20want%20to%20discuss%20sourcing`} className="pill" style={{ background: '#008F7D', fontWeight: 600 }}>Chat on WhatsApp</a>
        </Section>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="about-section-title">
        {title}
      </h2>
      <div style={{ fontSize: '.85rem', lineHeight: 1.55, textAlign: 'center', margin: '0 auto', maxWidth: 760 }}>{children}</div>
    </section>
  );
}

const listStyle: React.CSSProperties = {
  margin: '0 auto',
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: '.4rem',
  fontSize: '.82rem',
  lineHeight: 1.45,
  justifyItems: 'stretch',
  textAlign: 'left',
  maxWidth: 'min(720px, 100%)'
};

