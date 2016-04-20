# -*- coding: utf-8 -*-
import re
import sys




def filtrer (source, destination) :
  """
  fonction de traitement
  Lit et traite ligne par ligne au fur et à mesure dans le
  fichier de destination
  """
  liste = []
  check = 0
  findeligne = source.readline().rstrip('\n\r')

    #parcours = re.match(r"\sSPECIAL EVENTS", ligne)
    #ects = re.match(r"((\s)+('|\")ects('|\")(\s)+:(\s)+3,)", ligne)
    #[^(Holidays)][^(Press)][^(Conf)] sauf vacances press et conf pour acronym héhéhé [^\"Press\"|Holidays|Conf]
    #parcours = re.search(r"((\s)+('|\")students('|\")(\s)*:(\s)+('|\")((?P<UE>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut>\w+)\](,)?)+('|\"),)", ligne)
    #parcours = re.search(r"((\s)+('|\")students('|\")(\s)*:(\s)+('|\")((?P<P1>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut1>\w+)\](,)?)((?P<P2>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut2>\w+)\](,)?)((?P<P3>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut3>\w+)\](,)?)((?P<P4>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut4>\w+)\](,)?)('|\"),)", ligne)
    #UE = re.match(r"((\s)+('|\")acronym('|\")(\s)*:(\s)*('|\")(?P<UE>\w+(&)?\w+)('|\"),)", ligne)
      #semestre = re.match(r"((\s)+('|\")semester('|\")(\s)*:(\s)*(?P<semestre>(\d)+),(\s)*(//)*(.,=\w\s)*)", ligne)

  for ligne in source : 
    UE = re.match(r"((\s)+('|\")acronym('|\")(\s)*:(\s)*('|\")(?P<UE>\w+(&)?\w+)('|\"),)", ligne)
    parcours = re.search(r"((\s)+('|\")students('|\")(\s)*:(\s)+('|\")((?P<P1>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut1>\w+)\](,)?)((?P<P2>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut2>\w+)\](,)?)((?P<P3>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut3>\w+)\](,)?)((?P<P4>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut4>\w+)\](,)?)('|\"),)", ligne)
    semestre = re.match(r"((\s)+('|\")semester('|\")(\s)*:(\s)*(?P<semestre>(\d)+),(\s)*(//)*(.,=\w\s)*)", ligne)
    if UE is not None : 
      les_ue = UE.group('UE')
      #print les_ue
      if (les_ue is not " Holidays " or les_ue != " Conf ") :
	liste_ue = []
	liste.append(liste_ue)
	liste_ue.append(les_ue)

    if semestre is not None : 
      liste_ue.append(semestre.group('semestre'))
      
    if parcours is not None : 
      liste_ue.append(parcours.group('P1'))
      liste_ue.append(parcours.group('Statut1'))
      liste_ue.append(parcours.group('P2'))
      liste_ue.append(parcours.group('Statut2'))
      liste_ue.append(parcours.group('P3'))
      liste_ue.append(parcours.group('Statut3'))
      liste_ue.append(parcours.group('P4'))
      liste_ue.append(parcours.group('Statut4'))
  liste.pop(0)
  liste.pop(1)
  liste.pop(2)
  liste.pop(0)
  #print liste
  liste_triee = []
  """

  for i in liste :
    for j in range(len(i)) :
      if i[j] == "C++BIO" :
	liste_c =[]
  
  for i in liste : 
    for j in range(len(i)) : 
      if i[j] == "C++BIO" and (i[j+1] == "required"):
        liste_ue_o = []
        liste_ue_o.append(i[0])
        liste_c.append (liste_ue_o)

  for i in liste : 
    for j in range(len(i)) : 
      if i[j] == "C++BIO" and (i[j+1] == "elective"):
        liste_ue_f = []
        liste_ue_f.append(i[0])
        liste_c.append (liste_ue_f)
        

  for i in liste : 
    for j in range(len(i)) : 
      if i[j] == "GENORG" and (i[j+1] == "required"):
        liste_ue = []
        liste_ue.append (i[j])
        liste_ue.append (i[j+1])
        liste_ue.append (i[1])
        liste_ue.append(i[0])
        liste_triee.append (liste_ue)

  for i in liste : 
    for j in range(len(i)) : 
      if i[j] == "GENORG" and (i[j+1] == "elective"):
        liste_ue = []
        liste_ue.append (i[j])
        liste_ue.append (i[j+1])
        liste_ue.append (i[1])
        liste_ue.append(i[0])
        liste_triee.append (liste_ue)
        

  for i in liste : 
    for j in range(len(i)) : 
      if i[j] == "ORGECO" and (i[j+1] == "required"):
        liste_ue = []
        liste_ue.append (i[j])
        liste_ue.append (i[j+1])
        liste_ue.append (i[1])
        liste_ue.append(i[0])
        liste_triee.append (liste_ue)

  for i in liste : 
    for j in range(len(i)) : 
      if i[j] == "ORGECO" and (i[j+1] == "elective"):
        liste_ue = []
        liste_ue.append (i[j])
        liste_ue.append (i[j+1])
        liste_ue.append (i[1])
        liste_ue.append(i[0])
        liste_triee.append (liste_ue)

  for i in liste : 
    for j in range(len(i)) : 
      if i[j] == "BSC" and (i[j+1] == "required"):
        liste_ue = []
        liste_ue.append (i[j])
        liste_ue.append (i[j+1])
        liste_ue.append (i[1])
        liste_ue.append(i[0])
        liste_triee.append (liste_ue)

  for i in liste : 
    for j in range(len(i)) : 
      if i[j] == "BSC" and (i[j+1] == "elective"):
        liste_ue = []
        liste_ue.append (i[j])
        liste_ue.append (i[j+1])
        liste_ue.append (i[1])
        liste_ue.append(i[0])
        liste_triee.append (liste_ue)
  print liste_triee
  """

  liste_triee = [["C++BIO", [[["11", "12"], ["13", "14"]],[["21", "22"],["23", "24"]]]], ["Parcours2", [[["211", "212"], ["213", "214"]],[["221", "222"], ["223", "224"]]]]]
  
  destination.write ("[{\"name\" : \"Master\", \n \"children\" : [\n")
  for i in liste_triee :
    for j in i :
      if j != i[0] :
	destination.write("    {\"name\" : \"")
	destination.write (i[0])
	destination.write("\",\n     \"parent\" : \"Master\", \n     \"children\" : [\n")
	for k in range(len(j)) :
	  print k
	  k = k+7
	  destination.write("    		{\"name\" : \"")
	  destination.write("semestre ")
	  destination.write(str(k))
	  destination.write("\",\n	         \"parent\" : \"")
	  destination.write(i[0])
	  destination.write("\", \n	         \"children\" : [\n")
	  """
	  
	  #for l in range(len(j)) :
	    destination.write ("    			{\"name\" : \"UEs Obligatoires\",\n     		    	\"parent\" : \"")
	    destination.write ("semestre ")
	    destination.write (str(k))
	    destination.write("\", \n   		        \"children\" : [\n")
	    """
	  a = 0
	  for n in j :
	    while a <= 1 :
	      for m in n :
		if m == n[0] :
		  destination.write ("    			{\"name\" : \"UEs Obligatoires\",\n     		    	\"parent\" : \"")
		  destination.write ("semestre ")
		  destination.write (str(k))
		  destination.write("\", \n   		        \"children\" : [\n")
		  for o in n[0] :
		    print "michel"
		    destination.write (" 				   {\"name\" : \"")
		    destination.write((str(o)))
		    destination.write("\",\n   				  \"parent\" : \"UEs Obligatoires\",\n}")
		if m == n[1] :
		  destination.write ("    			{\"name\" : \"UEs Facultatives\",\n			 \"parent\" : \"")
		  destination.write("semestre ")
		  destination.write(str(k))
		  destination.write("\", \n			 \"children\" : [\n")
		  for o in n[1] :
		    destination.write ("				    {\"name\" : \"")
		    destination.write((str(o)))
		    destination.write("\",\n				    \"parent\" : \"UEs Facultatives\", \n}")
		    a = a+1
		  """
		  

	    for m in (j[l][0]) : 
	      print m
	      destination.write (" 				   {\"name\" : \"")
	      destination.write((str(m)))
	      destination.write("\",\n   				  \"parent\" : \"UEs Obligatoires\",\n}")
	    #if l == 1 :
	    destination.write ("    			{\"name\" : \"UEs Facultatives\",\n			 \"parent\" : \"")
	    destination.write("semestre ")
	    destination.write(str(k))
	    destination.write("\", \n			 \"children\" : [\n")
	    for m in (j[l][1]) : 
	      destination.write ("				    {\"name\" : \"")
	      destination.write((str(m)))
	      destination.write("\",\n				    \"parent\" : \"UEs Facultatives\", \n}")
	      """
  destination.write(" }\n      ]\n      }\n      ] \n      }\n      ]\n      },\n")


#ouverture du fichier source
source = open("courses.js", "r")

#ouverture du fichier de destination
destination = open("out.json", "w")

try :
  filtrer (source, destination) #appel de la fonction de traitement

finally : 
#fermeture du fichier de destination
  destination.close()

#fermeture du fichier source
  source.close()