
// api/proxy.js

export default async function handler(request, response) {
  const { endpoint } = request.query;
  const body = request.body;

  const OMIE_APP_KEY = process.env.OMIE_APP_KEY;
  const OMIE_APP_SECRET = process.env.OMIE_APP_SECRET;
  
  // --- DIAGNÓSTICO ---
  // Verifica se as variáveis de ambiente foram carregadas corretamente no servidor.
  console.log('Proxy Function Triggered. Endpoint:', endpoint);
  console.log('Variáveis de ambiente carregadas? Chave:', !!OMIE_APP_KEY, 'Segredo:', !!OMIE_APP_SECRET);

  // Se as chaves não foram encontradas, retorna um erro claro e imediato.
  if (!OMIE_APP_KEY || !OMIE_APP_SECRET) {
      return response.status(500).json({
          faultstring: 'ERRO INTERNO: As chaves da API (OMIE_APP_KEY, OMIE_APP_SECRET) não estão configuradas corretamente no servidor da Vercel.' 
      });
  }
  // --- FIM DO DIAGNÓSTICO ---

  const OMIE_API_URL = `https://app.omie.com.br/api/${endpoint}/`;

  const finalPayload = {
    ...body,
    app_key: OMIE_APP_KEY,
    app_secret: OMIE_APP_SECRET,
  };

  try {
    const apiResponse = await fetch(OMIE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload),
    });

    const data = await apiResponse.json();
    
    if (data.faultstring) {
        console.error('Erro retornado pela API Omie:', data.faultstring);
        return response.status(400).json(data);
    }

    return response.status(200).json(data);

  } catch (error) {
    console.error('Erro na comunicação com o proxy:', error);
    return response.status(500).json({ faultstring: "Erro de comunicação com o servidor proxy." });
  }
}
