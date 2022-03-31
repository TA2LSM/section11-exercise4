//--- Kurstakinden farklı bir yaklaşıma sahip özgün bir çözümdür (31.03.2022) ---
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express(); // app objesi burada express'ten yaratılıyor

/*********************************************************************************
 * Programı çalıştırmadan önce aşağıdaki kısım terminale girilmelidir
 * $env:vidly_jwtPrivateKey="mySecureKey"
 *
 * Mongodb'yi çalışırken durdurmak için yönetici olarak cmd penceresi açılır ve şu komut yazılır:
 * "net stop MongoDB" (eğer çalışan hizmet penceresi açıksa birkaç kere ctrl + c yapılabilir)
 * Tekrar başlatmak için: "net start MongoDB" (mongod işe yarıyor mu bilmiyorum)
 *********************************************************************************/
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
  // 0 ile çıkma demek hata yok, 0 hariç bir değer, "hata" ile çıkma demek. (genelde 1 kullanılıyor)
}

const dbPath = "mongodb://localhost/vidly";
// Önce error logger initialize ediliyor ki diğer modüller çalışmaya başlayınca
// bir hata olursa hemen log'lasın...
const { createErrorLogger, logger } = require("./startup/logging");
createErrorLogger(dbPath);

const { connectDatabase } = require("./startup/db");
// Buradaki modülde isimli bir fonksiyon export edildiği için bu şekilde yazıldı.
// module.exports.connectDatabase = function (dbPath, logger) {...}
// bu fonksiyon iki parametre alacağı için ismiyle bu dosyada çağırırken parametreleri
// ayrıca geçmemiz gerekiyor.
connectDatabase(dbPath, logger);

require("./startup/routes")(app);
// startup erişimi için "app", bu modüle parametre olarak geçiliyor. Burada isimsiz bir
// fonksiyon kullanılmışsa module.exports = function (app) {...} bu şekilde yazılır.
// fonksiyon parametre almasaydı yukarıda sadece () şeklinde yazılması gerekirdi. (app yok)

//--------------------------------------------------------------------------------
// Senkron kod akış hatası yarat
//throw new Error("Something failed during startup!");

// Asenkron kod akış hatası yara
// const p = Promise.reject(new Error("Something failed miserably!"));
// p.then(() => {
//   console.log("Promise Done...");
// }); // rejection'ı yakalamak için catch() bloğu kullanılmadı.
//--------------------------------------------------------------------------------

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`→ Listening on port ${port}...`));
