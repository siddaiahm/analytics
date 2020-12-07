//requiring path and fs modules
const path = require("path");
const fs = require("fs");
//joining path of directory
const directoryPath = path.join(__dirname, "./output/mobiles");
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  let folders = files.filter(
    (file) =>
      fs.lstatSync(directoryPath + "/" + file).isDirectory() && file !== "info"
  );

  //listing all files using forEach
  folders.forEach(async (folder) => {
    // Do whatever you want to do with the file
    let folderPath = directoryPath + "/" + folder;
    fs.readdir(folderPath, function (err, files) {
      //handling error
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      files = files.filter((file) => file.includes(".json"));
      let filesData = {};
      let promises = files.map((file) => {
        // Do whatever you want to do with the file
        let filePath = folderPath + "/" + file;
        let errorKey = file.split(".json")[0];

        return new Promise((resolve, reject) => {
          fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            data = JSON.parse(data);
            filesData[errorKey] = {
              count: data.length,
            };
            let info = data.map(
              ({
                time,
                android_version,
                apk_version,
                device_version,
                device_name,
                error_description,
                error,
              }) => {
                let vehicle = error_description.match(/KA(.{11})/)[0];
                return {
                  android_version: device_version || android_version,
                  device_name: device_name,
                  apk_version: apk_version,
                  error_description: error_description,
                  vehicle: vehicle,
                  time: time,
                  error: error,
                };
              }
            );
            filesData[errorKey]["data"] = info;
            resolve();
          });
        });
      });
      Promise.all(promises).then(() => {
        fs.existsSync(directoryPath + "/info") ||
          fs.mkdirSync(directoryPath + "/info");
        fs.writeFile(
          directoryPath + "/info/" + folder + ".json",
          JSON.stringify(filesData),
          (err, data) => {}
        );
      });
    });
  });
});
