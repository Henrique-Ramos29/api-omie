import styles from './ProductList.module.css';

// Componente para exibir o status do estoque com estilo
const StockStatus = ({ quantity }) => {
  const stock = Number(quantity) || 0;
  
  if (stock > 0) {
    return <span className={`${styles.stockInfo} ${styles.stockPositive}`}>{stock}</span>;
  }
  return <span className={`${styles.stockInfo} ${styles.stockNegative}`}>{stock}</span>;
};

export function ProductList({ produtos }) {
  const hasProducts = produtos && produtos.length > 0;

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>Produtos e Estoque</h2>
      
      {hasProducts ? (
        <div className={styles.tableWrapper}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Código</th>
                <th>Valor Unitário</th>
                <th>Estoque</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.codigo_produto_integracao}>
                  {/* Adicionado data-label para responsividade */}
                  <td data-label="Produto">{produto.descricao}</td>
                  <td data-label="Código">{produto.codigo_produto}</td>
                  <td data-label="Valor">{`R$ ${produto.valor_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                  <td data-label="Estoque">
                    <StockStatus quantity={produto.quantidade_estoque_fiscal} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
