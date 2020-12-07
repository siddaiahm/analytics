import os
import re
regex_str = re.compile('Date: (?P<time>.*) -0000')

basepath = './data' # maybe just '.'
for dir_name in os.listdir(basepath):
    dir_path = os.path.join(basepath, dir_name)
    if not os.path.isdir(dir_path):
        continue
    with open(basepath+"/"+dir_name+'.json' , 'w') as outfile:
        outfile.write("[\n")
        for file_name in os.listdir(dir_path):
            if not file_name.endswith('.eml'):
                continue
            file_path = os.path.join(dir_path, file_name)
            with open(file_path) as infile:
                string = infile.read()
                string = string.replace("""'
                      '""", "").replace("'", '"')
                a=string.split("\n\n\n")
                time=regex_str.search(a[0]).groupdict()
                a = a[1].replace('{','{"time": ' + f'"{time["time"]}",')
                outfile.write(a+',')
        outfile.write("\n]")