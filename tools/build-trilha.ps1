# Builds docs-site/index.html from docs/curso/*.md, docs/quiz/*.json and docs/00-referencia-api.md
# Usage (from the repository root):  powershell -ExecutionPolicy Bypass -File tools/build-trilha.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false
function Read-Text($path) { [IO.File]::ReadAllText((Join-Path $root $path), $utf8) }

$modules = Get-ChildItem (Join-Path $root 'docs/curso') -Filter 'M*.md' | Sort-Object Name | ForEach-Object { [IO.File]::ReadAllText($_.FullName, $utf8) }

# Quizzes: docs/quiz/MNN.json (the first option of each question is the correct one; the page shuffles them)
$quiz = [ordered]@{}
Get-ChildItem (Join-Path $root 'docs/quiz') -Filter 'M*.json' | Sort-Object Name | ForEach-Object {
    $quiz[[string][int]$_.Name.Substring(1, 2)] = [IO.File]::ReadAllText($_.FullName, $utf8)
}

$data = [ordered]@{
    overview  = Read-Text 'docs/curso/01-curso-visao-geral.md'
    reference = Read-Text 'docs/00-referencia-api.md'
    modules   = @($modules)
    quiz      = $quiz
}
# ConvertTo-Json (PS 5.1) escapes < > & ' as \uXXXX, so the JSON can go straight into a <script> tag.
$json = $data | ConvertTo-Json -Depth 5 -Compress
if ($json -match '</script') { throw 'Content contains an unescaped </script>.' }

$html = (Read-Text 'tools/trilha-template.html').Replace('__COURSE_DATA__', $json)
$head = "<!doctype html>`n<html lang=`"pt-BR`">`n<head>`n<meta charset=`"utf-8`">`n<meta name=`"viewport`" content=`"width=device-width, initial-scale=1`">`n"
$out = Join-Path $root 'docs-site'
New-Item -ItemType Directory -Force $out | Out-Null
[IO.File]::WriteAllText((Join-Path $out 'index.html'), $head + $html + "`n</html>`n", $utf8)
Write-Host ("OK: docs-site/index.html ({0:N0} KB, {1} modules)" -f (($head.Length + $html.Length) / 1KB), $modules.Count)
