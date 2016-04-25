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
	liste_p =[]
	listesemestres = []
	liste_par = ["C++BIO", "GENORG", "ORGECO", "BSC"]
	num_s = ["7", "8", "9", "10"]
	for num in num_s :
		lis_s7 = []
		liste_s7_r = []
		liste_s7_e = []
		for i in liste :
			for j in range(len(i)) :
				if i[j] == "C++BIO" and i[j-1] == num and i[j+1] == "required"  :
					liste_s7_r.append(i[0])
					#print liste_s7_r
					
				if i[j] == "C++BIO" and i[j-1] == num and i[j+1] == "elective" :
					liste_s7_e.append(i[0])
				
		lis_s7.append(liste_s7_r)
		lis_s7.append(liste_s7_e)
		listesemestres.append(lis_s7)

	liste_p.append(i[2])
	liste_p.append(listesemestres)
	liste_triee.append(liste_p)
	print liste_triee

	"""
		
	#print liste_triee
	#liste_triee = [["C++BIO", [[["11", "12"], ["13", "14"]],[["21", "22"],["23", "24"]]]], ["Parcours2", [[["211", "212"], ["213", "214"]],[["221", "222"], ["223", "224"]]]]]

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

	#écriture du premier objet du json	
	destination.write ("[{\"name\" : \"Master\", \n \"children\" : [\n") 
	#parcours chaque liste de la liste de données, cad chaque parcours
	for i in liste_triee :
		#puis chaque élément de la liste du parcours
		for j in i :
			if j != i[0] :
				#si l'élément correspond, le nom du parcours est inséré
				destination.write("    {\"name\" : \"")
				destination.write (i[0])
				destination.write("\",\n     \"parent\" : \"Master\", \n     \"children\" : [\n")
				#création de la variable qui va définir le numéro du semestre
				w = 7
				#pour chaque liste de semestre, ecrire le nom du semestre et l'objet des ues obligatoires
				for k in (j) :					
					destination.write("         {\"name\" : \"")
					destination.write("semestre ")
					destination.write(str(w))
					destination.write("\",\n           \"parent\" : \"")
					destination.write(i[0])
					destination.write("\", \n          \"children\" : [\n\n")
					destination.write ("              {\"name\" : \"UEs Obligatoires\",\n               \"parent\" : \"")
					destination.write ("semestre ")
					destination.write (str(w))
					destination.write("\", \n               \"children\" : [\n\n")
					#pour chaque liste des ues, créer les objets
					for l in k :
						#k[0] ==> les ues obligatoires, toujours rangés en première position
						if l == k[0] :
							#création des objets ues
							for n in l :
								destination.write ("                   {\"name\" : \"")
								destination.write((str(n)))
								destination.write("\",\n                   \"parent\" : \"UEs Obligatoires\",\n},\n")
					#création de l'objet des ues facultatives
					destination.write ("              {\"name\" : \"UEs Facultatives\",\n             \"parent\" : \"")
					destination.write("semestre ")
					destination.write(str(w))
					destination.write("\", \n             \"children\" : [\n\n")
					#pour chaque liste des ues, créer les objets
					for l in k :
						#k[1] ==> les ues facultatives, rangés en seconde position
						if l == k[1] :
							#création des objets ues
							for n in l :
								destination.write ("                    {\"name\" : \"")
								destination.write((str(n)))
								destination.write("\",\n                    \"parent\" : \"UEs Facultatives\", \n},\n")
					#incrémentation de la variable qui numérote les semestres
					w = w +1
	#fermeture de tous les objets
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