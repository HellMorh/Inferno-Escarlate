
# ==========================================
# INFERNO ESCARLATE
# PREPARACAO SEGURA DE PUBLICACAO
# ==========================================

$ErrorActionPreference = "Stop"

$raiz = $PSScriptRoot

$projeto = Join-Path $raiz "teste-eleventy"
$origem = Join-Path $projeto "_site"
$destino = Join-Path $raiz "publicacao-eleventy"

$eleventy = Join-Path $projeto "node_modules\.bin\eleventy.cmd"

if (-not (Test-Path $eleventy)) {
    throw "Eleventy nao encontrado."
}

Write-Host "Gerando materias do Inferno Escarlate..."

# Executa o Eleventy
Push-Location $projeto

try {

    & $eleventy

    if ($LASTEXITCODE -ne 0) {
        throw "Erro na geracao do Eleventy."
    }

}
finally {
    Pop-Location
}

# Localiza o catalogo
$catalogo = Join-Path $origem "dados\materias.json"

if (-not (Test-Path $catalogo)) {
    throw "Catalogo nao encontrado."
}

# Le o arquivo JSON
$conteudoJson = Get-Content $catalogo -Raw -Encoding UTF8

# Corrige o problema do catalogo vazio
if ($conteudoJson.Trim() -eq "[]") {

    $materias = @()

    Write-Host "Nenhuma materia aprovada para publicacao."

}
else {

    $dadosJson = ConvertFrom-Json -InputObject $conteudoJson

    $materias = @(
        $dadosJson | Where-Object {
            $null -ne $_
        }
    )

}

# Lista de arquivos aprovados
$arquivosAprovados = @()

foreach ($materia in $materias) {

    $url = [string]$materia.url

    if ($url -notmatch '^/posts/[a-zA-Z0-9_-]+\.html$') {
        throw "URL de publicacao invalida: $url"
    }

    $caminhoRelativo = $url.TrimStart("/") -replace '/', '\'

    $arquivoOrigem = Join-Path $origem $caminhoRelativo

    if (-not (Test-Path $arquivoOrigem -PathType Leaf)) {
        throw "HTML aprovado nao encontrado: $url"
    }

    $arquivosAprovados += [PSCustomObject]@{
        CaminhoRelativo = $caminhoRelativo
        Origem = $arquivoOrigem
    }

}

# Limpa a pasta temporaria de preparacao
if (Test-Path $destino) {

    Remove-Item $destino -Recurse -Force

}

# Cria a pasta de preparacao
New-Item -ItemType Directory -Force -Path $destino |
    Out-Null

$destinoDados = Join-Path $destino "dados"

New-Item -ItemType Directory -Force -Path $destinoDados |
    Out-Null

# Copia o catalogo
Copy-Item $catalogo (
    Join-Path $destinoDados "materias.json"
) -Force

# Copia somente materias aprovadas
foreach ($arquivo in $arquivosAprovados) {

    $arquivoDestino = Join-Path $destino $arquivo.CaminhoRelativo

    $pastaDestino = Split-Path $arquivoDestino -Parent

    New-Item -ItemType Directory -Force -Path $pastaDestino |
        Out-Null

    Copy-Item $arquivo.Origem $arquivoDestino -Force

}

Write-Host ""
Write-Host "Preparacao concluida!" -ForegroundColor Green
Write-Host "Materias aprovadas: $($materias.Count)"
Write-Host "Destino: $destino"
Write-Host "Nada foi publicado no GitHub."
