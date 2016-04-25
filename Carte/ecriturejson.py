# coding: utf-8
from __future__ import unicode_literals
import re


#ne marche pas encore sur les accents et nécessite de retirer la dernière virgule du json généré
"""
les lignes à probleme, posées ici pour expérimenter:
the_line="Allery;Estelle;Murray;Cox;Massey University;Palmerston North;Nouvelle-Zelande;Oceanie;-40.3850866;175.614064;2015-2016"
the_line2="Aguilar;JeanDavid;Unknown;Unknown;Universite de Sherbrooke;Sherbrooke;Canada;Amerique du Nord;45.378653;-71.929733;2015-2016"
the_line3="Fall;Khoudia;François;Sabor;IRD ;Montpellier;France;Europe;43.644996;3.866384;2015-2016"
the_line4="Schaeffer;Mathieu;Michel;Pierre Andre;University of Geneva and SIB (CALIPHO Group);Geneve;Suisse;Europe;46.199444;6.145116;2014-2015"
the_line5="Elaissi;Myriam;Brochard;Alexandre;INSERM Neuro Magendie;Bordeaux;France;Europe;44.826517;-0.601795;2014-2015"
the_line6="Train;Clement-Marie;Altenhof;Adrian;CBRG [ETH];Zurich;Suisse;Europe;47.2235;8,3253;2014-2015"
the_line7="Bandres;Thomas;Dutour;Isabelle;LaBRI MabioVis ;Bordeaux;France;Europe;44.483;0.3548;2013-2014"
the_line8="El Hilali;Sami;Fabian;A. Buske;Garvan Institute;Sydney;Australie;Amerique du Nord;-33.879195 ;151.221499 ;2013-2014"
print "test: ", re.search("\w*", "Océanie").group(0)
#line = re.search(" ?((\w+(-? ?\w+)?)? ?;)*",the_line)
#line2 = re.sub("( ?-?(\w+( ?-?\.?\(?\w+ ?)\)?)*;){3}", "", the_line8, count=1) #donne a partir du 9+1eme elem jusqu'au bout de la ligne
#answer = re.search("( ?-?(\w+([ \-\.\[\,\]]{0,3}\w+.?[ \-\.\[\,\]]{0,3}))*)", line2).group(0)
line2 = re.sub("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*;){8}", "", the_line8, count=1) #donne a partir du 9+1eme elem jusqu'au bout de la ligne
print "pour le moment on a: ", line2
answer = re.search("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*)", line2).group(0) #ne garde que le 1er match
print "answer is: ", answer

"""

the_geojson=open("data.json", "w")
the_geojson.write("{\"type\": \"FeatureCollection\",\n")
the_geojson.write("\"features\": [\n")

cpt=1
the_csv=open("sans_accent_Stages_Master.csv", "r")
last_line = False
for line in the_csv.readlines():
        line=line.decode('utf-8')
        print "ligne en cours:", line
        line_lat = re.sub("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*;){8}", "", line, count=1) #donne à partir du 8ème elem (latitude) jusqu'au bout
        latitude = re.search("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*)", line_lat).group(0)
        line_long = re.sub("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*;){9}", "", line, count=1)
        longitude = re.search("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*)", line_long).group(0)
        line_city = re.sub("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*;){5}", "", line, count=1)
        city = re.search("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*)", line_city).group(0)
        line_country = re.sub("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*;){6}", "", line, count=1)
        country = re.search("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*)", line_country).group(0)
        line_year = re.sub("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*;){10}", "", line, count=1)
        year = re.search("\d{4}", line_year).group(0)
        line_center = re.sub("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*;){4}", "", line, count=1)
        print "line center: ", line_center
        center = re.search("( ?-?(\w+([ \-\.\[\,\(\]]{0,3}\w+[ \-\.\[\,\)\]]{0,3})?)*)", line_center).group(0)
        the_geojson.write("             {\"type\": \"Feature\",\n")
        the_geojson.write("             \"geometry\": {\"type\": \"Point\",\n")
        the_geojson.write("                             \"coordinates\": ["+longitude+","+latitude+"]},\n")
        the_geojson.write("             \"properties\": {\"city\":\""+city+"\",\n")
        the_geojson.write("                             \"country\":\""+country+"\",\n")
        the_geojson.write("                             \"year\":\""+year+"\",\n")
        the_geojson.write("                             \"center\":\""+center+"\",\n")
        the_geojson.write("                             \"id\":\""+str(cpt)+"\"\n")
        cpt+=1
        the_geojson.write("                             }\n")
        the_geojson.write("             },\n")
the_geojson.write("     ]\n")
the_geojson.write("}\n")
the_csv.close()
the_geojson.close()



