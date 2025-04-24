const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 4000;

app.use(express.json());

// Dados em memória
let professores = [
  { id: 1, nome: 'Prof. Ana' },
  { id: 2, nome: 'Prof. Carlos' }
];

let disciplinas = [
  { id: 1, nome: 'Matemática', professorId: 1 },
  { id: 2, nome: 'História', professorId: 2 }
];

let turmas = [
  { id: 1, nome: '1º Ano A', disciplinaIds: [1, 2], alunosIds: [1, 2] }
];


// Turmas
app.get('/turmas', async (req, res) => {
  try {
    const alunosResponse = await axios.get('http://container-alunos:3000/alunos');
    const alunos = alunosResponse.data;

    const turmasComDetalhes = turmas.map(turma => {
      const alunosDaTurma = turma.alunosIds.map(id => alunos.find(a => a.id === id));

      const disciplinasDaTurma = turma.disciplinaIds.map(disciplinaId => {
        const disciplina = disciplinas.find(d => d.id === disciplinaId);
        const professor = professores.find(p => p.id === disciplina?.professorId);

        return {
          id: disciplina?.id,
          nome: disciplina?.nome,
          professor: professor ? {
            id: professor.id,
            nome: professor.nome
          } : null
        };
      });

      return {
        id: turma.id,
        nome: turma.nome,
        alunos: alunosDaTurma,
        disciplinas: disciplinasDaTurma
      };
    });

    res.json(turmasComDetalhes);
  } catch (err) {
    console.error('Erro ao buscar alunos:', err.message);
    res.status(500).send('Erro ao buscar alunos');
  }
});

app.post('/turmas', (req, res) => {
  const novaTurma = req.body;
  turmas.push(novaTurma);
  res.status(201).send('Turma criada');
});

app.post('/turmas/:turmaId/alunos', async (req, res) => {
  const turmaId = parseInt(req.params.turmaId);
  const { alunos: alunosIds } = req.body;

  const turma = turmas.find(t => t.id === turmaId);
  if (!turma) {
    return res.status(404).send('Turma não encontrada');
  }

  if (!Array.isArray(alunosIds)) {
    return res.status(400).send('O corpo da requisição deve conter um array de alunos');
  }

  try {
    const alunosAdicionados = [];

    for (const alunoId of alunosIds) {
      try {
        const response = await axios.get(`http://container-alunos:3000/alunos/${alunoId}`);
        const aluno = response.data;

        if (!turma.alunosIds.includes(aluno.id)) {
          turma.alunosIds.push(aluno.id);
          alunosAdicionados.push(aluno.nome);
        }
      } catch (error) {
        res.status(404).send(`Aluno com o ID: ${alunoId} não encontrado`);
      }
    }

    res.status(200).send(`Alunos adicionados à turma ${turma.nome}: ${alunosAdicionados.join(', ')}`);
  } catch (error) {
    res.status(500).send(`Erro ao adicionar alunos à turma\n ${error}`);
  }
});

// Disciplinas
app.get('/disciplinas', (req, res) => {
  const disciplinasComProfessor = disciplinas.map(d => ({
    ...d,
    professor: professores.find(p => p.id === d.professorId)
  }));
  res.json(disciplinasComProfessor);
});

app.post('/disciplinas', (req, res) => {
  const novaDisciplina = req.body;
  disciplinas.push(novaDisciplina);
  res.status(201).send('Disciplina criada');
});

// Professores
app.get('/professores', (req, res) => {
  res.json(professores);
});

app.post('/professores', (req, res) => {
  const novoProfessor = req.body;
  professores.push(novoProfessor);
  res.status(201).send('Professor adicionado');
});

app.listen(PORT, () => {
  console.log(`API Principal rodando na porta ${PORT}`);
});
