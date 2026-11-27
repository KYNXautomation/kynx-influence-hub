import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter } from "../../components/PublicFooter";
import { aboutCopy, principles } from "../../lib/brandSite";
import { departments, leadership } from "../../lib/team";

export const metadata = { title: "About · KYNX Influence Hub" };

function People({ people, large = false }) {
  return (
    <ul className={large ? "team-people large" : "team-people"}>
      {people.map((person) => (
        <li key={`${person.name}-${person.title}`}>
          <strong>{person.name}</strong>
          <small>{person.title}</small>
        </li>
      ))}
    </ul>
  );
}

// Laid out like cornerstoneent.ph/about: a short "About us" on light, then the team on a dark band.
export default function AboutPage() {
  const groups = departments.filter((group) => group.people.length);
  return (
    <PublicFrame>
      <main>
        <section className="landing about-intro">
          <h1>About us</h1>
          <p className="lede">{aboutCopy}</p>
        </section>
        <section className="about-band">
          <div className="about-band-inner">
            {leadership.length ? <People people={leadership} large /> : null}
            {groups.map((group) => (
              <section key={group.name} className="about-group">
                <h2>{group.name}</h2>
                <People people={group.people} />
              </section>
            ))}
            <section className="about-group">
              <h2>How we work</h2>
              <ul className="about-values">
                {principles.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
