$response = Invoke-RestMethod -Uri "http://localhost:3000/api/cockpit?organizationId=00000000-0000-0000-0000-000000000000" -ErrorAction Stop
$response | ConvertTo-Json -Depth 10
