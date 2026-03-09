
// api/proxy.js

// Exporta uma função assíncrona que será a nossa Serverless Function.
export default async function handler(request, response) {
  // 1. Extrai o corpo (body) do pedido original do nosso frontend.
  //    É aqui que vêm as informações como `call` (ex: "ListarClientes") e `param`.
  const body = request.body;

  // 2. Extrai o "caminho de destino" da URL.
  //    Ex: se a chamada for para /api/proxy?endpoint=geral/clientes,
  //    o endpoint será "geral/clientes".
  const { endpoint } = request.query;

  // Monta a URL completa da API da Omie.
  const OMIE_API_URL = `https://app.omie.com.br/api/v1/${endpoint}/`;

  // 3. Lê as credenciais de forma segura a partir das Variáveis de Ambiente
  //    configuradas no painel da Vercel.
  const OMIE_APP_KEY = process.env.OMIE_APP_KEY;
  const OMIE_APP_SECRET = process.env.OMIE_APP_SECRET;

  // 4. Monta o payload final que será enviado para a Omie.
  //    Ele inclui as credenciais e o corpo original da requisição.
  const finalPayload = {
    ...body,
    app_key: OMIE_APP_KEY,
    app_secret: OMIE_APP_SECRET,
  };

  try {
    // 5. Faz a chamada real para a API da Omie, de servidor para servidor.
    const apiResponse = await fetch(OMIE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalPayload),
    });

    // 6. Lê a resposta da Omie como JSON.
    const data = await apiResponse.json();
    
    // Verifica se a resposta da Omie indica um erro interno dela.
    if (data.faultstring) {
        // Se houver um erro, envia uma resposta de erro (status 400) para o nosso frontend.
        return response.status(400).json(data);
    }

    // 7. Se tudo correu bem, envia a resposta da Omie de volta para o nosso frontend.
    return response.status(200).json(data);

  } catch (error) {
    // 8. Se houver um erro na comunicação com a Omie (ex: rede),
    //    envia uma resposta de erro genérica.
    return response.status(500).json({ faultstring: "Erro de comunicação com o servidor proxy." });
  }
}
