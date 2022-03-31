const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    //console.log("FATAL ERROR: jwtPrivateKey is not defined!");
    //process.exit(1);
    // 0 ile çıkma demek hata yok, 0 hariç bir değer, "hata" ile çıkma demek. (genelde 1 kullanılıyor)

    throw new Error("FATAL ERROR: jwtPrivateKey is not defined!");
    // her zaman "Error Objesi" fırlatmak, sonradan erişip detaylarına bakabilmek için daha iyidir
    // Diğer türlüsü: throw "error message"; şeklinde
  }
};
