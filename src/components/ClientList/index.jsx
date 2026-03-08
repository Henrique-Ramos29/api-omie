import styles from './ClientList.module.css';

export default function ClientList({ clientes, onEdit, onDelete }) {
  const hasClients = Array.isArray(clientes) && clientes.length > 0;

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>Clientes Cadastrados</h2>
      
      {hasClients ? (
        <table className={styles.clientTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ/CPF</th>
              <th>Email</th>
              <th className={styles.actionsHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.codigo_cliente_integracao}>
                <td data-label="Nome Fantasia">{cliente.nome_fantasia || 'N/A'}</td>
                <td data-label="CNPJ/CPF">{cliente.cnpj_cpf || 'N/A'}</td>
                <td data-label="Email">{cliente.email || 'N/A'}</td>
                <td data-label="Ações" className={styles.actionsCell}>
                  <button 
                    onClick={() => onEdit(cliente)} 
                    className={`${styles.actionButton} ${styles.editButton}`}>
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(cliente.codigo_cliente_integracao)} 
                    className={`${styles.actionButton} ${styles.deleteButton}`}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.noClientsMessage}>
          <p>Nenhum cliente para exibir no momento.</p>
        </div>
      )}
    </div>
  );
}
