import { useEffect, useState } from 'react';
import { getFinancas } from '../../services/omieApi';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [data, setData] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinancas().then(res => {
      const lista = res.contas_receber_cadastro || [];
      const total = lista.reduce((acc, curr) => acc + curr.valor_liquido, 0);
      setData({ total, count: lista.length });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.container}>Carregando financeiro...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.gridCards}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total a Receber</div>
          <div className={styles.cardValue}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total)}
          </div>
          <div className={styles.statusPositive}>↑ 12% em relação ao mês anterior</div>
        </div>

        <div className={styles.card} style={{borderColor: '#10b981'}}>
          <div className={styles.cardTitle}>Notas Fiscais Abertas</div>
          <div className={styles.cardValue}>{data.count}</div>
          <div className={styles.statusPositive}>Aguardando pagamento</div>
        </div>
      </div>
      
      <p style={{color: '#666'}}>* Dados extraídos em tempo real do Omie.Cash</p>
    </div>
  );
};

export default Dashboard;