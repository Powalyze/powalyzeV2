# Script PowerShell pour ajouter le mode mock aux API routes IA

$ErrorActionPreference = "Stop"

Write-Host "🔧 Application du mode mock aux API routes IA..." -ForegroundColor Cyan

# Fonction pour ajouter la logique mock à un fichier
function Add-MockLogic {
    param(
        [string]$FilePath,
        [string]$MockDataVar,
        [string]$EntityType
    )
    
    Write-Host "  - $FilePath..." -ForegroundColor Yellow
    
    $content = Get-Content $FilePath -Raw
    
    # Remplacer le bloc d'appel OpenAI par logique mock
    $pattern = '    // 6\. Appeler OpenAI[\s\S]*?const latency = Date\.now\(\) - startTime;'
    
    $replacement = @"
    // 6. Appeler OpenAI OU utiliser mock
    const startTime = Date.now();
    let ${EntityType}: any[];
    let tokensUsed = 0;

    if (USE_MOCK) {
      // MODE MOCK : Simuler délai et utiliser données mockées
      await simulateAPIDelay(5000, 9000);
      ${EntityType} = ${MockDataVar};
      tokensUsed = calculateMockTokens(userPrompt.length, JSON.stringify(${EntityType}).length);
    } else {
      // MODE PRODUCTION : Appel réel OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: ${EntityType.ToUpper()}_GENERATION_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      
      if (!response) {
        throw new Error('Empty response from OpenAI');
      }

      const parsedResponse = JSON.parse(response);
      ${EntityType} = Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.${EntityType} || [];
      tokensUsed = completion.usage?.total_tokens || 0;
    }

    const latency = Date.now() - startTime;
"@
    
    $content = $content -replace $pattern, $replacement
    
    # Remplacer completion.usage?.total_tokens par tokensUsed
    $content = $content -replace 'completion\.usage\?\.total_tokens \|\| 0', 'tokensUsed'
    
    # Ajouter mode dans meta
    $content = $content -replace '(latency_ms: latency,)', '$1`n        mode: USE_MOCK ? ''mock'' : ''production'','
    
    Set-Content $FilePath -Value $content -NoNewline
    
    Write-Host "    ✅ Done" -ForegroundColor Green
}

# Appliquer aux 4 fichiers
Write-Host ""
Add-MockLogic `
    -FilePath "app/api/ai/decisions/generate/route.ts" `
    -MockDataVar "MOCK_DECISIONS" `
    -EntityType "decisions"

Add-MockLogic `
    -FilePath "app/api/ai/scenarios/generate/route.ts" `
    -MockDataVar "MOCK_SCENARIOS" `
    -EntityType "scenarios"

Add-MockLogic `
    -FilePath "app/api/ai/objectives/generate/route.ts" `
    -MockDataVar "MOCK_OBJECTIVES" `
    -EntityType "objectives"

# Report est special (summary + recommendations)
Write-Host "  - app/api/ai/report/generate/route.ts..." -ForegroundColor Yellow
Write-Host "    ⚠️  Nécessite ajustement manuel pour MOCK_REPORT" -ForegroundColor Yellow

Write-Host ""
Write-Host "✅ Mode mock appliqué avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Notes:" -ForegroundColor Cyan
Write-Host "  - USE_MOCK = true si OPENAI_API_KEY commence par 'sk-fake'"
Write-Host "  - Délai simulé : 5-9 secondes par génération"
Write-Host "  - Tokens calculés automatiquement"
Write-Host "  - Données mockées réalistes et cohérentes"
Write-Host ""
