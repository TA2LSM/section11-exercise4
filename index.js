//--- Kurstakinden farklı bir yaklaşıma sahip özgün bir çözümdür (31.03.2022) ---

//const winston = require("winston");
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

const dbPath = "mongodb://localhost/vidly";
// Önce error logger initialize ediliyor ki diğer modüller çalışmaya başlayınca
// bir hata olursa hemen log'lasın...
const { createErrorLogger, logger } = require("./startup/logging");
createErrorLogger(dbPath);

require("./startup/config")();
// bu modülde export edilen parametre almayan bir fonksiyon olduğundan "()" ekleyerek
// onu direkt çağırdık.

const { connectDatabase } = require("./startup/db");
// Buradaki modülde isimli bir fonksiyon export edildiği için bu şekilde yazıldı.
// module.exports.connectDatabase = function (dbPath, logger) {...}
// bu fonksiyon iki parametre alacağı için ismiyle bu dosyada çağırırken parametreleri
// ayrıca geçmemiz gerekiyor.
connectDatabase(dbPath, logger);

require("./startup/validation")();
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
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  //logger.info(`Listening on port ${port}`); // logger'a erişim yok. undefined gözüküyor ???
});
