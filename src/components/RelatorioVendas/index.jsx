import { useEffect, useState } from 'react';
import { getVendas } from '../../services/omieApi';
import styles from './RelatorioVendas.module.css';

const RelatorioVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({ total: 0, ticketMedio: 0, qtd: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVendas();
        const lista = data.pedido_venda_produto || [];
        
        // CÁLCULOS DE NEGÓCIO
        const totalGeral = lista.reduce((acc, p) => acc + (p.cabecalho.valor_total || 0), 0);
        const qtd = lista.length;
        const ticket = qtd > 0 ? totalGeral / qtd : 0;

        setResumo({ total: totalGeral, ticketMedio: ticket, qtd });
        setVendas(lista);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Processando dados de vendas...</div>;

  return (
    <div className={styles.relatorioContainer}>
      <div className={styles.header}>
        <h2 style={{margin: 0, color: '#001e62'}}>Relatório de Vendas (30 dias)</h2>
      </div>

      {/* Resumo Financeiro */}
      <div className={styles.statsRow}>
        <div className={styles.miniCard}>
          <div className={styles.miniLabel}>Faturamento Total</div>
          <div className={styles.miniValue}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resumo.total)}
          </div>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniLabel}>Ticket Médio</div>
          <div className={styles.miniValue}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resumo.ticketMedio)}
          </div>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniLabel}>Pedidos Faturados</div>
          <div className={styles.miniValue}>{resumo.qtd}</div>
        </div>
      </div>

      {/* Tabela Detalhada */}
      <table className={styles.tableVendas}>
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Data</th>
            <th>Valor</th>
            <th>Status/Etapa</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda) => (
            <tr key={venda.cabecalho.codigo_pedido_omie}>
              <td>#{venda.cabecalho.numero_pedido}</td>
              <td>{venda.cabecalho.data_previsao}</td>
              <td className={styles.valor}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.cabecalho.valor_total)}
              </td>
              <td>
                <span className={styles.statusTag}>{venda.cabecalho.etapa}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {vendas.length === 0 && (
        <div style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>
          Nenhuma venda encontrada para o período selecionado.
        </div>
      )}
    </div>
  );
};

export default RelatorioVendas;