# Set the file path for the output JSON
$jsonFilePath = "src/data/control_plane_roles.json"

# Fetch all role definitions, exclude custom roles, and transform them into the desired structure
$jsonOutput = Get-AzRoleDefinition | Where-Object { -not $_.IsCustom } | ForEach-Object {
    [PSCustomObject]@{
        roleId   = "/providers/Microsoft.Authorization/roleDefinitions/$($_.Id.Split('/')[-1])"
        roleName = $_.Name
    }
} | ConvertTo-Json -Depth 10

# Save the JSON to a file
Set-Content -Path $jsonFilePath -Value $jsonOutput -Encoding utf8

# Confirm the file is saved
Write-Host "JSON saved to $jsonFilePath"