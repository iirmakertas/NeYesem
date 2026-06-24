Add-Type -AssemblyName System.Drawing
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectDir = Split-Path -Parent $baseDir
$logoPath = Join-Path -Path $projectDir -ChildPath "public\app_logo.png"
$savePath = Join-Path -Path $projectDir -ChildPath "public\feature_graphic.png"

$bmp = New-Object System.Drawing.Bitmap 1024, 500
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Fill background with a nice warm color (Orange/Red)
$bgColor = [System.Drawing.Color]::FromArgb(255, 255, 107, 107) # #FF6B6B
$brush = New-Object System.Drawing.SolidBrush $bgColor
$graphics.FillRectangle($brush, 0, 0, 1024, 500)

# Load logo and draw it in the center
$logo = [System.Drawing.Image]::FromFile($logoPath)
# Logo is 1024x1024, let's draw it at 400x400
# X = (1024 - 400) / 2 = 312
# Y = (500 - 400) / 2 = 50
$graphics.DrawImage($logo, 312, 50, 400, 400)

$bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)

$brush.Dispose()
$graphics.Dispose()
$bmp.Dispose()
$logo.Dispose()
