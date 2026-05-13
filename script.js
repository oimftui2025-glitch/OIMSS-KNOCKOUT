// Fungsi buat ngelolosin tim ke babak selanjutnya
function advanceTeam(currentSlotId, nextSlotId) {
    const currentInput = document.getElementById(currentSlotId);
    const nextInput = document.getElementById(nextSlotId);
    
    const teamName = currentInput.value.trim();

    if (teamName === "") {
        alert("⚠️ Isi dulu nama timnya bos!");
        return;
    }

    // Pindahin nama tim ke kotak selanjutnya
    nextInput.value = teamName;
    nextInput.classList.add('filled');

    // Kasih efek glow kecil pas berhasil dilolosin
    nextInput.style.transform = "scale(1.05)";
    setTimeout(() => {
        nextInput.style.transform = "scale(1)";
    }, 200);

    // Kalo yang diklik itu buat masuk slot Champion
    if (nextSlotId === 'champion') {
        triggerChampionEffect();
    }
}

// Fitur ngereset semua bracket dari awal
function resetBracket() {
    const confirmReset = confirm("Yakin mau reset semua data bracket?");
    if (confirmReset) {
        // Kosongin semua input Quarter Final
        for (let i = 1; i <= 8; i++) {
            document.getElementById(`qf-${i}`).value = '';
        }
        
        // Kosongin Semi Final
        for (let i = 1; i <= 4; i++) {
            let sf = document.getElementById(`sf-${i}`);
            sf.value = '';
            sf.classList.remove('filled');
        }

        // Kosongin Final
        for (let i = 1; i <= 2; i++) {
            let fin = document.getElementById(`final-${i}`);
            fin.value = '';
            fin.classList.remove('filled');
        }

        // Kosongin Champion
        let champ = document.getElementById('champion');
        champ.value = '';
        champ.classList.remove('filled');
    }
}

// Efek suara & visual pas ada tim yang menang Final
function triggerChampionEffect() {
    // Bunyiin suara terompet/kemenangan pake Oscillator (Web Audio API)
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    
    // Nada kemenangan sederhana
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.4); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.6); // C6
    
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
}
