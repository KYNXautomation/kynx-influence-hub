import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="public-foot">
      <Link className="wordmark" href="/">KYN<span>X.</span></Link>
      <p>KYNX Influence Hub · Creator campaigns, made clear</p>
      <Link href="/workspace">Explore the management demo</Link>
    </footer>
  );
}

export function StepGrid({ steps }) {
  return (
    <div className="step-grid">
      {steps.map(([title, text], index) => (
        <article className="panel" key={title}>
          <p className="eyebrow">0{index + 1}</p>
          <h3>{title}</h3>
          <p className="meta">{text}</p>
        </article>
      ))}
    </div>
  );
}
