import { EmissionsQueryBuilder } from './emissions-query-builder';

describe('EmissionsQueryBuilder.whereControlTech', () => {
  const alias = 'aud';
  const params = ['controlTechnologies'];
  const sncr = 'Selective Non-catalytic Reduction';
  const scr = 'Selective Catalytic Reduction';

  const makeQuery = () => ({
    andWhere: jest.fn().mockReturnThis(),
  });

  const extractPatterns = (sql: string): RegExp[] => {
    const out: RegExp[] = [];
    let i = 0;

    while (i < sql.length) {
      const idx = sql.indexOf('~*', i);
      if (idx === -1) break;

      let j = idx + 2;
      while (j < sql.length && sql[j] === ' ') j++;
      if (j < sql.length && sql[j] === "'") j++;
      if (j >= sql.length || sql[j] !== '(') {
        i = j;
        continue;
      }

      let depth = 0;
      let inClass = false;
      const start = j;
      let end = -1;

      for (; j < sql.length; j++) {
        const c = sql[j];
        if (inClass) {
          if (c === ']') inClass = false;
          continue;
        }
        if (c === '[') {
          inClass = true;
        } else if (c === '(') {
          depth++;
        } else if (c === ')') {
          depth--;
          if (depth === 0) {
            end = j + 1;
            break;
          }
        }
      }

      if (end > 0) {
        try {
          out.push(new RegExp(sql.substring(start, end), 'i'));
        } catch {
          // ignore non-JS-compatible regex syntax
        }
        i = end < sql.length && sql[end] === "'" ? end + 1 : end;
      } else {
        i = j;
      }
    }

    return out;
  };

  const matchesAny = (sql: string, data: string): boolean =>
    extractPatterns(sql).some(regex => regex.test(data));

  it('matches SNCR in the end position of a pipe-delimited string', () => {
    const query = makeQuery();

    EmissionsQueryBuilder.whereControlTech(query, [sncr], params, alias);

    const sql = query.andWhere.mock.calls[0][0];
    expect(
      matchesAny(
        sql,
        'Low NOx Burner Technology w/ Closed-coupled OFA|Selective Non-catalytic Reduction',
      ),
    ).toBe(true);
  });

  it('matches SNCR in the start position of a pipe-delimited string', () => {
    const query = makeQuery();

    EmissionsQueryBuilder.whereControlTech(query, [sncr], params, alias);

    const sql = query.andWhere.mock.calls[0][0];
    expect(
      matchesAny(
        sql,
        'Selective Non-catalytic Reduction|Low NOx Burner Technology w/ Separated OFA',
      ),
    ).toBe(true);
  });

  it('matches SNCR when the column value contains only that single value', () => {
    const query = makeQuery();

    EmissionsQueryBuilder.whereControlTech(query, [sncr], params, alias);

    const sql = query.andWhere.mock.calls[0][0];
    expect(matchesAny(sql, 'Selective Non-catalytic Reduction')).toBe(true);
  });

  it('does not match SNCR against an SCR-only pipe-delimited string', () => {
    const query = makeQuery();

    EmissionsQueryBuilder.whereControlTech(query, [sncr], params, alias);

    const sql = query.andWhere.mock.calls[0][0];
    expect(
      matchesAny(sql, 'Dry Low NOx Burners|Selective Catalytic Reduction'),
    ).toBe(false);
  });

  it('matches a Barry-style record when SCR and SNCR are both selected', () => {
    const query = makeQuery();

    EmissionsQueryBuilder.whereControlTech(query, [scr, sncr], params, alias);

    const sql = query.andWhere.mock.calls[0][0];
    expect(
      matchesAny(
        sql,
        'Low NOx Burner Technology w/ Closed-coupled OFA|Selective Non-catalytic Reduction',
      ),
    ).toBe(true);
  });

  it('does not add an andWhere when the control-tech filter is absent', () => {
    const query = makeQuery();

    EmissionsQueryBuilder.whereControlTech(query, undefined, params, alias);

    expect(query.andWhere).not.toHaveBeenCalled();
  });

  it('adds a predicate covering each of the four control info columns', () => {
    const query = makeQuery();

    EmissionsQueryBuilder.whereControlTech(query, [sncr], params, alias);

    expect(query.andWhere).toHaveBeenCalledTimes(1);
    const sql = query.andWhere.mock.calls[0][0];
    expect(sql).toContain('so2ControlInfo');
    expect(sql).toContain('noxControlInfo');
    expect(sql).toContain('pmControlInfo');
    expect(sql).toContain('hgControlInfo');
  });
});
