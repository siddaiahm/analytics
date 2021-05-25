const fs = require("fs");

fs.readFile("./newData/analyst.json", (err, data) => {
  if (!err) {
    let array = JSON.parse(data);
    let finalData = array.reduce(
      (acc, item) => {
        let device = item["device_name"];
        let user =
          item["user"].includes("syed") &&
          !(device && device.includes("realme 3 Pro"));
        let error = item["error"] || item["info"];
        let vehicleI = item["error_description"] || item["info_description"];
        let date = new Date(item["time"]).toDateString();
        let vehicle =
          (`${vehicleI}`.match(/KA(.{11})/) &&
            `${vehicleI}`.match(/KA(.{11})/)[0]) ||
          "No ID";

        if (user) {
          if (acc["mobiles"][device]) {
            acc["mobiles"][device].push(item);
          } else {
            acc["mobiles"][device] = [item];
          }
          if (acc["vehicles"][vehicle]) {
            acc["vehicles"][vehicle].push(item);
          } else {
            acc["vehicles"][vehicle] = [item];
          }
          if (acc["dates"][date]) {
            acc["dates"][date].push(item);
          } else {
            acc["dates"][date] = [item];
          }
          if (item["error"]) {
            if (acc["errors"][error]) {
              acc["errors"][error].push(item);
            } else {
              acc["errors"][error] = [item];
            }
          } else {
            if (acc["infos"][error]) {
              acc["infos"][error].push(item);
            } else {
              acc["infos"][error] = [item];
            }
          }
        }
        return acc;
      },
      { dates: {}, vehicles: {}, mobiles: {}, errors: {}, infos: {} }
    );

    let objectKeys = Object.keys(finalData);
    objectKeys.map((key) => {
      fs.writeFile(
        `./output/${key}.json`,
        JSON.stringify(finalData[key]),
        function (err) {
          if (err) throw err;
        }
      );
    });
  }
});
