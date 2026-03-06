import { useState } from 'react';
import ClientList from './components/ClientList/index.jsx';
import Dashboard from './components/Dashboard/index.jsx';
import RelatorioVendas from './components/RelatorioVendas/index.jsx';
import NewClientForm from './components/NewClientForm/index.jsx';
import styles from './App.module.css';

function App() {
  // A chave de atualização força os componentes a recarregarem seus dados
  const [refreshKey, setRefreshKey] = useState(0);

  // Esta função é passada para o formulário e chamada quando um cliente é adicionado
  const handleClientAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={styles.appContainer}>
      
      {/* -- Cabeçalho da Aplicação -- */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Omie API Connector Control</h1>
        <p className={styles.headerSubtitle}>Sincronização em tempo real com Sandbox</p>
      </header>

      {/* -- Dashboard Principal -- */}
      <div className={styles.dashboardContainer}>
        <Dashboard key={`dash-${refreshKey}`} />
      </div>

      {/* -- Grid Principal (Formulário e Relatório) -- */}
      <div className={styles.mainGrid}>
        <div className={styles.formSection}>
          <NewClientForm onClientAdded={handleClientAdded} />
        </div>
        <div className={styles.salesSection}>
          <RelatorioVendas key={`vendas-${refreshKey}`} />
        </div>
      </div>

      {/* -- Lista de Clientes (seção final) -- */}
      <div className={styles.clientListSection}>
        <ClientList key={`list-${refreshKey}`} />
      </div>

    </div>
  );
}

export default App;
