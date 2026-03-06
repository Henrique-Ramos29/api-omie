const APP_KEY = import.meta.env.VITE_OMIE_APP_KEY;
const APP_SECRET = import.meta.env.VITE_OMIE_APP_SECRET;

// Função auxiliar para formatar data no padrão que o Omie exige: DD/MM/YYYY
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// 1. BUSCAR CLIENTES
export const getClientes = async () => {
  const response = await fetch('/api/api/v1/geral/clientes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: 'ListarClientes',
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      param: [{ pagina: 1, registros_por_pagina: 50, apenas_importado_api: 'N' }]
    })
  });
  return response.json();
};

// 2. BUSCAR FINANCEIRO (Contas a Receber)
export const getFinancas = async () => {
  const response = await fetch('/api/api/v1/financas/contasreceber/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: 'ListarContasReceber',
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      param: [{ pagina: 1, registros_por_pagina: 50, apenas_importado_api: 'N' }]
    })
  });
  return response.json();
};

// 3. BUSCAR VENDAS (Relatório de Pedidos dos últimos 30 dias)
export const getVendas = async () => {
  const hoje = new Date();
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(hoje.getDate() - 30);

  const response = await fetch('/api/api/v1/vendas/pedido/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: 'ListarPedidos',
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      param: [{
        pagina: 1,
        registros_por_pagina: 50,
        apenas_importado_api: 'N',
        data_de: formatDate(trintaDiasAtras),
        data_ate: formatDate(hoje)
      }]
    })
  });
  return response.json();
};

// 4. INCLUIR CLIENTE (Com limpeza de documento)
export const incluirCliente = async (cliente) => {
  // Remove qualquer formatação (pontos, traços, barras) do documento
  const documentoLimpo = cliente.documento.replace(/\D/g, '');

  const response = await fetch('/api/api/v1/geral/clientes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: 'IncluirCliente',
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      param: [{
        codigo_cliente_integracao: Date.now().toString(),
        razao_social: cliente.nome,
        nome_fantasia: cliente.nome,
        cnpj_cpf: documentoLimpo // Envia o documento limpo
      }]
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    // O console.log foi removido, mas o erro ainda é lançado para a interface
    throw new Error(error.faultstring || 'Erro ao cadastrar cliente');
  }
  
  return response.json();
};
