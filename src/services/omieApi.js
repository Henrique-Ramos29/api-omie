
// Função centralizada para fazer a chamada através do nosso proxy na Vercel.
const apiProxyCall = async (endpoint, payload) => {
  const response = await fetch(`/api/proxy?endpoint=${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // O corpo agora contém apenas o `call` e os `param`.
    // As credenciais são adicionadas no lado do servidor.
    body: JSON.stringify(payload)
  });

  // A lógica de tratamento de erro é a mesma, mas agora aplicada à resposta do nosso proxy.
  const data = await response.json();
  console.log(`--- DEBUG: Resposta de [${payload.call}] via proxy ---`, data);

  if (!response.ok || data.faultstring) {
    const fault = data.faultstring || `Erro ${response.status}`;
    const friendlyMessage = fault.includes("CPF/CNPJ inválido") ? "O CPF ou CNPJ informado é inválido." : 
                              fault.includes("já cadastrado") ? "Este cliente já está cadastrado."
                              : `Erro na Omie: ${fault}`;
    throw new Error(friendlyMessage);
  }
  return data;
};

// 1. BUSCAR CLIENTES
export const getClientes = () => {
  return apiProxyCall('v1/geral/clientes', {
    call: 'ListarClientes',
    param: [{ pagina: 1, registros_por_pagina: 50, apenas_importado_api: 'N' }]
  });
};

// 2. BUSCAR DADOS FINANCEIROS (Contas a Receber)
export const getFinancas = () => {
  return apiProxyCall('v1/financas/contasreceber', {
    call: 'ListarContasReceber',
    param: [{ pagina: 1, registros_por_pagina: 500, filtrar_por_data_de: "01/01/2023" }]
  }).catch(() => ({ contas_receber_cadastro: [] })); // Retorna valor padrão em caso de erro
};

// 3. BUSCAR VENDAS
export const getVendas = () => {
  return apiProxyCall('v1/vendas/pedido', {
    call: 'ListarPedidosVenda',
    param: [{ pagina: 1, registros_por_pagina: 100, apenas_importado_api: "N" }]
  }).catch(() => ({ pedido_venda_produto: [] }));
};

// 4. BUSCAR PRODUTOS
export const getProdutos = () => {
  return apiProxyCall('v1/geral/produtos', {
    call: 'ListarProdutos',
    param: [{ pagina: 1, registros_por_pagina: 100, apenas_importado_api: 'N' }]
  }).catch(() => ({ produto_servico_cadastro: [] }));
};

// 5. INCLUIR CLIENTE
export const incluirCliente = (clientDataForApi) => {
  return apiProxyCall('v1/geral/clientes', {
    call: 'IncluirCliente',
    param: [clientDataForApi]
  });
};

// 6. ALTERAR CLIENTE
export const alterarCliente = (clientDataForApi) => {
  return apiProxyCall('v1/geral/clientes', {
    call: 'AlterarCliente',
    param: [clientDataForApi]
  });
};

// 7. EXCLUIR CLIENTE
export const excluirCliente = (codigo_cliente_integracao) => {
  return apiProxyCall('v1/geral/clientes', {
    call: 'ExcluirCliente',
    param: [{ codigo_cliente_integracao }]
  });
};
