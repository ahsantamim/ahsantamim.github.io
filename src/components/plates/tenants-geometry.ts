/** Shared by the static tenants plate (server) and its live story (client). */
export const TENANT_X = [120, 260, 400, 540, 680];

const bend = (x: number) => (x < 400 ? x + 26 : x > 400 ? x - 26 : x);
export const inbound = (x: number) => `M${x} 104 V150 Q${x} 176 ${bend(x)} 176 H400 V212`;
export const outbound = (x: number) => `M400 212 V176 H${bend(x)} Q${x} 176 ${x} 150 V104`;
export const branch = (x: number) => `M400 370 V400 H${x} V416`;
