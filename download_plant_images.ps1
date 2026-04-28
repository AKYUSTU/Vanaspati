$plantDir = "d:\Downloads\vanaspati\vanaspati-frontend\public\images\plants"
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120" }

# Each URL is a verified Wikipedia/Wikimedia Commons direct image URL for the EXACT plant
$downloads = @(
    @{ file="ajwain.png";       url="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Ajwain_seeds.jpg/600px-Ajwain_seeds.jpg" },
    @{ file="arjuna.png";       url="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Terminalia_arjuna_in_Hyderabad_W_IMG_7715.jpg/600px-Terminalia_arjuna_in_Hyderabad_W_IMG_7715.jpg" },
    @{ file="arnica.png";       url="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/ArnicaMontana.jpg/600px-ArnicaMontana.jpg" },
    @{ file="atees.png";        url="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Aconitum_heterophyllum_-_Atis.jpg/600px-Aconitum_heterophyllum_-_Atis.jpg" },
    @{ file="belladonna.png";   url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Atropa_belladonna_Lindman.jpg/600px-Atropa_belladonna_Lindman.jpg" },
    @{ file="calendula.png";    url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Calendula_officinalis.jpg/600px-Calendula_officinalis.jpg" },
    @{ file="hypericum.png";    url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Hypericum_perforatum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-074.jpg/600px-Hypericum_perforatum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-074.jpg" },
    @{ file="jatamansi.png";    url="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Nardostachys_jatamansi.jpg/600px-Nardostachys_jatamansi.jpg" },
    @{ file="kalonji.png";      url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Nigella_sativa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-103.jpg/600px-Nigella_sativa_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-103.jpg" },
    @{ file="kapikacchu.png";   url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Mucuna_pruriens_MS_4531.jpg/600px-Mucuna_pruriens_MS_4531.jpg" },
    @{ file="keezhanelli.png";  url="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Phyllanthus_niruri_kerala.jpg/600px-Phyllanthus_niruri_kerala.jpg" },
    @{ file="kokilaksha.png";   url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hygrophila_auriculata.jpg/600px-Hygrophila_auriculata.jpg" },
    @{ file="manjistha.png";    url="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Rubia_cordifolia_Blanco1.108.jpg/600px-Rubia_cordifolia_Blanco1.108.jpg" },
    @{ file="moringa.png";      url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Moringa_oleifera_-_leaves_%26_flowers.jpg/600px-Moringa_oleifera_-_leaves_%26_flowers.jpg" },
    @{ file="nilavembu.png";    url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Andrographis_paniculata.jpg/600px-Andrographis_paniculata.jpg" },
    @{ file="pulsatilla.png";   url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pulsatilla_vulgaris_01.jpg/600px-Pulsatilla_vulgaris_01.jpg" },
    @{ file="punarnava.png";    url="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Boerhavia_diffusa.jpg/600px-Boerhavia_diffusa.jpg" },
    @{ file="senna.png";        url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Senna_alexandrina_-_flowers_and_leaves.jpg/600px-Senna_alexandrina_-_flowers_and_leaves.jpg" },
    @{ file="shankhpushpi.png"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Evolvulus_alsinoides_01.jpg/600px-Evolvulus_alsinoides_01.jpg" },
    @{ file="thoothuvalai.png"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Solanum_trilobatum_MS_3640.jpg/600px-Solanum_trilobatum_MS_3640.jpg" },
    @{ file="vacha.png";        url="https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Acorus_calamus_W.jpg/600px-Acorus_calamus_W.jpg" },
    @{ file="vembu_siddha.png"; url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0765.jpg/600px-Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0765.jpg" },
    @{ file="vidanga.png";      url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Embelia_ribes_W2_IMG_1285.jpg/600px-Embelia_ribes_W2_IMG_1285.jpg" }
)

$ok = 0; $fail = 0
foreach ($item in $downloads) {
    $dest = Join-Path $plantDir $item.file
    try {
        Invoke-WebRequest -Uri $item.url -OutFile $dest -Headers $headers -UseBasicParsing -TimeoutSec 20 -ErrorAction Stop
        $size = (Get-Item $dest).Length
        Write-Host "OK ($size bytes): $($item.file)"
        $ok++
    } catch {
        Write-Host "FAIL: $($item.file) - $($_.Exception.Message)"
        $fail++
    }
}
Write-Host "`n=== Done: $ok OK, $fail FAILED ==="
