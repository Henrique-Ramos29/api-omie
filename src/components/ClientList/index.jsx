import { useEffect, useState } from 'react';
import { getClientes } from '../../services/omieApi';
import styles from './ClientList.module.css'; // Importando o estilo

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await getClientes();
        // A API da Omie retorna os dados dentro de clientes_cadastro
        setClients(data.clientes_cadastro || []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Buscando clientes no Omie...</div>;
  }

  if (error) {
    return <div className={styles.errorBox}>⚠️ {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Painel de Clientes</h2>
        <span className={styles.countBadge}>{clients.length} Clientes</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Razão Social / Nome</th>
              <th>CNPJ / CPF</th>
              <th>Localização</th>
              <th>Código</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.codigo_cliente_omie} className={styles.row}>
                <td className={styles.clientName}>
                  {client.nome_fantasia || client.razao_social}
                </td>
                <td className={styles.cnpj}>{client.cnpj_cpf}</td>
                <td>
                  {client.cidade} - <span className={styles.tag}>{client.estado}</span>
                </td>
                <td className={styles.tag}>{client.codigo_cliente_integracao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {clients.length === 0 && (
        <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Nenhum cliente encontrado na sua conta de teste.
        </p>
      )}
    </div>
  );
};

export default ClientList;