//On commence par déclarer toutes nos variables.

//On ajoute un élément div à l'élément body dans le DOM. Le div va contenir notre tooltip.

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);


//Variables qui définissent les dimensions de l'image
var width = 1400,
    height = 800;

//On définit la variable zoomON qui va permettre le zoom au click.
var zoomON;


//On définit les variables width et height pour définir les dimensions de nos boutons de sélection d'année.

var button_width = 20, button_height = 20;



// La variable de projection pour projeter les données sur la carte.
var MyProjection = d3.geo.mercator()
    .center([0, 45 ]) //On centre la carte.
    .scale(190) //On définit l'échelle.
    .translate([width/2, height/2]); //On spécifie le point à partir duquel on projette les données. Ici, on projette à partir du centre de l'image.




//Création de l'image au format SVG.
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height); //Cet attribut viewBox permet de répondre au changement de taille de la fenêtre.



//On ajoute à notre élément svg un élément rectangle qui sera notre fond bleu.


svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);
    


//L'objet path permet de manipuler les données géographiques de nos fichiers GeoJson.
//En fait, path (=chemin) permet de dessiner le contour de nos objets.
//De plus, on applique à la fonction d3.geo.path() la projection qu'on a définit dans la variable MyProjection.
var path = d3.geo.path()
    .projection(MyProjection);


//On ajoute l'élément g à l'élément svg. Il permet de grouper certains éléments au sein de l'élément svg.
var g = svg.append("g");


//Le zoom.
//On ajoute à la fonction d3.behavior.zoom une méthode "zoom" définie comme suit.
// Cette méthode va permettre une transformation de l'image grâce à deux fontions d3: d3.event.translate.join et d3.event.scale.


var Myzoom = d3.behavior.zoom()
    .on("zoom",function() {
	g.attr("transform","translate("+ d3.event.translate.join(",")+")scale("+d3.event.scale+")")

    });

svg.call(Myzoom)
    


//La légende

var color = d3.scale.ordinal() //Fonction qui permet d'associer une couleur à une catégorie/domaine.
    .domain(["0", "1", "2 à 5", "5 à 10", "10++"])
    .range(["AliceBlue", "GoldenRod", "DarkGoldenRod", "IndianRed", "DarkRed"]);

var taille_rect= 40; //Taille des rectangles.
var legendSpacing = 5; //Espace entre les rectangles.


var legend =svg.selectAll(".legend")//On sélectionne tous les éléments qu'on va créer.
    .data(color.domain())// On récupère nos données d'intéret.
    .enter()// On crée nos éléments à partir des données chargées précedemment.
    .append("g") // On ajoute l'élément g à l'image pour chaque élément crée.
    .attr("class", "legend") // On définit la classe des objets.
    .attr("transform", function(d, i) { // On définit un attribut "transform"  qui va modifier nos éléments en terme de dimensions proportionnellement à l'index i de la liste de domain.
	
	var hauteur = taille_rect;
	var x = hauteur;
	var y = i * 50;
	return "translate(" + x + "," + y + ")";
    });


//Contruction de la légende
// On ajoute un élément rectangle à l'image pour chaque élément ".legend"
legend.append("rect")
    .attr("width", taille_rect)
    .attr("height", taille_rect)
    .style("fill", color)
    .style("stroke", "black");

// On ajoute du texte pour chaque élément ".legend"
legend.append("text") 
    .attr("x", taille_rect + legendSpacing)
    .attr("y", taille_rect - legendSpacing)
    .text(function(d) { return d; });




//Construction de tous nos pays avec leurs stages respectifs.

//Fonction qui permet de charger les données dans l'ordre où on place nos fichiers GeoJson.
// C'est la fonction d3.json qui permet de charger les donénes issues de notre fichier json.

queue()
    .defer(d3.json, "data/world.json")
    .defer(d3.json, "data/internship.json")
    .await(makeMyMap);


