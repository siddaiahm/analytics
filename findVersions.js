const fs = require("fs");

fs.readFile("./output/analyst.json", (err, data) => {
  if (!err) {
    let array = JSON.parse(data);
    let finalData = array.reduce((acc, item) => {
      let device = item["device_name"];
      let user =
        item["user"].includes("syed") &&
        !(device && device.includes("realme 3 Pro")) &&
        item["apk_version"] === "v0.9.14";
      let androidVersion = item["device_version"] || item["android_version"];
      item["vehicle"] = item["error_description"].match(/KA(.{11})/)[0];
      if (user) {
        if (acc[androidVersion]) {
          acc[androidVersion].push(item);
        } else {
          acc[androidVersion] = [item];
        }
      }
      return acc;
    }, {});
    let objectKeys = Object.keys(finalData);
    objectKeys.map((key) => {
      fs.existsSync("./output/versions") || fs.mkdirSync("./output/versions");
      fs.writeFile(
        `./output/versions/${key}.json`,
        JSON.stringify(finalData[key]),
        function (err) {
          if (err) throw err;
        }
      );
    });
  }
});
