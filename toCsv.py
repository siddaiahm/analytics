import json 
import csv 
   
with open('analyst.json') as json_file: 
    data = json.load(json_file) 
  
# now we will open a file for writing 
data_file = open('data_file.csv', 'w') 
  
# create the csv writer object 
csv_writer = csv.writer(data_file) 
  
# Counter variable used for writing  
# headers to the CSV file 
keys=["time","android_version","apk_version","device_brand","device_name","error","error_description","mac_address","model","screen_name","unique_id","user"]
csv_writer.writerow(keys)
for item in data: 
    # Writing data of CSV file
    listToStr = [str(item.get(key) or "") for key in keys]
    csv_writer.writerow(listToStr) 
  
data_file.close() 