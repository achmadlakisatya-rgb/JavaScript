//deklarasi objek
const siswa = {
    nama: "Laki",
    kelas: "RPL",
    hobi: "badminton",
};
//Dot Notation
console.log(siswa.nama);
console.log(siswa.kelas);
console.log(siswa.hobi);
//Bracket Notation
console.log(siswa['nama']);
console.log(siswa['kelas']);
console.log(siswa['hobi']);
//template literal
console.log(hai ${siswa.nama}, kelasmu ${siswa.kelas}, hobimu ${siswa.hobi}.)
