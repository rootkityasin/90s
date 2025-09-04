import React from 'react';
import { WHATSAPP_PHONE } from '../../lib/config';

export const metadata = { title: "About | 90's Legacy" };

export default function AboutPage() {
  return (
    <div className="container" style={{ marginTop:'1.5rem', marginBottom:'4rem' }}>
      <section className="panel hero-texture" style={{ padding:'2.6rem 2.2rem 2.8rem', display:'grid', gap:'2.2rem' }}>
        <header>
          <h1 className="header-accent" style={{ margin:'0 0 .8rem' }}>About 90's Legacy</h1>
          <p style={{ maxWidth:720, lineHeight:1.5, fontSize:'.9rem' }}>
            We are a sourcing & apparel solutions studio focused on cost‑smart fashion, fast sampling and reliable volume execution.
            This page is a distilled narrative version of your portfolio PDF. Replace the placeholder copy below with precise details
            (years, capacities, certifications, partner names) when ready.
          </p>
        </header>

        <Section title="Mission">
          <p>Enable emerging and established labels to build profitable, quality apparel lines by unifying design refinement, fabric development, ethical manufacturing and agile logistics under one retro‑spirited, relationship‑driven roof.</p>
        </Section>

        <Section title="Core Services">
          <ul style={listStyle}> 
            <li><strong>Fabric & Trim Sourcing:</strong> Mills + trims network, MOQs negotiation, lab dips & hand feel curation.</li>
            <li><strong>Sampling Sprint:</strong> Rapid proto → fit → pre‑production cycle with token/SKU tracking.</li>
            <li><strong>Production Management:</strong> Line planning, capacity booking, inline QC, AQL final inspection.</li>
            <li><strong>Cost Engineering:</strong> Yield optimization, fabric alternatives, process consolidation.</li>
            <li><strong>Sustainability Advisory:</strong> Preferred materials roadmap & compliance documentation.</li>
            <li><strong>Logistics Coordination:</strong> Packing standards, consolidation, freight & customs liaison.</li>
          </ul>
        </Section>

        <Section title="Why Brands Work With Us">
          <ul style={listStyle}>
            <li><strong>Speed:</strong> Sample lead times optimized (insert actual average days).</li>
            <li><strong>Transparency:</strong> SKU/token system ties every quote & sample to a traceable reference.</li>
            <li><strong>Versatility:</strong> Knit / woven / denim / specialty small runs to scalable volumes.</li>
            <li><strong>Quality Discipline:</strong> Layered QC gates (fabric, inline, final packing).</li>
            <li><strong>Negotiated Value:</strong> Strategic vendor relationships keep landed cost competitive.</li>
          </ul>
        </Section>

        <Section title="Sustainability & Ethics">
          <p>Outline your actual certifications (e.g. GOTS, BSCI, SEDEX, OEKO‑TEX) and social compliance auditing cadence here. Describe waste reduction initiatives, water / chemical management, recycling programs, worker welfare training or fair wage policies.</p>
        </Section>

        <Section title="Process Snapshot">
          <ol style={{ ...listStyle, listStyle:'decimal', paddingLeft:'1.2rem' }}>
            <li>Brief & Tech Pack Intake</li>
            <li>Fabric / Trim Matrix & Target Cost</li>
            <li>Sample Development & Fit Iterations</li>
            <li>PP Approval / Bulk Line Allocation</li>
            <li>Inline & Final QC / Compliance Docs</li>
            <li>Consolidation & Dispatch</li>
          </ol>
        </Section>

        <Section title="Milestones (Customize)">
          <ul style={listStyle}>
            <li><strong>Year Founded:</strong> (add)</li>
            <li><strong>Factories Integrated:</strong> (count) across (regions)</li>
            <li><strong>Annual Capacity:</strong> (units / categories)</li>
            <li><strong>Average Reorder Fill Rate:</strong> (percentage)</li>
          </ul>
        </Section>

        <Section title="Get In Touch">
          <p>Tap WhatsApp to start a cost discussion or request a sampling slot.</p>
          <a href={`https://wa.me/${WHATSAPP_PHONE}?text=Hi%20I%20want%20to%20discuss%20sourcing`} className="pill" style={{ background:'#008F7D', fontWeight:600 }}>Chat on WhatsApp</a>
        </Section>
      </section>
    </div>
  );
}

function Section({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <section>
      <h2 className="header-accent" style={{ fontSize:'1.6rem', margin:'0 0 .6rem' }}>{title}</h2>
      <div style={{ fontSize:'.85rem', lineHeight:1.55 }}>{children}</div>
    </section>
  );
}

const listStyle: React.CSSProperties = { margin:0, padding:0, listStyle:'none', display:'grid', gap:'.4rem', fontSize:'.82rem', lineHeight:1.45 };
