# 🏫 API de Turmas

API RESTful desenvolvida com Node.js e Express para gerenciamento de **turmas**, **disciplinas**, **professores**. Esta API consome dados de uma API externa de **alunos**.

---

## 📁 Recursos

- Cadastro de turmas e associação com alunos e disciplinas
- Listagem de alunos por turma
- Disciplinas associadas à turma com informações do professor
- Integração via rede Docker com API de Alunos

---

## 🚀 Execução

A execução da aplicação deve ser feita via scripts PowerShell disponíveis no repositório:

- `docker_build.ps1` – realiza o build da imagem Docker
- `docker_run.ps1` – executa o container da API de turmas

> **Atenção:** Certifique-se de que os containers estão na mesma rede Docker (`rede-faculdade`).

---

## 📬 Testes via Postman

Todos os endpoints estão prontos para teste através da coleção Postman incluída no repositório.

📁 Arquivo: `postman-collection-turmas.json`

### 🔗 A coleção cobre:
- Cadastro e listagem de turmas
- Associação de múltiplos alunos à turma
- Visualização detalhada de turmas com alunos, disciplinas e professores
- Endpoints de professores, disciplinas e turmas

---

## 🔗 Integração com a API de Alunos

A comunicação com a API de alunos é feita através da URL interna `http://container-alunos:3000/alunos`, assumindo que o nome do container da API de alunos seja `container-alunos`.

---

## 👨‍💻 Tecnologias

- Node.js + Express
- Docker
- Axios
- Nodemon (para reload automático durante o desenvolvimento)
- Postman (coleção para testes)

---

## 🧑‍🏫 Exemplo de retorno `/turmas`

```json
[
  {
    "id": 1,
    "nome": "1º Ano A",
    "alunos": [
      { "id": 1, "nome": "João" },
      { "id": 2, "nome": "Maria" }
    ],
    "disciplinas": [
      {
        "id": 1,
        "nome": "Matemática",
        "professor": {
          "id": 1,
          "nome": "Prof. Ana"
        }
      }
    ]
  }
]
