# CRM API Integration — Hands-on Course with Postman

A practical, self-paced course on integrating with a CRM's REST API, written in Markdown and paired with a ready-to-import Postman collection. It covers leads, users and companies, lead distribution rules and queues, webhooks, automation with the Postman Collection Runner, and troubleshooting.

It was created for a technical support team, so that analysts can reproduce, test and diagnose a customer's API integration on their own instead of escalating every API-related ticket.

> **Independent educational material.** Based on the public API documentation of C2S (Contact2Sale): <https://docs-api-leads.c2sapp.com/>. This is not an official product and is not maintained by the company. Where the course notes differences between the documentation and the observed API behavior, those notes come from tests on a test account and may change over time.

The course content is in **Brazilian Portuguese**.

## Repository structure

| Path | Contents |
| --- | --- |
| `docs/curso/` | The course: an overview plus 8 modules (46 lessons), from API fundamentals to diagnostics |
| `docs/quiz/` | Quizzes in JSON: 4 questions per lesson and a 12-question bank per module |
| `docs/00-referencia-api.md` | Quick reference: endpoints, payload shapes, webhooks, error codes and FAQ |
| `postman/` | Postman collection (39 requests grouped as in the official docs) and an environment template |
| `docs-site/index.html` | The whole course as a single static HTML page, with lesson quizzes, module tests and progress saved in the browser |
| `tools/` | PowerShell scripts that generate the Postman files and the HTML page from the sources |

| Module | Topic |
| --- | --- |
| M0 | API fundamentals: HTTP methods, URLs, headers, JSON, status codes |
| M1 | Postman from scratch: environments, collections, inherited authentication |
| M2 | Leads: list, filter, paginate, create, update, forward, tags, messages, status, closed deals |
| M3 | Users, companies and tags |
| M4 | Distribution rules and queues |
| M5 | Sales stand and blocklist |
| M6 | Webhooks: subscribing, testing and troubleshooting delivery |
| M7 | Automation (Collection Runner), reproducing a customer's integration, diagnostics checklist |

## How to use

1. Install [Postman](https://www.postman.com/downloads/) (desktop app).
2. **Import** `postman/API-C2S.postman_collection.json` and `postman/C2S.postman_environment.json`.
3. Select the environment and fill in `token` with a token from **your own test account**. Never use a customer's production token for practice.
4. Start with read-only requests (`GET`). Write requests are blocked until you deliberately set `allow_writes = true` in the environment.
5. Follow the lessons in `docs/curso/` in order, or open `docs-site/index.html` in a browser to take the course with quizzes.

To regenerate the generated files after editing the sources (Windows PowerShell):

```powershell
powershell -ExecutionPolicy Bypass -File tools/build-postman.ps1   # postman/*.json
powershell -ExecutionPolicy Bypass -File tools/build-trilha.ps1    # docs-site/index.html
```

## API security practices covered

- **Bearer authentication:** every call sends `Authorization: Bearer <token>`. The collection sets it once at collection level and every request inherits it, so the token is never copied into individual requests.
- **Tokens per account, kept out of files:** the token lives in an environment variable marked as *secret*; the environment template ships with it empty. The course explains that the token represents the whole company account, is shown only once, and should be replaced if exposed.
- **Write protection:** a collection-level pre-request script refuses any non-`GET` request unless `allow_writes` is `true`, which prevents accidental changes on the wrong account.
- **Reading errors before escalating:** how to tell a request problem (4xx) from a server problem (5xx), including this API's specifics (an invalid or missing token returns `403 access_denied`, validation errors also return `403` with a message, a missing required field can return `401`, and duplicates or mismatches return `422`), plus rate limiting (`429`, 10 calls per minute per endpoint).
- **Webhooks:** subscribing and cancelling events, testing delivery with a request inspector, why one URL per token matters, and why the receiving endpoint should validate requests on its own side.
- **Least-impact testing:** use a test account, prefix test data, prefer reads, restore queue settings after testing, and never paste real tokens into tickets or chats.

## What I learned building it

- Reading an API reference critically and validating it against real responses: pagination, date formats and error codes did not always match the documentation, and the course records those differences.
- Turning repetitive support investigations into a step-by-step diagnostic routine (collect, validate the token, reproduce, compare, escalate with evidence).
- Designing safe defaults for people who are learning, so that a mistake costs a blocked request instead of changed customer data.

---

### Resumo em português

Curso prático, em Markdown e com collection do Postman, sobre integração com a API de um CRM: leads, cadastros, distribuição, webhooks, automação e diagnóstico. Foi criado para que o time de suporte técnico consiga testar e diagnosticar integrações de clientes sem depender de escalonamentos. Material educacional independente, baseado na documentação pública da API da C2S (<https://docs-api-leads.c2sapp.com/>); não é um produto oficial. Para usar, importe a collection e o environment no Postman, preencha o token da **sua própria conta de teste** e lembre que a escrita fica bloqueada até `allow_writes = true`.
