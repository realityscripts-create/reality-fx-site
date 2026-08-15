# Generate Reality FX PWA icons — gold crown on the black rounded square,
# matching the OS brand. Pure System.Drawing, no external deps.
Add-Type -AssemblyName System.Drawing
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$icons = @{ 'icon-192.png' = 192; 'icon-512.png' = 512; 'maskable-512.png' = 512 }

function Draw-Icon([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::FromArgb(255, 10, 10, 10))   # near-black

  # Rounded-square background (slightly lifted panel tone)
  $panel = New-Object System.Drawing.Drawing2D.GraphicsPath
  $r = [int]($size * 0.22)
  $panel.AddArc(0, 0, $r, $r, 180, 90)
  $panel.AddArc($size - $r, 0, $r, $r, 270, 90)
  $panel.AddArc($size - $r, $size - $r, $r, $r, 0, 90)
  $panel.AddArc(0, $size - $r, $r, $r, 90, 90)
  $panel.CloseFigure()
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 20, 20, 20))
  $g.FillPath($brush, $panel)
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 201, 162, 39), [math]::Max(2, $size * 0.045))
  $g.DrawPath($pen, $panel)

  # Gold crown — the OS's minimal stroke crown, scaled to the icon
  $s = $size / 24.0
  $gold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 193, 88), [double][math]::Max(1.8, $size * 0.075))
  $gold.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $gold.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $gold.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  # crown outline: M2 18h20 M4 17l-1-9 6 4 3-6 3 6 6-4-1 9H4z
  function Px([double]$x, [double]$y) { New-Object System.Drawing.PointF([float]($x * $s), [float]($y * $s)) }
  $pts1 = [System.Drawing.PointF[]]@(
    (Px 4 17), (Px 3 8), (Px 9 12), (Px 12 6), (Px 15 12), (Px 21 8), (Px 20 17)
  )
  $g.DrawLines($gold, $pts1)
  # band: M2 18h20
  $g.DrawLine($gold, [float](2 * $s), [float](18 * $s), [float](22 * $s), [float](18 * $s))

  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $pen.Dispose(); $brush.Dispose(); $gold.Dispose(); $panel.Dispose()
  $g.Dispose(); $bmp.Dispose()
  Write-Output ("wrote " + $path)
}

foreach ($k in $icons.Keys) {
  Draw-Icon $icons[$k] (Join-Path $dir $k)
}
