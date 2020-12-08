const fs = require("fs");
const { parse } = require("json2csv");
const readData = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (!err) {
        let array = JSON.parse(data);
        let arrayData = [];
        array.map((item) => {
          if (
            item["user"].includes("syed") &&
            !(
              item["device_name"] &&
              item["device_name"].includes("realme 3 Pro")
            )
          ) {
            let vehicle = item["error_description"].match(/KA(.{11})/)[0];
            item["vehicle"] = vehicle;
            item["android_version"] =
              item["android_version"] || item["device_version"];
            delete item["device_version"];
            arrayData.push(item);
          }
        });
        resolve(arrayData);
      } else {
        reject(err);
      }
    });
  });
};

let errorFilePath = "./output/analyst.json";

const getData = async () => {
  let data = await readData(errorFilePath);
  const fields = [
    "time",
    "android_version",
    "apk_version",
    "device_name",
    "error_description",
    "error",
    "device_brand",
    "model",
    "vehicle",
  ];
  const opts = { fields };

  try {
    const csv = parse(data, opts);
    fs.writeFile("./output/info.csv", csv, () => {});
    fs.writeFile("./output/infoData.json", JSON.stringify(data), () => {});
  } catch (err) {
    console.error(err);
  }
};

getData();
