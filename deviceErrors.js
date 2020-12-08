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
  files = files.filter((file) => file.includes(".json"));
  let allData = {};
  let androidVersion = "notthing";
  let totalErrorCount = 0;
  //listing all files using forEach
  let promises = files.map((file) => {
    // Do whatever you want to do with the file
    let filePath = directoryPath + "/" + file;
    let version = file.split(".json")[0];
    // fs.existsSync(directoryPath + "/" + version) ||
    //   fs.mkdirSync(directoryPath + "/" + version);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);
        data = JSON.parse(data);
        let vehicles = {};
        let finalData = data.reduce((acc, item) => {
          let error = item["error"];
          vehicles[item["vehicle"]] = 1;
          androidVersion = item["android_version"];
          let reason =
            item["error_description"].split("reason")[1] || "no reason";
          if (acc[error]) {
            acc[error].count += 1;
            totalErrorCount += 1;
            if (acc[error]["errors"][reason]) {
              if (acc[error]["errors"][reason][item["vehicle"]]) {
                acc[error]["errors"][reason][item["vehicle"]] += 1;
              } else {
                acc[error]["errors"][reason][item["vehicle"]] = 1;
              }
            } else {
              acc[error]["errors"][reason] = { [item["vehicle"]]: 1 };
            }
          } else {
            totalErrorCount += 1;
            acc[error] = {
              count: 1,
              errors: {
                [reason]: {
                  [item["vehicle"]]: 1,
                },
              },
            };
          }
          return acc;
        }, {});
        allData[version] = {
          android_version: androidVersion,
          vehicles: Object.keys(vehicles),
          totalErrorCount: totalErrorCount,
          data: finalData,
        };
        resolve();
      });
    });
  });
  Promise.all(promises).then((data) => {
    fs.writeFile(
      "./output/deviceerrosCountInfo.json",
      JSON.stringify(allData),
      function (err) {
        if (err) throw err;
      }
    );
  });
});
