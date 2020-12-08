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
  let allData = {};
  let mobileModal = "";
  //listing all files using forEach
  let pp = folders.map((folder) => {
    // Do whatever you want to do with the file
    let folderPath = directoryPath + "/" + folder;
    return new Promise((resolve, reject) => {
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
          let dateKey = file.split(".json")[0];

          return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
              if (err) reject(err);
              data = JSON.parse(data);
              filesData[dateKey] = {
                count: data.length,
              };
              let vehicles = {};
              let info = data.reduce(
                (
                  acc,
                  {
                    time,
                    android_version,
                    apk_version,
                    device_version,
                    device_name,
                    error_description,
                    error,
                    device_brand,
                    model,
                  }
                ) => {
                  let vehicle = error_description.match(/KA(.{11})/)[0];
                  vehicles[vehicle] = 1;
                  mobileModal =
                    device_name +
                    " " +
                    (device_brand ? device_brand + " " : "") +
                    (model ? model : "");
                  if (acc[error]) {
                    if (acc[error][vehicle]) {
                      acc[error][vehicle].push({
                        android_version: device_version || android_version,
                        device_name: device_name,
                        apk_version: apk_version,
                        error_description: error_description,
                        vehicle: vehicle,
                        time: time,
                        error: error,
                      });
                    } else {
                      acc[error][vehicle] = [
                        {
                          android_version: device_version || android_version,
                          device_name: device_name,
                          apk_version: apk_version,
                          error_description: error_description,
                          vehicle: vehicle,
                          time: time,
                          error: error,
                        },
                      ];
                    }
                  } else {
                    acc[error] = {
                      [vehicle]: [
                        {
                          android_version: device_version || android_version,
                          device_name: device_name,
                          apk_version: apk_version,
                          error_description: error_description,
                          vehicle: vehicle,
                          time: time,
                          error: error,
                        },
                      ],
                    };
                  }
                  return acc;
                },
                {}
              );
              filesData[dateKey]["vehiclesCount"] = Object.keys(
                vehicles
              ).length;
              filesData[dateKey]["vehicles"] = Object.keys(vehicles);
              filesData[dateKey]["errors"] = Object.keys(info);
              filesData[dateKey]["data"] = info;
              resolve();
            });
          });
        });

        Promise.all(promises)
          .then(() => {
            allData[folder] = {
              mobileInfo: mobileModal,
              data: filesData,
            };
            resolve();
          })
          .catch((e) => reject(e));
      });
    });
  });
  Promise.all(pp).then(() => {
    fs.writeFile(
      "./output/errorsinfo.json",
      JSON.stringify(allData),
      (err, data) => {}
    );
  });
});
