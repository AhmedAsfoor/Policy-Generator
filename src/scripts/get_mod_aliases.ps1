# Set the file path for the output JSON
$jsonFilePath = "src/data/modAlias.json"

# Fetch all Azure Policy aliases, filter those with 'Modifiable' attributes, 
# format their name and path, and save the results as JSON in the specified file.
$jsonOutput = Get-AzPolicyAlias |
    Select-Object -ExpandProperty 'Aliases' |
    Where-Object { 
        $_.DefaultMetadata.Attributes -eq 'Modifiable' 
    } |
    ForEach-Object { 
        "$($_.Name) ($($_.DefaultPath))" 
    } |
    ConvertTo-Json -Depth 10

# Save the JSON to a file
Set-Content -Path $jsonFilePath -Value $jsonOutput -Encoding utf8

# Confirm the file is saved
Write-Host "JSON saved to $jsonFilePath"