import { PRESENTERS, TEAM_ALPHABETICAL } from '../content/presenters';

/** Integrantes con su color asignado. Los nombres solo aparecen en la carátula (y en el cierre). */
export function TeamList({ withCodes = false }: { withCodes?: boolean }) {
  return (
    <ul className={`team-list ${withCodes ? 'team-list--codes' : ''}`}>
      {TEAM_ALPHABETICAL.map((id) => {
        const p = PRESENTERS[id];
        return (
          <li key={id} style={{ ['--presenter' as string]: p.color }}>
            <span className="team-list__dot" />
            <span className="team-list__name">{p.fullName}</span>
            {withCodes && <span className="team-list__code">{p.code}</span>}
          </li>
        );
      })}
    </ul>
  );
}
