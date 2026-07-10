$ErrorActionPreference = 'Stop'
$base='http://localhost:5000/api/pricing'
$h=@{ Authorization='yoflix dev-admin-token'; 'Content-Type'='application/json' }
Write-Host 'GET admin list'
$r1=Invoke-RestMethod -Uri "$base/admin" -Headers $h -Method Get -UseBasicParsing
$r1 | ConvertTo-Json -Depth 5 | Write-Output

Write-Host 'POST create'
$body = @{
  title='Test Plan from CI'
  slug='test-plan-ci'
  shortDescription='Temp plan'
  price='$15'
  billingType='monthly'
  features=@('Feature A','Feature B')
  buttonText='Choose Plan'
  badge=''
  isPopular=$false
  isFeatured=$false
  isActive=$true
  order=99
}
$r2=Invoke-RestMethod -Uri "$base/create" -Headers $h -Body ($body | ConvertTo-Json) -Method Post -UseBasicParsing
$r2 | ConvertTo-Json -Depth 5 | Write-Output
$createdId = $r2.data.pricingPlan._id
Write-Host "Created ID: $createdId"

Write-Host 'PATCH update'
$uBody=@{
  title='Test Plan from CI'
  slug='test-plan-ci'
  shortDescription='Updated description'
  price='$29'
}
$r3=Invoke-RestMethod -Uri "$base/update/$createdId" -Headers $h -Body ($uBody | ConvertTo-Json) -Method Patch -UseBasicParsing
$r3 | ConvertTo-Json -Depth 5 | Write-Output

Write-Host 'PATCH toggle'
$r4=Invoke-RestMethod -Uri "$base/toggle/$createdId" -Headers $h -Method Patch -UseBasicParsing
$r4 | ConvertTo-Json -Depth 5 | Write-Output

Write-Host 'DELETE'
$r5=Invoke-RestMethod -Uri "$base/delete/$createdId" -Headers $h -Method Delete -UseBasicParsing
$r5 | ConvertTo-Json -Depth 5 | Write-Output

Write-Host 'Final GET'
$r6=Invoke-RestMethod -Uri "$base/admin" -Headers $h -Method Get -UseBasicParsing
$r6 | ConvertTo-Json -Depth 5 | Write-Output
