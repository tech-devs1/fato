$files = @(
  'c:\agro\fato\src\components\auth\AuthPage.jsx',
  'c:\agro\fato\src\contexts\AuthContext.jsx',
  'c:\agro\fato\src\lib\firebase.js',
  'c:\agro\fato\src\App.jsx'
)
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f)
  $c = $c.Replace([char]0x2019, [char]0x0027)
  $c = $c.Replace([char]0x2018, [char]0x0027)
  $c = $c.Replace([char]0x201C, [char]0x0022)
  $c = $c.Replace([char]0x201D, [char]0x0022)
  [System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
}
Write-Host "All done"
