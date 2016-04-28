# -*- coding: utf-8 -*-
import re
import sys




def filtrer (source, destination) :

	"""
	Première partie : trouver ce qui nous interesse dans le code qui nous est donné
	"""

	liste = []
	#Supression des caractères invisbles en fin de ligne
	findeligne = source.readline().rstrip('\n\r')
	#Pour chaque ligne du fichier
	#rechercher la regexp
	for ligne in source : 
		UE = re.match(r"((\s)+('|\")acronym('|\")(\s)*:(\s)*('|\")(?P<UE>\w+(&)?\w+)('|\"),)", ligne)
		parcours = re.search(r"((\s)+('|\")students('|\")(\s)*:(\s)+('|\")((?P<P1>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut1>\w+)\](,)?)((?P<P2>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut2>\w+)\](,)?)((?P<P3>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut3>\w+)\](,)?)((?P<P4>[A-Z](\+\+)?[A-Z]+)\[(?P<Statut4>\w+)\](,)?)('|\"),)", ligne)
		semestre = re.match(r"((\s)+('|\")semester('|\")(\s)*:(\s)*(?P<semestre>(\d)+),(\s)*(//)*(.,=\w\s)*)", ligne)
		if UE is not None : 
			#si la regexp renvoie quelque chose
			#ajouter ce quelque chose dans une liste
			les_ue = UE.group('UE')
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
	#Suppression des premiers éléments de la liste qui n'ont rien a voir avec les parcours

	"""
	Seconde partie : ranger les données de la manière que l'on souhaite
	"""

	liste_triee = []
	liste_par = ["C++BIO", "GENORG", "ORGECO", "BSC"]
	#Si un nouveau parcours est crée, il suffit de rajouter son nom à la fin de cette liste
	#pour automatiser la mise à jour du json
	for parcours in liste_par :
		rangement (parcours, liste, liste_triee)

	"""
	Troisième partie : écriture du fichier json
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
								destination.write("\",\n                   \"parent\" : \"UEs Obligatoires\"			    	\n},\n")
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
								destination.write("\",\n                    \"parent\" : \"UEs Facultatives\" 			    	\n},\n")
					#incrémentation de la variable qui numérote les semestres
					w = w +1
	#fermeture de tous les objets
	destination.write(" }\n      ]\n      }\n      ] \n      }\n      ]\n      },\n")

def rangement (parcours, liste_source, liste_destination):
	liste_p =[]
	listesemestres = []
	num_s = ["7", "8", "9", "10"]

	for num in num_s :
		liste_r_e = []
		liste_r = []
		liste_e = []

		for i in liste_source :

			for j in range(len(i)) :
				
				if i[j] == parcours and i[j+1] == "required" and (i[j-1] == num or i[j-3] == num or i[j-5] == num) :
					liste_r.append(i[0])

					
				if i[j] == parcours and i[j+1] == "elective" and (i[j-1] == num or i[j-3] == num or i[j-5] == num):
					liste_e.append(i[0])

		liste_r_e.append(liste_r)
		liste_r_e.append(liste_e)
		listesemestres.append(liste_r_e)

	liste_p.append(parcours)
	liste_p.append(listesemestres)
	liste_destination.append(liste_p)
	return liste_destination





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
