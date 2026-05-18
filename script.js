// ================= FITUR BRACKET BAWAAN =================
function advanceTeam(currentSlotId, nextSlotId) {
    const currentInput = document.getElementById(currentSlotId);
    const nextInput = document.getElementById(nextSlotId);
    const teamName = currentInput.value.trim();

    if (teamName === "") return alert("⚠️ Isi dulu nama timnya bos!");

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
        for (let i = 1; i <= 8; i++) {
            let qf = document.getElementById(`qf-${i}`);
            qf.value = ''; qf.classList.remove('filled');
        }
        
        for (let i = 1; i <= 4; i++) {
            let sf = document.getElementById(`sf-${i}`);
            sf.value = ''; sf.classList.remove('filled');
        }

        for (let i = 1; i <= 2; i++) {
            let fin = document.getElementById(`final-${i}`);
            fin.value = ''; fin.classList.remove('filled');
        }

        let champ = document.getElementById('champion');
        champ.value = ''; champ.classList.remove('filled');
    }
}

// Efek suara pas ada tim yang menang Final
function triggerChampionEffect() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.4); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.6); // C6
    
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
}

// ================= FITUR DIGITAL DRAWING =================
// Daftar ke-8 Tim yang fix tanding
const baseTeams = ['DTE', 'DTI', 'DTSL', 'DTM', 'DTMM', 'DTK', 'DA', 'PI'];
let availableTeams = [];
let drawIndex = 0; // 0 sampai 7 (Buat ngisi qf-1 sampai qf-8)
let shuffleInterval;

function startDrawing() {
    // Reset Quarter Final biar bersih sblm diundi
    for (let i = 1; i <= 8; i++) {
        let qf = document.getElementById(`qf-${i}`);
        qf.value = ''; qf.classList.remove('filled');
    }
    
    // Copy array baseTeams ke availableTeams biar bisa dipotong satu-satu
    availableTeams = [...baseTeams];
    drawIndex = 0;
    
    document.getElementById('draw-modal').classList.remove('hidden');
    document.getElementById('close-draw-btn').classList.add('hidden');
    
    drawNext(); // Mulai undian pertama
}

function drawNext() {
    // Kalau ke-8 tim udah diundi semua
    if(drawIndex >= 8) {
        document.getElementById('draw-target').innerText = "SEMUA TIM TELAH DITEMPATKAN!";
        document.getElementById('draw-result').innerText = "🏆";
        document.getElementById('next-draw-btn').classList.add('hidden');
        document.getElementById('close-draw-btn').classList.remove('hidden');
        return;
    }

    document.getElementById('next-draw-btn').classList.add('hidden');
    
    // Nampilin teks misal: "Menentukan Slot: QF 1 - Tim 1"
    let matchNum = Math.floor(drawIndex/2) + 1;
    document.getElementById('draw-target').innerText = `Menentukan: QUARTER FINAL ${matchNum} - Slot ${drawIndex%2 + 1}`;
    
    let ticks = 0;
    
    // Animasi Roulette Ngacak Tim
    shuffleInterval = setInterval(() => {
        // Tunjukin nama acak dari tim yang TERSISA
        let randomTemp = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        document.getElementById('draw-result').innerText = randomTemp;
        
        playTickSound();
        
        ticks++;
        if(ticks > 25) { // Setelah 2.5 detik (25 x 100ms), stop
            clearInterval(shuffleInterval);
            finalizeDraw();
        }
    }, 100);
}

function finalizeDraw() {
    // Pilih 1 tim beneran yang bakal ngisi slot ini
    let randomIndex = Math.floor(Math.random() * availableTeams.length);
    let selectedTeam = availableTeams[randomIndex];
    
    // Hapus tim itu dari daftar biar nggak keundi 2 kali
    availableTeams.splice(randomIndex, 1); 
    
    // Tunjukin hasil akhirnya di Modal
    document.getElementById('draw-result').innerText = selectedTeam;
    document.getElementById('draw-result').style.color = "var(--neon-blue)";
    
    setTimeout(() => { document.getElementById('draw-result').style.color = "var(--gold)"; }, 300);
    
    // Masukin hasil ke input Bracket HTML
    let inputSlot = document.getElementById(`qf-${drawIndex + 1}`);
    inputSlot.value = selectedTeam;
    inputSlot.classList.add('filled');
    
    playBeepSound();
    
    drawIndex++;
    document.getElementById('next-draw-btn').classList.remove('hidden');
}

function closeDrawing() {
    document.getElementById('draw-modal').classList.add('hidden');
}

// Suara pas lagi ngacak
function playTickSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.05);
}

// Suara pas berenti dapet tim
function playBeepSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
}
