const fs = require("fs");

fs.readFile("./data/analyst.json", (err, data) => {
  if (!err) {
    let array = JSON.parse(data);
    let finalData = array.reduce((acc, item) => {
      let vehicle = item["error_description"].match(/KA(.{11})/)[0];
      item["error_description"] = item["error_description"].replace(",", " ");
      if (acc[vehicle]) {
        item["vehicle"] = vehicle;
        acc[vehicle].push(item);
      } else {
        item["vehicle"] = vehicle;
        acc[vehicle] = [item];
      }
      return acc;
    }, {});
    let objectKeys = Object.keys(finalData);
    objectKeys.map((key) => {
      fs.existsSync("./output/vehicles") || fs.mkdirSync("./output/vehicles");
      fs.writeFile(
        `./output/vehicles/${key}.json`,
        JSON.stringify(finalData[key]),
        function (err) {
          if (err) throw err;
        }
      );
    });
  }
});
