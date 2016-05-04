# coding: utf-8
from __future__ import unicode_literals
import re


the_geojson=open("internship_auto.json", "w")
the_geojson.write("{\"type\": \"FeatureCollection\",\n")
the_geojson.write("\"features\": [\n")

csv_length = len(open("Internships_master.csv", "r",0).readlines())
header= True
last= False
cpt=1 #will be the internship's id, used later in the map
the_csv=open("Internships_master.csv", "r")
for line in the_csv.readlines():
    line=line.decode('utf-8')
    if (header==False):
        latitude = re.search("( ?-?(\w+( ?-?\.?\[?\(?\,?\ ?\w+ ?)\)?\]?)*;){10}", line, re.UNICODE).group(1).replace(";", "").replace(" ", "")
        longitude = re.search("( ?-?(\w+( ?-?\.?\[?\(?\,?\ ?\w+ ?)\)?\]?)*;){11}", line, re.UNICODE).group(1).replace(";", "").replace(" ", "")
        city = re.search("( ?-?(\w+( ?-?\.?\[?\(?\,?\ ?\w+ ?)\)?\]?)*;){7}", line, re.UNICODE).group(1).replace(";", "")
        country = re.search("( ?-?(\w+( ?-?\.?\[?\(?\,?\ ?\w+ ?)\)?\]?)*;){8}", line, re.UNICODE).group(1).replace(";", "")
        year = re.search("20\d{2}", line, re.UNICODE).group(0)
        center = re.search("( ?-?(\w+( ?-?\.?\[?\(?\,?\ ?\w+ ?)\)?\]?)*;){5}", line, re.UNICODE).group(1).replace(";", "")
        the_geojson.write("             {\"type\": \"Feature\",\n")
        the_geojson.write("             \"geometry\": {\"type\": \"Point\",\n")
        the_geojson.write("                             \"coordinates\": ["+longitude+","+latitude+"]},\n")
        output_for_city = "             \"properties\": {\"city\":\""+city+"\",\n" #I wrote the string in a variable,...
        the_geojson.write(output_for_city.encode('utf-8')) #...otherwise you would have to place three .encode, one by element
        the_geojson.write("                             \"country\":\""+country+"\",\n")
        the_geojson.write("                             \"year\":\""+year+"\",\n")
        output_for_center = "                             \"center\":\""+center+"\",\n"
        the_geojson.write(output_for_center.encode('utf-8'))
        the_geojson.write("                             \"id\":\""+str(cpt)+"\"\n")
        cpt+=1
        the_geojson.write("                             }\n")
        if (last):
            the_geojson.write("             }\n") #an extra comma and the geojson is not regonized by d3js
        else:
            the_geojson.write("             },\n")
        if (cpt == csv_length-1):
            last=True
    else:
        header=False
the_geojson.write("     ]\n")
the_geojson.write("}\n")

the_csv.close()
the_geojson.close()

