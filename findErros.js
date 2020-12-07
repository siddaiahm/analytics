//requiring path and fs modules
const path = require("path");
const fs = require("fs");
//joining path of directory
const directoryPath = path.join(__dirname, "./");
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files = files.filter((file) => file.includes(".json"));
  //listing all files using forEach
  files.forEach(async (file) => {
    // Do whatever you want to do with the file
    let filePath = directoryPath + "/" + file;
    let vehicle = file.split(".json")[0];
    fs.existsSync(directoryPath + "/" + vehicle) ||
      fs.mkdirSync(directoryPath + "/" + vehicle);
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      data = JSON.parse(data);
      let finalData = data.reduce((acc, item) => {
        let error = item["error"];
        if (acc[error]) {
          acc[error].push(item);
        } else {
          acc[error] = [item];
        }
        return acc;
      }, {});
      let objectKeys = Object.keys(finalData);
      objectKeys.map((key) => {
        fs.writeFile(
          directoryPath + "/" + vehicle + `/${key}.json`,
          JSON.stringify(finalData[key]),
          function (err) {
            if (err) throw err;
          }
        );
      });
    });
  });
});
