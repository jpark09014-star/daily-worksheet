# Build docs/index.html: inline gen.js, subset Jua font to the characters used, embed icon.
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$src  = Get-Content -Raw -Encoding UTF8 "$root\src\app.html"
$gen  = (Get-Content -Raw -Encoding UTF8 "$root\src\pic2.js") + "`n" + (Get-Content -Raw -Encoding UTF8 "$root\src\pic.js") + "`n" + (Get-Content -Raw -Encoding UTF8 "$root\src\gen.js")
$all = $src + $gen
$chars = -join (($all.ToCharArray() | Where-Object { [int]$_ -ge 32 } | Sort-Object -Unique))
$ascii = -join (32..126 | ForEach-Object { [char]$_ })
$tmp = Join-Path $root 'build-tmp'; New-Item -ItemType Directory -Force $tmp | Out-Null
[IO.File]::WriteAllText("$tmp\chars.txt", $chars + $ascii + '①②③④⑤…×÷°²³', [Text.UTF8Encoding]::new($false))
python -m fontTools.subset "$root\src\Jua-Regular.ttf" --text-file="$tmp\chars.txt" --output-file="$tmp\jua-sub.ttf" --layout-features='*' --no-hinting
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$tmp\jua-sub.ttf"))
$ico = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$root\src\icon64.png"))
$out = $src.Replace('/*JUA_FONT*/', $b64).Replace('/*ICON64*/', $ico).Replace('/*GEN_JS*/', $gen)
New-Item -ItemType Directory -Force "$root\docs" | Out-Null
[IO.File]::WriteAllText("$root\docs\index.html", $out, [Text.UTF8Encoding]::new($false))
Copy-Item "$root\src\Jua-OFL.txt" "$root\docs\Jua-OFL.txt" -Force
"font subset bytes: " + (Get-Item "$tmp\jua-sub.ttf").Length
"index.html bytes: " + (Get-Item "$root\docs\index.html").Length