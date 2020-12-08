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
      item["vehicle"] = item["error_description"].match(/KA(.{11})/)[0];
      if (user) {
        if (acc[device]) {
          acc[device].push(item);
        } else {
          acc[device] = [item];
        }
      }
      return acc;
    }, {});
    let objectKeys = Object.keys(finalData);
    objectKeys.map((key) => {
      fs.existsSync("./output/mobiles") || fs.mkdirSync("./output/mobiles");
      fs.writeFile(
        `./output/mobiles/${key}.json`,
        JSON.stringify(finalData[key]),
        function (err) {
          if (err) throw err;
        }
      );
    });
  }
});
