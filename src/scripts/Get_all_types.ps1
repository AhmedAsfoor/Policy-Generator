# Initialize an empty array to hold resource types
$resourceTypes = @()

# Retrieve all resource providers and their resource types
Get-AzResourceProvider -ListAvailable | ForEach-Object {
    $providerNamespace = $_.ProviderNamespace
    $_.ResourceTypes | ForEach-Object {
        # Ensure ResourceTypeName exists and concatenate it with the ProviderNamespace
        if ($_.ResourceTypeName) {
            $resourceTypes += "$providerNamespace/$($_.ResourceTypeName)"
        }
    }
}

# Remove duplicates and sort the results
$uniqueResourceTypes = $resourceTypes | Sort-Object -Unique

# Convert the list to JSON
$jsonOutput = $uniqueResourceTypes | ConvertTo-Json -Depth 1 -Compress

# Save the JSON to a file
$jsonFilePath = "azure_resource_types.json"
Set-Content -Path $jsonFilePath -Value $jsonOutput -Encoding utf8

# Confirm the file is saved
Write-Host "JSON saved to $jsonFilePath"