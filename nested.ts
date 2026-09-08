let hasil: string = "";

for (let i: number = 1; i <= 10; i++) {
    for (let j: number = 1; j <= 10; j++) {
        let perkalian: number = i * j;
        hasil += `${i}x${j}=${perkalian} `;
    }
    hasil += `<br>`;
}

const output = document.getElementById("output");
if (output !== null) {
    output.innerHTML = hasil;
}