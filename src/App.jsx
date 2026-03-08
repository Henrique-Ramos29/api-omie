import { useState, useEffect, useRef, useCallback } from 'react';
import NewClientForm from './components/NewClientForm';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import { ProductList } from './components/ProductList';
import { getClientes, getFinancas, getVendas, getProdutos, incluirCliente, alterarCliente, excluirCliente } from './services/omieApi';
import styles from './App.module.css';

function App() {
  const [clientes, setClientes] = useState([]);
  const [financas, setFinancas] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingClient, setEditingClient] = useState(null);

  const dataFetchedRef = useRef(false);
  // . Criar uma referência para o contêiner do formulário
  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const results = await Promise.allSettled([
      getClientes(),
      getFinancas(),
      getVendas(),
      getProdutos()
    ]);

    const clientesData = results[0].status === 'fulfilled' ? results[0].value.clientes_cadastro : [];
    const financasData = results[1].status === 'fulfilled' ? results[1].value.contas_receber_cadastro : [];
    const vendasData = results[2].status === 'fulfilled' ? results[2].value.pedido_venda_produto : [];
    const produtosData = results[3].status === 'fulfilled' ? results[3].value.produto_servico_cadastro : [];

    setClientes(clientesData || []);
    setFinancas(financasData || []);
    setVendas(vendasData || []);
    setProdutos(produtosData || []);

    const firstError = results.find(res => res.status === 'rejected');
    if (firstError) {
      console.error("Falha ao buscar dados de uma das fontes:", firstError.reason);
      setError(`Alguns dados não puderam ser carregados. Causa: ${firstError.reason.message}`);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchData();
  }, [fetchData]);

  const handleDeleteClient = async (codigo_cliente_integracao) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await excluirCliente(codigo_cliente_integracao);
        const clientesData = await getClientes();
        setClientes(clientesData.clientes_cadastro || []);
        alert('Cliente excluído com sucesso!');
      } catch (err) {
        console.error("Erro ao excluir cliente:", err);
        alert(`Falha ao excluir cliente: ${err.message}`);
      }
    }
  };

  // . Modificar a função para rolar para o elemento de referência
  const handleSelectClientForEdit = (cliente) => {
    setEditingClient(cliente);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
  };

  const handleSaveClient = async (clientFromForm) => {
    const isEditing = !!editingClient;
    
    const clientDataForApi = {
      ...clientFromForm,
      razao_social: clientFromForm.nome_fantasia,
      codigo_cliente_integracao: isEditing 
        ? editingClient.codigo_cliente_integracao 
        : `webapp_${Date.now()}`
    };

    try {
      if (isEditing) {
        await alterarCliente(clientDataForApi);
      } else {
        await incluirCliente(clientDataForApi);
      }
      
      setEditingClient(null);
      const clientesData = await getClientes();
      setClientes(clientesData.clientes_cadastro || []);

      return { success: true, message: `Cliente ${isEditing ? 'alterado' : 'cadastrado'} com sucesso!` };

    } catch (err) {
      console.error(`Erro ao ${isEditing ? 'alterar' : 'incluir'} cliente:`, err);
      return { success: false, message: err.message };
    }
  };
  
  return (
    <div className={styles.appContainer}>
      <h1 className={styles.mainTitle}>Painel de Gestão Api Omie</h1>

      {isLoading && <p>Carregando dados...</p>}
      {error && <p className={styles.errorBox}>⚠️ {error}</p>}

      {!isLoading && (
        <main className={styles.mainGrid}>
          <div className={styles.gridItem}>
            <Dashboard financas={financas} vendas={vendas} />
          </div>

          <div className={styles.gridItem}>
            <ProductList produtos={produtos} />
          </div>

          {/* . Anexar a referência ao contêiner do formulário */}
          <div className={styles.gridItem} ref={formRef}>
            <NewClientForm 
              onSave={handleSaveClient} 
              editingClient={editingClient}
              onCancel={handleCancelEdit}
            />
          </div>

          <div className={styles.gridItem}>
            <ClientList 
              clientes={clientes} 
              onEdit={handleSelectClientForEdit}
              onDelete={handleDeleteClient}
            />
          </div>

          
        </main>
      )}
    </div>
  );
}

export default App;
