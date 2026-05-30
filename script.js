// Fungsi untuk tombol pintas / contoh cepat
function setContoh(nomorISBN) {
    document.getElementById("isbnInput").value = nomorISBN;
    hitungISBN(); // Langsung hitung setelah angka dimasukkan
}

// Fungsi utama perhitungan ISBN-13
function hitungISBN() {
    let inputRaw = document.getElementById("isbnInput").value;
    let isbn = inputRaw.replace(/[- ]/g, ""); // Hapus strip atau spasi jika ada

    // Validasi input: wajib 13 angka
    if (isbn.length !== 13 || isNaN(isbn)) {
        alert("Error: Input harus tepat 13 digit angka!");
        return;
    }

    // Tampilkan semua section yang tadinya disembunyikan
    document.getElementById("sectionVisual").classList.remove("id-hidden");
    document.getElementById("sectionLangkah").classList.remove("id-hidden");
    document.getElementById("sectionHasil").classList.remove("id-hidden");

    let totalPenjumlahan = 0;
    let stringLangkah1 = "";
    let htmlGrid = "";

    // Loop 12 digit pertama untuk kalkulasi bobot
    for (let i = 0; i < 12; i++) {
        let digit = parseInt(isbn[i]);
        let bobot = (i % 2 === 0) ? 1 : 3;
        let hasilKali = digit * bobot;
        totalPenjumlahan += hasilKali;

        // Susun teks langkah 1
        stringLangkah1 += `(${digit} &times; ${bobot})`;
        if (i < 11) stringLangkah1 += " + ";

        // Susun visualisasi blok grid (12 digit pertama)
        htmlGrid += `
            <div class="digit-block">
                <div class="block-box">${digit}</div>
                <div class="block-weight">&times;${bobot}</div>
            </div>
        `;
    }

    // Ambil digit ke-13 (Check Digit dari user)
    let digitTerakhirUser = parseInt(isbn[12]);

    // Tambahkan digit ke-13 ke visualisasi grid (diberi tanda khusus)
    htmlGrid += `
        <div class="digit-block">
            <div class="block-box" style="color: #e2e8f0; border-color: #e2e8f0;">${digitTerakhirUser}</div>
            <div class="block-weight">Check</div>
        </div>
    `;
    document.getElementById("visualGrid").innerHTML = htmlGrid;

    // Hitung Modulo 10
    let sisaSuku = totalPenjumlahan % 10;
    let checkDigitSeharusnya = (10 - sisaSuku) % 10;

    // Output Langkah 1
    document.getElementById("langkah1").innerHTML = stringLangkah1;

    // Output Langkah 2
    document.getElementById("langkah2").innerHTML = `Total hasil perkalian 12 digit pertama = <b>${totalPenjumlahan}</b>`;

    // Output Langkah 3
    document.getElementById("langkah3").innerHTML = `
        Sisa bagi Modulo 10: ${totalPenjumlahan} mod 10 = <b>${sisaSuku}</b><br>
        Check digit seharusnya: (10 - ${sisaSuku}) mod 10 = <b>${checkDigitSeharusnya}</b>
    `;

    // Penentuan Hasil Akhir (Validasi)
    let badge = document.getElementById("badgeHasil");
    if (checkDigitSeharusnya === digitTerakhirUser) {
        // Jika VALID
        badge.innerText = "ISBN VALID";
        badge.className = "badge badge-valid";
        
        document.getElementById("txtKondisi").innerHTML = `Sesuai rumus formal, hasil penjumlahan modulo 10 harus bernilai 0.<br> Perhitungan: (${totalPenjumlahan} + ${digitTerakhirUser}) mod 10 = <b>0</b>`;
        document.getElementById("txtKesimpulan").innerHTML = `<span style="color: #4ade80;">✔ Sukses!</span> Digit ke-13 pada kode yang dimasukkan (${digitTerakhirUser}) cocok dengan hasil perhitungan rumus matematika diskrit (${checkDigitSeharusnya}).`;
    } else {
        // Jika TIDAK VALID
        badge.innerText = "ISBN TIDAK VALID";
        badge.className = "badge badge-invalid";

        document.getElementById("txtKondisi").innerHTML = `Perhitungan formal tidak menghasilkan nilai 0.<br> Perhitungan: (${totalPenjumlahan} + ${digitTerakhirUser}) mod 10 = <b>${(totalPenjumlahan + digitTerakhirUser) % 10}</b>`;
        document.getElementById("txtKesimpulan").innerHTML = `<span style="color: #f87171;">❌ Salah!</span> Digit terakhir yang dimasukkan adalah ${digitTerakhirUser}. Padahal berdasarkan rumus Matematika Diskrit, digit ke-13 seharusnya adalah <b>${checkDigitSeharusnya}</b>.`;
    }
}