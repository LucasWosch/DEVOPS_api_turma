Write-Host "============================================"
Write-Host " Iniciando o build da imagem Docker: api-turma"
Write-Host "============================================`n"

docker build -t api-turma .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build concluído com sucesso!"
} else {
    Write-Host "Ocorreu um erro durante o build."
}