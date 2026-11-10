
# ==========================================
# INFERNO ESCARLATE
# APLICAR MATERIAS APROVADAS AO SITE
# ==========================================

$ErrorActionPreference = "Stop"

$raiz = $PSScriptRoot
$preparador = Join-Path $raiz "preparar-publicacao.ps1"
$origem = Join-Path $raiz "publicacao-eleventy"
$catalogoOrigem = Join-Path $origem "dados\materias.json"
$catalogoDestino = Join-Path $raiz "dados\materias.json"

# Primeiro, gera o pacote aprovado.
& $preparador

if (-not $?) {
    throw "Falha na preparacao das materias."
}

if (-not (Test-Path $catalogoOrigem -PathType Leaf)) {
    throw "Catalogo aprovado nao encontrado."
}

$conteudo = Get-Content $catalogoOrigem -Raw -Encoding UTF8
$dados = ConvertFrom-Json -InputObject $conteudo
$materias = @($dados | Where-Object { $null -ne $_ })

# Verifica todos os arquivos antes de copiar qualquer um.
$arquivos = @()

foreach ($materia in $materias) {

    $url = [string]$materia.url

    if ($url -cnotmatch '^/posts/[a-zA-Z0-9_-]+\.html$') {
        throw "URL invalida: $url"
    }

    $relativo = $url.TrimStart("/") -replace '/', '\'

    $arquivoOrigem = Join-Path $origem $relativo
    $arquivoDestino = Join-Path $raiz $relativo

    if (-not (Test-Path $arquivoOrigem -PathType Leaf)) {
        throw "Arquivo aprovado nao encontrado: $relativo"
    }

    # Evita substituir materias antigas.
    if (Test-Path $arquivoDestino) {
        throw "Arquivo ja existe no site: $relativo"
    }

    $arquivos += [PSCustomObject]@{
        Origem = $arquivoOrigem
        Destino = $arquivoDestino
    }
}

# Copia os HTMLs aprovados para o site.
foreach ($arquivo in $arquivos) {

    $pasta = Split-Path $arquivo.Destino -Parent

    New-Item -ItemType Directory -Force -Path $pasta |
        Out-Null

    Copy-Item $arquivo.Origem $arquivo.Destino
}

# Atualiza o catalogo principal.
New-Item -ItemType Directory -Force `
    -Path (Split-Path $catalogoDestino -Parent) |
    Out-Null

Copy-Item $catalogoOrigem $catalogoDestino -Force

Write-Host ""
Write-Host "Atualizacao local concluida!" -ForegroundColor Green
Write-Host "Materias aprovadas: $($materias.Count)"
Write-Host "Nenhum arquivo foi enviado ao GitHub."
