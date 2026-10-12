#!/usr/bin/env node
// Copies the GraphQL schema and demo data from the sibling backend repo
// (job-winner) into src/dev/mockApi, for `npm run dev:mock`.
//
// usage: node scripts/sync-mock-data.mjs [path-to-job-winner]
//        (defaults to ../job-winner, or $JOB_WINNER_DIR)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backend = resolve(
  process.argv[2] || process.env.JOB_WINNER_DIR || join(root, '../job-winner')
);
const resources = join(backend, 'src/main/resources');
const out = join(root, 'src/dev/mockApi');

if (!existsSync(join(resources, 'demo-data.sql'))) {
  console.error(`demo-data.sql not found under ${resources}`);
  process.exit(1);
}

// --- Minimal SQL reader for demo-data.sql (UPDATE ... SET / INSERT ... VALUES).

const stripComments = sql => sql.replace(/--[^\n]*/g, '');

// Splits a VALUES list or SET list into tokens, honoring quoted strings.
function* tokens(text) {
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
    } else if (ch === "'") {
      let value = '';
      i++;
      while (i < text.length) {
        if (text[i] === "'" && text[i + 1] === "'") {
          value += "'";
          i += 2;
        } else if (text[i] === "'") {
          i++;
          break;
        } else {
          value += text[i++];
        }
      }
      yield { type: 'string', value };
    } else if ('(),=;'.includes(ch)) {
      yield { type: ch };
      i++;
    } else {
      const match = /^[^\s(),=;']+(\s*[+-]\s*\d+)?/.exec(text.slice(i));
      yield { type: 'word', value: match[0].replace(/\s+/g, '') };
      i += match[0].length;
    }
  }
}

// CURRENT_DATE ± n becomes { dayOffset: n } so dates stay relative to today.
const literal = token => {
  if (token.type === 'string') return token.value;
  const date = /^CURRENT_DATE([+-]\d+)?$/i.exec(token.value);
  if (date) return { dayOffset: Number(date[1] || 0) };
  if (/^-?\d+$/.test(token.value)) return Number(token.value);
  if (/^null$/i.test(token.value)) return null;
  throw new Error(`Unsupported SQL value: ${token.value}`);
};

const camel = column => column.replace(/_(\w)/g, (_, c) => c.toUpperCase());

function parseInserts(sql) {
  const tables = {};
  const insert = /INSERT INTO (\w+)\s*\(([^)]*)\)\s*VALUES([\s\S]*?);/gi;
  for (const [, table, cols, values] of sql.matchAll(insert)) {
    const columns = cols.split(',').map(c => camel(c.trim()));
    const rows = (tables[table] ??= []);
    let row = null;
    for (const token of tokens(values)) {
      if (token.type === '(') row = [];
      else if (token.type === ')') {
        rows.push(Object.fromEntries(columns.map((c, i) => [c, row[i]])));
        row = null;
      } else if (row && token.type !== ',') row.push(literal(token));
    }
  }
  return tables;
}

function parseProfile(sql) {
  const update = /UPDATE profile\s+SET([\s\S]*?)WHERE id\s*=\s*(\d+)\s*;/i.exec(
    sql
  );
  if (!update) return null;
  const profile = { id: Number(update[2]) };
  const list = [...tokens(update[1])].filter(t => t.type !== ',');
  for (let i = 0; i < list.length; i += 3) {
    profile[camel(list[i].value)] = literal(list[i + 2]);
  }
  return profile;
}

const sql = stripComments(
  readFileSync(join(resources, 'demo-data.sql'), 'utf8')
);
const tables = parseInserts(sql);
// Rows get ids in insert order, as the database's serial columns do.
const withIds = rows => (rows || []).map((row, i) => ({ id: i + 1, ...row }));
const data = {
  profile: parseProfile(sql),
  jobApplications: withIds(tables.job_application),
  interviews: withIds(tables.interview),
  offers: withIds(tables.offer),
  frequentUrls: withIds(tables.frequent_url),
  questions: withIds(tables.question),
};

writeFileSync(join(out, 'demoData.json'), `${JSON.stringify(data, null, 2)}\n`);
writeFileSync(
  join(out, 'schema.graphqls'),
  readFileSync(join(resources, 'graphql/schema.graphqls'), 'utf8')
);
console.log(
  `Synced from ${backend}:`,
  Object.entries(data)
    .map(([k, v]) => `${k}=${Array.isArray(v) ? v.length : v ? 1 : 0}`)
    .join(' ')
);
