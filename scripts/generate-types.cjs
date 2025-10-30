/* eslint-disable no-console */
// Gera tipos dinâmicos a partir de GET /employees
// Usa o token JWT fornecido pelo usuário para autenticar a chamada
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_BASE = process.env.API_BASE || 'http://localhost:5208';
// Token fixo para geração automática a pedido do usuário
const STATIC_TOKEN = process.env.API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4Yzg3ODc1Zi0wYWE4LTRhZjQtOTlmMS04NDM0Y2Q0MTA4ZTkiLCJlbWFpbCI6ImRpcmVjdG9yQGNvbXBhbnkuY29tIiwicm9sZSI6IkRpcmVjdG9yIiwiZXhwIjoxNzYxNzkxMzczLCJpc3MiOiJFbXBsb3llZU1hbmFnZXIiLCJhdWQiOiJFbXBsb3llZU1hbmFnZXJVc2VycyJ9.3gh9FU6X3dUx8gn1AF1rvJRruw_KQg6tP_NmU1RGRDQ';

function inferLiteralUnion(values) {
    const unique = Array.from(new Set(values.filter(v => v != null)));
    if (unique.length === 0) return null;
    return unique.map(v => JSON.stringify(v)).join(' | ');
}

function safeProp(obj, key, fallback = undefined) {
    try { return obj?.[key] ?? fallback; } catch { return fallback; }
}

async function fetchEmployees() {
    try {
        const res = await axios.get(`${API_BASE}/employees`, {
            headers: { Authorization: `Bearer ${STATIC_TOKEN}` },
            timeout: 8000,
        });
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.warn('[types] Falha ao consultar /employees. Gerando tipos default. Motivo:', err?.response?.status || err?.code || 'erro');
        return [];
    }
}

function generateTypes(employees) {
    // Defaults solicitados
    let roleUnion = '"Director" | "Leader" | "Employee"';
    let phoneTypeUnion = '"Mobile" | "Home" | "Work"';

    if (employees.length > 0) {
        const roles = employees.map(e => safeProp(e, 'role')).filter(Boolean);
        const phones = employees.flatMap(e => Array.isArray(e?.phones) ? e.phones : []);
        const phoneTypes = phones.map(p => safeProp(p, 'type')).filter(Boolean);
        const isNumericRole = roles.length > 0 && typeof roles[0] === 'number';
        const isNumericPhoneType = phoneTypes.length > 0 && typeof phoneTypes[0] === 'number';
        const inferredRoles = inferLiteralUnion(roles);
        const inferredPhoneTypes = inferLiteralUnion(phoneTypes);
        if (inferredRoles && !isNumericRole) roleUnion = inferredRoles;
        if (inferredPhoneTypes && !isNumericPhoneType) phoneTypeUnion = inferredPhoneTypes;
    }

    const header = `// ATENÇÃO: Arquivo gerado automaticamente por scripts/generate-types.cjs\n// Execute npm run gen:types para atualizar.\n`;

    const content = `
${header}
export type Role = ${roleUnion};
export type PhoneType = ${phoneTypeUnion};

export interface Phone {
  number: string;
  type: PhoneType;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  docNumber: string;
  role: Role;
  phones: Phone[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
`;

    return content.trimStart();
}

(async () => {
    const employees = await fetchEmployees();
    const typesCode = generateTypes(employees);
    const target = path.resolve(process.cwd(), 'src', 'api', 'types.ts');
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(target, typesCode, 'utf8');
    console.log(`[types] Gerado: ${target}`);
})();


