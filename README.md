# Integração com API de CRM | Curso prático com Postman

Curso prático e autoguiado sobre integração com a API REST de um CRM, escrito em Markdown e acompanhado de uma collection do Postman pronta para importar. Cobre leads, usuários e empresas, regras e filas de distribuição, webhooks, automação com o Collection Runner do Postman e diagnóstico de problemas.

Foi criado para um time de suporte técnico, para que os analistas consigam reproduzir, testar e diagnosticar a integração de um cliente por conta própria, em vez de escalar todo chamado que envolve API.

> **Material educacional independente.** Baseado na documentação pública da API da C2S (Contact2Sale): <https://docs-api-leads.c2sapp.com/>. Não é um produto oficial e não é mantido pela empresa. Quando o curso aponta diferenças entre a documentação e o comportamento observado da API, essas observações vêm de testes numa conta de teste e podem mudar com o tempo.

## Estrutura do repositório

| Caminho | Conteúdo |
| --- | --- |
| `docs/curso/` | O curso: visão geral e 8 módulos (46 aulas), dos fundamentos de API ao diagnóstico |
| `docs/quiz/` | Questionários em JSON: 4 questões por aula e um banco de 12 questões por módulo |
| `docs/00-referencia-api.md` | Referência rápida: endpoints, formatos de body, webhooks, códigos de erro e dúvidas frequentes |
| `postman/` | Collection do Postman (39 requests, agrupadas como na documentação oficial) e um modelo de environment |
| `docs-site/index.html` | O curso inteiro numa única página HTML estática, com questionários por aula, testes por módulo e progresso salvo no navegador |
| `tools/` | Scripts em PowerShell que geram os arquivos do Postman e a página HTML a partir das fontes |

| Módulo | Tema |
| --- | --- |
| M0 | Fundamentos de API: métodos HTTP, URLs, headers, JSON e códigos de status |
| M1 | Postman do zero: environments, collections e autenticação herdada |
| M2 | Leads: listar, filtrar, paginar, criar, atualizar, encaminhar, tags, mensagens, status e negócio fechado |
| M3 | Usuários, empresas e tags |
| M4 | Regras e filas de distribuição |
| M5 | Stand de vendas e blocklist |
| M6 | Webhooks: assinatura, testes e diagnóstico de entrega |
| M7 | Automação (Collection Runner), simulação da integração do cliente e roteiro de diagnóstico |

## Como usar

1. Instale o [Postman](https://www.postman.com/downloads/) (aplicativo desktop).
2. **Importe** `postman/API-C2S.postman_collection.json` e `postman/C2S.postman_environment.json`.
3. Selecione o environment e preencha `token` com um token da **sua própria conta de teste**. Nunca pratique com o token de produção de um cliente.
4. Comece pelas requests de leitura (`GET`). As requests de escrita ficam bloqueadas até você definir, de propósito, `allow_writes = true` no environment.
5. Siga as aulas de `docs/curso/` em ordem, ou abra `docs-site/index.html` no navegador para fazer o curso com os questionários.

Para gerar de novo os arquivos derivados depois de editar as fontes (Windows PowerShell):

```powershell
powershell -ExecutionPolicy Bypass -File tools/build-postman.ps1   # postman/*.json
powershell -ExecutionPolicy Bypass -File tools/build-trilha.ps1    # docs-site/index.html
```

## Boas práticas de segurança de API abordadas

- **Autenticação Bearer:** toda chamada envia `Authorization: Bearer <token>`. A collection configura isso uma vez, no nível da collection, e todas as requests herdam; o token nunca é copiado para requests individuais.
- **Token por conta, fora dos arquivos:** o token fica numa variável do environment marcada como *secret*, e o modelo de environment vem com ela vazia. O curso explica que o token representa a conta inteira da empresa, aparece uma única vez e deve ser trocado se for exposto.
- **Proteção de escrita:** um script de pré-requisição no nível da collection recusa qualquer request que não seja `GET` enquanto `allow_writes` não for `true`, evitando alterações acidentais na conta errada.
- **Ler o erro antes de escalar:** como distinguir problema na requisição (4xx) de problema no servidor (5xx), incluindo as particularidades desta API (token inválido ou ausente devolve `403 access_denied`, erros de validação também devolvem `403` com uma mensagem, campo obrigatório ausente pode devolver `401`, e duplicidades ou dados que não conferem devolvem `422`), além do limite de requisições (`429`, 10 chamadas por minuto por endpoint).
- **Webhooks:** assinar e cancelar eventos, testar a entrega com um inspetor de requisições, por que vale uma URL por token e por que o endpoint que recebe deve validar as requisições do seu lado.
- **Testes de menor impacto:** usar conta de teste, identificar os dados de teste com prefixo, preferir leituras, restaurar as filas depois de testar e nunca colar tokens reais em chamados ou conversas.

## O que aprendi construindo o curso

- Ler uma referência de API com olhar crítico e validá-la contra respostas reais: paginação, formatos de data e códigos de erro nem sempre batiam com a documentação, e o curso registra essas diferenças.
- Transformar investigações repetitivas do suporte num roteiro de diagnóstico passo a passo: coletar, validar o token, reproduzir, comparar e escalar com evidências.
- Definir padrões seguros para quem está aprendendo, para que um erro custe uma requisição bloqueada, e não dados de clientes alterados.

---

### English summary

A hands-on course, in Markdown with a Postman collection, on integrating with a CRM's REST API: leads, users and companies, distribution rules and queues, webhooks, automation and troubleshooting. It was built so that a technical support team can test and diagnose customer integrations without escalating every API ticket. Independent educational material, based on the public API documentation of C2S (<https://docs-api-leads.c2sapp.com/>); not an official product. The course content is in Brazilian Portuguese. To use it, import the collection and the environment into Postman, fill in a token from **your own test account**, and note that write requests stay blocked until `allow_writes = true`.