//fonction qui créee tous les élément du planisphère en fonction des données qu'on a chargé précedemment.
function makeMyMap(error, countries, internship) {
    
    
    //On crée les éléments ".countries" à partir du fichier "World.json" chargé précedemment via la méthode queue().
    g.selectAll(".countries")
	.data(topojson.object(countries, countries.objects.countries).geometries)
	.enter()
	.append("path")// On ajoute l'élément "path" à l'élément "g" pour chaque élément ".countries".
	.attr("d", path) // On définit l'attribut "d" qui va récupérer les données après execution de la méthode path.
	.attr("class", "countries")
	.on("mouseover", mouseover)
    
	.on("mousemove",  function(d) {
	    
	    //On utilise la fonction d3.nest() afin de grouper des données entre elles. Ici le country avec id.
	    // Ainsi, on obtient pour chaque pays une liste dont la longueur correspond au nombre de id, donc au nombre de stages dans ce pays. Chaque id étant unique.
	    var creation_compteurs = d3.nest()
		.key(function(d) { return d.properties.country; })
		.key(function(d) { return d.properties.id; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(internship.features);
	    

	    // C'est notre variable compteur qui récupère pour chaque élément le nombre de stages dans cet élément. Le nombre de stages par pays donc.
	    var compteur;
	    for (var i = 0; i < creation_compteurs.length; i++) {
		if (d.properties.name == creation_compteurs[i].key) {
		    compteur = creation_compteurs[i].values.length;
		    break;
		    return compteur;
		}
		else {
		    compteur = 0;
		}
	    }
	    
	    // Ca c'est ce qui s'affiche dans la fenêtre au passage de la souris
	    // On ajoute du contenu à notre élément div.
	    div.html(d.properties.name  + "<br/>" + "internships: " + compteur )
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 50) + "px");

	    if (d.properties.name == "France") {
		div.html(d.properties.name  + "<br/>" + "internships: " + compteur + "<br/>" + "Click for details" )
		.style("left", (d3.event.pageX) + "px")
		    .style("top", (d3.event.pageY - 50) + "px");
	    }

		
	})
    
    
    
	.on("mouseout", mouseout)
 	.attr("fill", couleur) // Couleur est une méthode explicité plus tard dans le script.
	.on("click",ClickPays); // De même, la méthode ClickPays sera détaillée.

    
    // Ici, on va créer les élements ".internship" à partir du fichier "internship.json" chargé précedemment via la méthode queue(). 
    g.selectAll(".internship") 
	.data(internship.features)
	.enter()
	.append("path")
	.attr("d", path.pointRadius(1))
	.attr("class", "internship")
	.on("mouseover", mouseover) 
	.on("mousemove", mousemove)
	.on("mouseout", mouseout);

    

	
    // Ici, on code la fonction couleur qui va colorer les éléments ".countries" en fonction du compteur de cet élément.
    function couleur(d) {
	
	
	var creation_compteurs = d3.nest()
	    .key(function(d) { return d.properties.country; })
	    .key(function(d) { return d.properties.id; })
	    .rollup(function(leaves) { return leaves.length; })
	    .entries(internship.features);
	
    
	var color = "AliceBlue";
	for (var i = 0; i < creation_compteurs.length; i++) {
	    if (d.properties.name == creation_compteurs[i].key) {
		if (creation_compteurs[i].values.length  == 1) {
		    color = "GoldenRod";
		    return color;					    
		}
		
		else if (creation_compteurs[i].values.length  > 1 && creation_compteurs[i].values.length < 6) {
		    color = "DarkGoldenRod";
		    return color;					    
		}
		
		else if (creation_compteurs[i].values.length > 5 && creation_compteurs[i].values.length < 10 ) {
		    color = "IndianRed";
		    return color;
		}
		
		else if (creation_compteurs[i].values.length >= 10) {
		    color = "DarkRed";
		    return color;
		}		
		
	    }
	}
	
	return color;
    }
}
    
      
    
// Ici on code la fonction ClickPays qui détermine le comportement au click sur un pays.

