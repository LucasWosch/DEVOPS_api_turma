# docker_run_turmas.ps1

Write-Host "Criando rede se não existir..."

# Cria a rede (só se ainda não existir)
docker network inspect rede-faculdade > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    docker network create rede-faculdade
    Write-Host "Rede 'rede-faculdade' criada."
} else {
    Write-Host "Rede 'rede-faculdade' já existe."
}

Write-Host "Iniciando container..."

# Executa o container
docker run -d `
  --name container-turmas `
  --network rede-faculdade `
  -p 4000:4000 `
  -v ${PWD}:/app `
  api-turma

Write-Host "Container iniciado com sucesso!"
