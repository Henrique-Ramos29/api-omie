// Lê as credenciais da API a partir das variáveis de ambiente do Vite
const APP_KEY = import.meta.env.VITE_OMIE_APP_KEY;
const APP_SECRET = import.meta.env.VITE_OMIE_APP_SECRET;

// Função centralizada para tratar respostas e erros da API
const handleResponse = async (response, callName) => {
  const data = await response.json();
  console.log(`--- DEBUG: Resposta de [${callName}] ---`, data);

  if (data.faultstring) {
    const friendlyMessage = data.faultstring.includes("CPF/CNPJ inválido") ? "O CPF ou CNPJ informado é inválido." : 
                              data.faultstring.includes("já cadastrado") ? "Este cliente já está cadastrado."
                              : `Erro na Omie: ${data.faultstring}`;
    throw new Error(friendlyMessage);
  }
  return data;
};

// 1. BUSCAR CLIENTES
export const getClientes = async () => {
  const response = await fetch('/api/v1/geral/clientes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: 'ListarClientes',
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      param: [{ pagina: 1, registros_por_pagina: 50, apenas_importado_api: 'N' }]
    })
  });
  return handleResponse(response, 'getClientes');
};

// 2. BUSCAR DADOS FINANCEIROS (Contas a Receber)
export const getFinancas = async () => {
  try {
    const response = await fetch('/api/v1/financas/contasreceber/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call: 'ListarContasReceber',
        app_key: APP_KEY,
        app_secret: APP_SECRET,
        param: [{ pagina: 1, registros_por_pagina: 500, filtrar_por_data_de: "01/01/2023" }]
      })
    });
    if (response.status === 404) return { contas_receber_cadastro: [] };
    return handleResponse(response, 'getFinancas');
  } catch (error) {
    return { contas_receber_cadastro: [] };
  }
};

// 3. BUSCAR VENDAS
export const getVendas = async () => {
  try {
    const response = await fetch('/api/v1/vendas/pedido/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call: 'ListarPedidosVenda',
        app_key: APP_KEY,
        app_secret: APP_SECRET,
        param: [{ pagina: 1, registros_por_pagina: 100, apenas_importado_api: "N" }]
      })
    });
    if (response.status === 404) return { pedido_venda_produto: [] };
    return handleResponse(response, 'getVendas');
  } catch (error) {
    return { pedido_venda_produto: [] };
  }
};

// 4. BUSCAR PRODUTOS
export const getProdutos = async () => {
  try {
    const response = await fetch('/api/v1/geral/produtos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        call: 'ListarProdutos',
        app_key: APP_KEY,
        app_secret: APP_SECRET,
        param: [{ pagina: 1, registros_por_pagina: 100, apenas_importado_api: 'N' }]
      })
    });
    if (response.status === 404) return { produto_servico_cadastro: [] };
    return handleResponse(response, 'getProdutos');
  } catch (error) {
    return { produto_servico_cadastro: [] };
  }
};

// 5. INCLUIR CLIENTE
export const incluirCliente = async (clientDataForApi) => {
  const response = await fetch('/api/v1/geral/clientes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: 'IncluirCliente',
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      param: [clientDataForApi]
    })
  });
  return handleResponse(response, 'incluirCliente');
};

// 6. ALTERAR CLIENTE
export const alterarCliente = async (clientDataForApi) => {
  const response = await fetch('/api/v1/geral/clientes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: 'AlterarCliente',
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      param: [clientDataForApi]
    })
  });
  return handleResponse(response, 'alterarCliente');
};

// 7. EXCLUIR CLIENTE
export const excluirCliente = async (codigo_cliente_integracao) => {
  const response = await fetch('/api/v1/geral/clientes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      call: 'ExcluirCliente',
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      param: [{ codigo_cliente_integracao }]
    })
  });
  return handleResponse(response, 'excluirCliente');
};
