import styles from './Dashboard.module.css';

// Função para formatar moeda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value || 0); // Garante que o valor não seja nulo
};

// Componente Dashboard simplificado
export default function Dashboard({ financas, vendas }) {
  // Calcula o total de contas a receber
  const totalAReceber = financas.reduce((acc, conta) => acc + (conta.valor_liquido || 0), 0);

  // Calcula o valor total de vendas
  const totalVendas = vendas.reduce((acc, venda) => {
    // A API de vendas pode ter uma estrutura de totais diferente
    return acc + (venda.total_pedido?.valor_total_pedido || 0);
  }, 0);

  return (
    // Usando as novas classes CSS
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Seu Resumo Financeiro</h2>

      <div className={styles.cardsContainer}>
        {/* Card de Contas a Receber */}
        <div className={styles.card}>
          <div>
            <h3 className={styles.cardTitle}>Contas a Receber</h3>
            <p className={styles.cardValue}>{formatCurrency(totalAReceber)}</p>
            <p className={styles.cardDescription}>
              {financas.length} {financas.length === 1 ? 'título em aberto' : 'títulos em aberto'}
            </p>
          </div>
        </div>

        {/* Card de Vendas */}
        <div className={`${styles.card} ${styles.secondary}`}>
          <div>
            <h3 className={styles.cardTitle}>Total em Vendas</h3>
            <p className={styles.cardValue}>{formatCurrency(totalVendas)}</p>
            <p className={styles.cardDescription}>
              {vendas.length} {vendas.length === 1 ? 'pedido registrado' : 'pedidos registrados'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