function ClickPays(d) {
    

    // La fonction BackToMap permet de retourner au planisphère.
    function BackToMap(d) {
	
	svg.select(".button_back").remove();
	svg.select(".text_button_back").remove();
	g.selectAll(".regions").remove();
	g.selectAll(".internshipFr").remove();
	g.selectAll(".cities").remove();
	
	queue()
	    .defer(d3.json, "data/world.json")
	    .defer(d3.json, "data/internship.json")
	    .await(makeMyMap);
	
    }


    // Ici on implémente la fonction de zoom au click.
    function ClickZoom(d) {

	// On déclare nos variables de coordonées x,y et z.
	
	var x, y, z;
	
	
	var centroid = path.centroid(d); // Méthode qui calcule le barycentre de chaque élément "path".
	x = centroid[0]; // On attribue à x la valeur de la coordonnée x du barycentre.
	y = centroid[1]; // on attribue à y la valeur de la coordonnée y du barycentre.
	z = 11;
	    

	//Ici on spécifie les élement que l'on souhaite être concernés par le zoom.
	// l'attribut "active" permet d'identifier un élément comme étant zoomé, pour qu'au prochain click il soit dézoomé.
	// L'attribut "translate" va établir de nouvelles coordonnées x, y et z afin de pouvoir zoomer sur l'élément et le centrer au milieu de notre image. 
	
	g.selectAll(".regions")
	    .transition()
	    .duration(1000)
	    .attr("transform", "translate(" + x  + "," + y  + ")scale(" + z  + ")translate(" + -x + "," + -y + ")");
	
	g.selectAll(".internshipFr")
	    .transition()
	    .duration(1000)
	    .attr("transform", "translate(" + x + "," + y + ")scale(" + z + ")translate(" + -x + "," + -y + ")");
	
	g.selectAll(".cities")
	    .transition()
	    .duration(1000)
	    .attr("transform", "translate(" + x + "," + y + ")scale(" + z + ")translate(" + -x + "," + -y + ")");
	
	
	
	
    }
    
    // La fonction makeMyFrance permet de construire une carte de France avec les régions, les stages en France et les principales villes francaises.
    
    function makeMyFrance(error, regions, internship, cities) {
	
	
	// Ici, on va créer les élements ".regions" à partir du fichier "regions.json" chargé précedemment via la méthode queue(). 
	g.selectAll(".regions")
	    .data(regions.features)
	    .enter()
	    .append("path")
	    .attr("d", path)
	    .attr("class", "regions")
	    .on("mouseover", mouseover)
	    .on("mousemove",  function(d) {
		


		//On utilise la fonction d3.nest() afin de grouper des données entre elles. Ici region avec id.
	    // Ainsi, on obtient pour chaque region une liste dont la longueur correspond au nombre de id, donc au nombre de stages dans cette région. Chaque id étant unique.
		var creation_compteurs_regions = d3.nest()
		    .key(function(d) { return d.properties.region; })
		    .key(function(d) { return d.properties.id; })
		    .rollup(function(leaves) { return leaves.length; })
		    .entries(internship.features);
		

		// C'est notre variable compteur_regions qui récupère pour chaque élément le nombre de stages dans cet élément. Le nombre de stages par région donc.
		var compteur_regions;
		for (var i = 0; i < creation_compteurs_regions.length; i++) {
		    if (d.properties.nom == creation_compteurs_regions[i].key) {
			compteur_regions = creation_compteurs_regions[i].values.length;
			break;
			return compteur_regions;
		    }
		    else {
			compteur_regions = 0;
		    }
		}
		
		
		//Ca c'est ce qui s'affiche dans la fenêtre au passage de la souris
		div.html(d.properties.nom  + "<br/>" + "internships: " + compteur_regions )
		    .style("left", (d3.event.pageX) + "px")
		    .style("top", (d3.event.pageY - 50) + "px");
	    })
	
	    .on("mouseout", mouseout)
	    .attr("fill", couleur_region);


	// Ici, on implémente la fonction couleur_region qui va colorer les éléments ".regions" en fonction du compteur de cet élément.
	function couleur_region(d) {
	    
	    
	    var creation_compteurs_regions = d3.nest()
		.key(function(d) { return d.properties.region; })
		.key(function(d) { return d.properties.id; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(internship.features);
	    
	    var color_region = "AliceBlue";
	    for (var i = 0; i < creation_compteurs_regions.length; i++) {
		if (d.properties.nom == creation_compteurs_regions[i].key) {
		    if (creation_compteurs_regions[i].values.length  == 1) {
			color_region = "GoldenRod";
			return color_region;					    
		    }
		    
		    else if (creation_compteurs_regions[i].values.length  > 1 && creation_compteurs_regions[i].values.length < 6) {
			color_region = "DarkGoldenRod";
			return color_region;					    
		    }
		    
		    else if (creation_compteurs_regions[i].values.length > 5 && creation_compteurs_regions[i].values.length < 10 ) {
			color_region = "IndianRed";
			return color_region;
		    }
		    
		    else if (creation_compteurs_regions[i].values.length >= 10) {
			color_region = "DarkRed";
			return color_region;
		    }		
		    
		}
	    }
	    
	    return color_region;
	}
	
	 // Ici, on va créer les élements ".internship" à partir du fichier "internship.json" chargé via la méthode queue(). 
	g.selectAll(".internshipFr")
	    .data(internship.features
		  .filter(function(d)  { return d.properties.country == "France";  }))
	    .enter()
	    .append("path")
	    .attr("d", path.pointRadius(0.2))
	    .attr("class", "internshipFr")
	    .on("mouseover", mouseover) 
	    .on("mousemove", mousemove)
	    .on("mouseout", mouseout);
	
	 // Puis, on  crée les élements ".cities" à partir du fichier "cities.json" chargé via la méthode queue(). 
	g.selectAll(".cities")
	    .data(cities.features)
	    .enter()
	    .append("path")
	    .attr("d", path.pointRadius(0.1))
	    .attr("class", "cities")
	    .on("mouseover", mouseover) 
	    .on("mousemove", function (d){
		div.html("City: " + d.properties.name  + "<br/>"  )
		    .style("left", (d3.event.pageX) + "px")
		    .style("top", (d3.event.pageY - 50) + "px");
	    })
	    .on("mouseout", mouseout);
	
	
	ClickZoom(d);		
	
    }
    
    // Si la condition est remplie, alors on crée la carte de la France via la méthode MakeMyFrance et on crée un bouton de retour au planisphère qui comporte la méthode BackToMap.
    if (d.properties.name === "France") {
	
	svg.append("rect")
	    .attr("class", "button_back")
	    .attr("width", 40)
	    .attr("height", 40)
	    .attr("x", 200)
	    .attr("y", 200)
	    .on("click", BackToMap);
	
	svg.append("text")
	    .attr("class", "text_button_back")
	    .attr("x", 250)
	    .attr("y", 220)
	    .text("retour à la map");
	
	g.selectAll(".internship").remove();
	g.selectAll(".countries").remove();
	
	queue()
	    .defer(d3.json, "data/regions.json")
	    .defer(d3.json, "data/internship.json")
	    .defer(d3.json, "data/cities.json")
	    .await(makeMyFrance);
	
	
    }
    
}


// Méthode qui permet d'afficher un cadre vide dans l'élément div au survol d'un élément du planisphère.
function mouseover(){
    div.transition()
	.duration(200)
	.style("opacity", .9);
}



// Méthode qui remplit le cadre avec les données d'intéret, soit la ville, l'année et le centre d'accueil du stage.
function mousemove(d){
    div.html("City: " + d.properties.city  + "<br/>" + "Year: " + d.properties.year + "<br/>" + "Center: " + d.properties.center )
	.style("left", (d3.event.pageX) + "px")
	.style("top", (d3.event.pageY - 50) + "px");
}



// Méthode qui permet de faire disparaitre le cadre à la fin du survol d'un élément. Avant le survol d'un autre élément donc.
function mouseout(){
    div.transition()
	.duration(500)
	.style("opacity", 0);
}


//Création des boutons permettants d'afficher les stages par année.


// Variable qui contient les différentes années. 
var buttons_localisation = [[2013],[2014],[2015],[2016]]



var box = svg.selectAll(".rect")
    .data(buttons_localisation)
    .enter()
    .append("g")
    .attr("class", "button")
    .attr("transform", function(d, i) { 
	var x = 1300;
	var y = i * 50;
	return "translate(" + x + "," + y + ")";
 });;


box.append("rect")
    .attr("width", taille_rect)
    .attr("height", taille_rect)
    .attr("id", function(d) {return d[0];})
    .on("click", change);
 


box.append("text")
    .text (function(d) {return d[0];})
    .attr("x", taille_rect + legendSpacing)
    .attr("y", taille_rect - legendSpacing);



// Implémentation de la fonction change qui va permettre le changement de couleur au click de nos bouttons de séléction de d'années.
function change() {

    var button_id = this.id;
    var color_button;

    // Toutes ces conditions permettent de palier à d'éventuelles erreurs dues aux différences de nomenclatures entre les navigateurs web.
    if (document.getElementById(button_id).style.fill === "#ff0000" || document.getElementById(button_id).style.fill === "Red" || document.getElementById(button_id).style.fill === "red" || document.getElementById(button_id).style.fill === "rgb(255,0,0)"){
		color_button = "red" // On fixe une constante "red" pour désigner la couleur rouge.
	}
	if (document.getElementById(button_id).style.fill === "#008000" || document.getElementById(button_id).style.fill === "Green" || document.getElementById(button_id).style.fill === "green" || document.getElementById(button_id).style.fill === "rgb(0,255,0)" || document.getElementById(button_id).style.fill === ""){
		color_button = "green" // On fixe une constante "green" pour désigner la couleur verte. 
	}


    // Si le bouton est vert avant le click, on le colore en rouge et on fait disparaitre les stages correspondants à l'année du boutton de séléction.
    if (color_button === "green"){
	document.getElementById(button_id).style.fill = "Red";
	g.selectAll(".internshipFr")
	    .filter(function(d){return d.properties.year == button_id;})
	    .transition()
	    .attr("d", path.pointRadius(0))
	    .duration(0);

	g.selectAll(".internship")
	    .filter(function(d){return d.properties.year == button_id;})
	    .transition()
	    .attr("d", path.pointRadius(0))
	    .duration(0);

	return null;
	
    }

    // Si le bouton est rouge avant le click, on le colore en vert et on fait réapparaitre les stages correspondants à l'année du boutton de séléction.
    if (color_button === "red"){
	document.getElementById(button_id).style.fill = "green";
	g.selectAll(".internshipFr")
	    .filter(function(d){return d.properties.year == button_id;})
	    .transition()
	    .attr("d", path.pointRadius(0.2))
	    .duration(0);
	
	g.selectAll(".internship")
	    .filter(function(d){return d.properties.year == button_id;})
	    .transition()
	    .attr("d", path.pointRadius(1))
	    .duration(0);
	
	return null; 
    }
}
