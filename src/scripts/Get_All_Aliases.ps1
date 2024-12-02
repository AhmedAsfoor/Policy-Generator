$aliases = Get-AzPolicyAlias

$output = $aliases | ForEach-Object {
    [PSCustomObject]@{
        ResourceType = "$($_.Namespace)/$($_.ResourceType)"
        Aliases = $_.Aliases | ForEach-Object {
            if ($_.Name -and $_.DefaultPath) {
                # Properly format alias and default path
                "$($_.Name) ($($_.DefaultPath))"
            } else {
                "$($_.Name) (No DefaultPath Found)"
            }
        }
    }
}

$jsonOutput = $output | ConvertTo-Json -Depth 10 -Compress

$outputFilePath = "src/data/AzPolicyAliases.json"
$jsonOutput | Out-File -FilePath $outputFilePath -Encoding utf8 -Force
