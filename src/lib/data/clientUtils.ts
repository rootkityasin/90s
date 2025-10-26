// Client-side utilities (no database imports)

// Client token generation - simple SKU-based token
export function generateClientToken(sku: string): string { 
  return sku; 
}

// Demo users
export type DemoUser = { id: string; email: string; role: 'retail' | 'client' | 'admin' };

const demoUserList: DemoUser[] = [
  { id: 'u1', email: 'retail@example.com', role: 'retail' },
  { id: 'u2', email: 'client@example.com', role: 'client' },
  { id: 'u3', email: 'admin@example.com', role: 'admin' }
];

export function findUserByEmail(email: string) { 
  return demoUserList.find(u => u.email === email) || null; 
}

export function allDemoUsers() { 
  return demoUserList; 
}
