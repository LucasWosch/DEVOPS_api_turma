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
    const alunosResponse = await axios.get('http://localhost:3000/alunos');
    const alunos = alunosResponse.data;

    const turmasComAlunos = turmas.map(turma => ({
      ...turma,
      alunos: turma.alunosIds.map(id => alunos.find(a => a.id === id))
    }));

    res.json(turmasComAlunos);
  } catch (err) {
    res.status(500).send('Erro ao buscar alunos');
  }
});

app.post('/turmas', (req, res) => {
  const novaTurma = req.body;
  turmas.push(novaTurma);
  res.status(201).send('Turma criada');
});

app.post('/turmas/:turmaId/alunos/:alunoId', async (req, res) => {
    const turmaId = parseInt(req.params.turmaId);
    const alunoId = parseInt(req.params.alunoId);
  
    const turma = turmas.find(t => t.id === turmaId);
    if (!turma) {
      return res.status(404).send('Turma não encontrada');
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/alunos/${alunoId}`);
      const aluno = response.data;
  
      if (!turma.alunosIds.includes(aluno.id)) {
        turma.alunosIds.push(aluno.id);
      }
  
      res.status(200).send(`Aluno ${aluno.nome} adicionado à turma ${turma.nome}`);
    } catch (error) {
      res.status(404).send('Aluno não encontrado');
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
