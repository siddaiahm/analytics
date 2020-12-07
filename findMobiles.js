const fs = require("fs");

fs.readFile("./analyst.json", (err, data) => {
  if (!err) {
    let array = JSON.parse(data);
    let finalData = array.reduce((acc, item) => {
      let device = item["device_name"];
      if (acc[device]) {
        acc[device].push(item);
      } else {
        acc[device] = [item];
      }
      return acc;
    }, {});
    let objectKeys = Object.keys(finalData);
    objectKeys.map((key) => {
      fs.writeFile(
        `./mobiles/${key}.json`,
        JSON.stringify(finalData[key]),
        function (err) {
          if (err) throw err;
        }
      );
    });
  }
});
