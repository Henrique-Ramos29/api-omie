
// api/proxy.js

// Exporta uma função assíncrona que será a nossa Serverless Function.
export default async function handler(request, response) {
  // 1. Extrai o corpo (body) do pedido original do nosso frontend.
  const body = request.body;

  // 2. Extrai o "caminho de destino" da URL.
  //    Ex: se a chamada for para /api/proxy?endpoint=v1/geral/clientes,
  //    o endpoint será "v1/geral/clientes".
  const { endpoint } = request.query;

  // Monta a URL completa da API da Omie (CORRIGIDO: removido /v1 duplicado).
  const OMIE_API_URL = `https://app.omie.com.br/api/${endpoint}/`;

  // 3. Lê as credenciais de forma segura a partir das Variáveis de Ambiente.
  const OMIE_APP_KEY = process.env.OMIE_APP_KEY;
  const OMIE_APP_SECRET = process.env.OMIE_APP_SECRET;

  // 4. Monta o payload final que será enviado para a Omie.
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
        return response.status(400).json(data);
    }

    // 7. Se tudo correu bem, envia a resposta da Omie de volta para o nosso frontend.
    return response.status(200).json(data);

  } catch (error) {
    // 8. Se houver um erro na comunicação, envia uma resposta de erro.
    return response.status(500).json({ faultstring: "Erro de comunicação com o servidor proxy." });
  }
}
