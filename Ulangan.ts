"use strict";
let namaHari = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu"
];
let jumlahHari = Number(prompt("Masukkan jumlah hari:"));
let hasil = "";
let totalJarak = 0;
let jumlahValid = 0;
if (jumlahHari < 1 || jumlahHari > 7) {
    hasil = "Jumlah hari harus antara 1 sampai 7.";
}
else {
    for (let i = 0; i < jumlahHari; i++) {
        let jarak = Number(prompt(`Masukkan jarak hari ${namaHari[i]} (km):`));
        if (jarak <= 0) {
            hasil += `Jarak hari ${namaHari[i]} tidak valid<br>`;
            continue;
        }
        else {
            hasil += `${namaHari[i]} - Jarak ${jarak} km<br>`;
            totalJarak += jarak;
            jumlahValid++;
        }
    }
    let rataRata = 0;
    if (jumlahValid > 0) {
        rataRata = totalJarak / jumlahValid;
    }
    hasil += `<br>Total Jarak: ${totalJarak} km<br>`;
    hasil += `Rata-rata Jarak: ${rataRata} km`;
}
const output = document.getElementById("output");
if (output) {
    output.innerHTML = hasil;
}
