import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: 'COMEX' | 'PMO' | 'ANALYSTE';
}

export async function query<T = any>(text: string, params?: any[], tenantContext?: TenantContext): Promise<T[]> {
  const client = await pool.connect();
  try {
    if (tenantContext) {
      await client.query(`SET app.tenant_id = '${tenantContext.tenantId}'`);
      await client.query(`SET app.user_id = '${tenantContext.userId}'`);
    }
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
  tenantContext?: TenantContext
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (tenantContext) {
      await client.query(`SET app.tenant_id = '${tenantContext.tenantId}'`);
      await client.query(`SET app.user_id = '${tenantContext.userId}'`);
    }
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
