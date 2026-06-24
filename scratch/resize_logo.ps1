Add-Type -AssemblyName System.Drawing
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectDir = Split-Path -Parent $baseDir
$imgPath = Join-Path -Path $projectDir -ChildPath "public\app_logo.png"
$savePath = Join-Path -Path $projectDir -ChildPath "public\play_store_icon.png"
$img = [System.Drawing.Image]::FromFile($imgPath)
$bmp = New-Object System.Drawing.Bitmap 512, 512
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.DrawImage($img, 0, 0, 512, 512)
$bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bmp.Dispose()
$img.Dispose()
