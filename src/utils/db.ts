import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Função para executar queries no banco de dados
export const query = async (text: string, params?: any[]) => {
  try {
    const client = await pool.connect();
    const result = await client.query(text, params);
    client.release();
    return result;
  } catch (error) {
    console.error('Erro ao executar a query:', error);
    throw error;
  }
};

// Função para verificar a conexão com o banco de dados
export const testDatabaseConnection = async () => {
  try {
    // Tenta executar uma query simples
    const result = await query('SELECT 1 as health');
    return { connected: true, message: 'Conexão com o banco de dados estabelecida com sucesso' };
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    return { connected: false, message: `Falha na conexão com o banco: ${error instanceof Error ? error.message : String(error)}` };
  }
};

// Função para criar a tabela de assinaturas
export const createTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS signatures (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await query(queryText);
    console.log('Tabela de assinaturas criada ou já existente.');
  } catch (error) {
    console.error('Erro ao criar a tabela de assinaturas:', error);
  }
};

// Função para inserir uma assinatura no banco de dados
export const insertSignature = async (
  name: string,
  email: string,
  department: string,
  title: string,
  company: string,
  phone?: string
): Promise<any> => {
  const queryText = `
    INSERT INTO signatures (name, email, department, title, company, phone)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [name, email, department, title, company, phone];

  try {
    const result = await query(queryText, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao inserir a assinatura:', error);
    throw error;
  }
};

// Função para buscar todas as assinaturas
export const getAllSignatures = async (): Promise<any[]> => {
  const queryText = `
    SELECT * FROM signatures ORDER BY date DESC;
  `;
  try {
    const result = await query(queryText);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar as assinaturas:', error);
    return [];
  }
};
