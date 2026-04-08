# PowerShell: slide11_temp.pptx의 spTree를 브랜치Q_발표_v3.pptx slide11에 이식
# .NET ZipArchive 사용 → JSZip과 달리 ZIP 구조를 최소한으로 변경

Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mainPath = Join-Path $dir "브랜치Q_발표_v3.pptx"
$tempPath = Join-Path $dir "slide11_temp.pptx"

if (-not (Test-Path $tempPath)) {
    Write-Error "slide11_temp.pptx 파일이 없습니다. 먼저 generate_slide11_temp.js를 실행하세요."
    exit 1
}

# ── 1. temp pptx에서 새 slide1.xml 읽기 ──────────────────
$tempZip = [System.IO.Compression.ZipFile]::OpenRead($tempPath)
$tempEntry = $tempZip.GetEntry("ppt/slides/slide1.xml")
$sr = [System.IO.StreamReader]::new($tempEntry.Open(), [System.Text.Encoding]::UTF8)
$newSlideXml = $sr.ReadToEnd()
$sr.Dispose()
$tempZip.Dispose()

# spTree 추출 (마지막 </p:spTree> 기준)
$spStart = $newSlideXml.IndexOf("<p:spTree>")
$spEnd   = $newSlideXml.LastIndexOf("</p:spTree>") + "</p:spTree>".Length
if ($spStart -lt 0) { Write-Error "spTree를 찾을 수 없습니다"; exit 1 }
$newSpTree = $newSlideXml.Substring($spStart, $spEnd - $spStart)

# bg 추출 (있으면)
$bgStart = $newSlideXml.IndexOf("<p:bg>")
$bgEnd   = $newSlideXml.IndexOf("</p:bg>") + "</p:bg>".Length
$newBg   = if ($bgStart -ge 0) { $newSlideXml.Substring($bgStart, $bgEnd - $bgStart) } else { $null }

# ── 2. 원본 pptx에서 slide11.xml 읽기 ────────────────────
$mainZip = [System.IO.Compression.ZipFile]::Open($mainPath, [System.IO.Compression.ZipArchiveMode]::Update)
$slide11 = $mainZip.GetEntry("ppt/slides/slide11.xml")

$sr2 = [System.IO.StreamReader]::new($slide11.Open(), [System.Text.Encoding]::UTF8)
$origXml = $sr2.ReadToEnd()
$sr2.Dispose()

# ── 3. XML 패치 (문자열 치환 — 정규식 없이) ────────────────
# spTree 교체
$oSpStart = $origXml.IndexOf("<p:spTree>")
$oSpEnd   = $origXml.LastIndexOf("</p:spTree>") + "</p:spTree>".Length
$patchedXml = $origXml.Substring(0, $oSpStart) + $newSpTree + $origXml.Substring($oSpEnd)

# bg 교체 (있으면)
if ($newBg) {
    $oBgStart = $patchedXml.IndexOf("<p:bg>")
    $oBgEnd   = $patchedXml.IndexOf("</p:bg>") + "</p:bg>".Length
    if ($oBgStart -ge 0) {
        $patchedXml = $patchedXml.Substring(0, $oBgStart) + $newBg + $patchedXml.Substring($oBgEnd)
    }
}

# 트랜지션 추가 (없으면)
$fadeTag = '<p:transition spd="med" advClick="1"><p:fade thruBlk="0"/></p:transition>'
if ($patchedXml.Contains("<p:transition")) {
    # 기존 트랜지션 교체
    $trStart = $patchedXml.IndexOf("<p:transition")
    $trEnd   = $patchedXml.IndexOf("</p:transition>") + "</p:transition>".Length
    $patchedXml = $patchedXml.Substring(0, $trStart) + $fadeTag + $patchedXml.Substring($trEnd)
} else {
    # </p:cSld> 뒤에 삽입
    $insertPos = $patchedXml.IndexOf("</p:cSld>") + "</p:cSld>".Length
    $patchedXml = $patchedXml.Substring(0, $insertPos) + $fadeTag + $patchedXml.Substring($insertPos)
}

# ── 4. 엔트리 삭제 후 재생성 ──────────────────────────────
$slide11.Delete()
$newEntry = $mainZip.CreateEntry("ppt/slides/slide11.xml", [System.IO.Compression.CompressionLevel]::Optimal)
$sw = [System.IO.StreamWriter]::new($newEntry.Open(), [System.Text.Encoding]::UTF8)
$sw.Write($patchedXml)
$sw.Dispose()

$mainZip.Dispose()

Write-Host "✅ 슬라이드 11 패치 완료: $mainPath"
