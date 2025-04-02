const claves = [
    "qwerty123",
    "asdfgh456",
    "zxcvbn789",
    "rtyu5678",
    "poiuyt321",
    "zp5cde9876",
    "ghijkl543",
    "mnbvcx654",
    "w2345abcd",
    "letmein987",
    "securekey1",
    "sunshine12",
    "strongpass",
    "monkey321",
    "dragon7890",
    "iloveyou123",
    "abcxyz456",
    "password01",
    "qazwsx987",
    "j123qwe456",
    "randomkey1",
    "welcome01",
    "terovemom1",
    "superman987",
    "trustno123",
    "football99",
    "openme2023",
    "quickpass1",
    "key987654",
    "safepassword"
];


function clavesRegistro() {
    const indiceAleatorio = Math.floor(Math.random() * claves.length);
    return claves[indiceAleatorio];
}