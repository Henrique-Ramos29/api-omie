# Entendendo os Limites da Omie (Plano FIT e API)

Com base nas informações encontradas, aqui está um resumo dos limites aplicáveis à sua conta Omie.FIT e ao uso da API em geral.

---

## Limites do Plano Gratuito (Omie.FIT)

O Omie.FIT é a versão gratuita da plataforma e possui as seguintes restrições de funcionalidade:

- **Faturamento Máximo:** R$ 180.000,00 em Contas a Receber, somando os últimos 12 meses.
- **Emissão de Notas Fiscais:** Limitado a 10 notas por mês.
- **Módulos Restritos:** Não dá acesso a funcionalidades avançadas como CRM, Contratos de Serviço, e recursos completos de Compras/Estoque.

---

## Limites de Uso da API

Estes limites aplicam-se a **todos os planos** (FIT e Full) e são importantes para o desenvolvimento de integrações:

- **Requisições por Minuto (Geral):**
  - **960** requisições por minuto por endereço de IP.

- **Requisições por Minuto (Específico):**
  - **240** requisições por minuto combinando `IP + App Key + Método` (ex: 240 chamadas para `ListarClientes`).

- **Requisições Simultâneas:**
  - **4** requisições simultâneas combinando `IP + App Key + Método`.

- **Paginação:**
  - Máximo de **100** registros por página em qualquer consulta.

### Capacidade Diária

A capacidade total permite mais de **300.000 requisições por dia**, o que é bastante generoso para ambientes de teste e desenvolvimento.

---

### Portal do Desenvolvedor

Você pode continuar usando o [Portal do Desenvolvedor Omie](https://developer.omie.com.br/) para testar e explorar as APIs, mesmo no plano gratuito. Os limites de API não mudam entre os planos, apenas as funcionalidades disponíveis no ERP.
