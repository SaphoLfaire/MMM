//On commence par déclarer toutes nos variables

//On ajoute un div au body. Le div du html va ainsi pouvoir contenir notre tooltip

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);


//Variables qui définissent les dimensions de l'image
var width = 1400,
    height = 800;

//On définit la variable zoomON qui va permettre de zoom au click.
var zoomON;


//On définit les variables width et height pour définir les dimensions de nos boutons de sélection d'année.

var button_width = 20, button_height = 20;



// La variable projection pour projeter les données sur la carte
var projection = d3.geo.mercator()
    .center([0, 45 ])
    .scale(190)
    .translate([width/2, height/2])
    .rotate([0,0]);



//Création de l'image au format SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height);



//On ajoute à notre image un rectangle qui sera notre fond bleu


svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);
    


//L'objet path permet de manipuler les données géographiques de nos fichiers GeoJson
//En fait, path (=chemin) permet de dessiner le contour de nos objets.
var path = d3.geo.path()
    .projection(projection);


//Variable g, qui permet de grouper les éléments de l'image SVG
var g = svg.append("g");


//Le zoom


var Myzoom = d3.behavior.zoom()
    .on("zoom",function() {
	g.attr("transform","translate("+ d3.event.translate.join(",")+")scale("+d3.event.scale+")")

    });

svg.call(Myzoom)
    


//La légende

var color = d3.scale.ordinal() //Fonction qui permet d'associer une couleur à une catégorie
    .domain(["0", "1", "2 à 5", "5 à 10", "10++"])
    .range(["AliceBlue", "GoldenRod", "DarkGoldenRod", "IndianRed", "DarkRed"]);

var taille_rect= 50; //Taille des rectangles
var legendSpacing = 4; //Espace entre les rectangles


var legend =svg.selectAll(".legend")//On sélectionne tous les éléments qu'on va créer
    .data(color.domain())// On récupère nos 3 catégories à légender
    .enter()// On crée des espaces réservés pour chaque donnée (3 donc)
    .append("g") // On ajoute l'élément g à l'image
    .attr("class", "legend") // On définit la classe des objets
    .attr("transform", function(d, i) { // On crée un attribut qui va modifier nos éléments en terme de dimensions en fonction des index de domain.
	
	var hauteur = taille_rect;
	var x = hauteur;
	var y = i * 30;
	return "translate(" + x + "," + y + ")";
    });


//Contruction de la légende
legend.append("rect") // On ajoute un rectangle à l'image pour chaque élément
    .attr("width", taille_rect)
    .attr("height", taille_rect)
    .style("fill", color)
    .style("stroke", "black");

legend.append("text") // On ajoute du texte pour chaque élément
    .attr("x", taille_rect + legendSpacing)
    .attr("y", taille_rect - legendSpacing)
    .text(function(d) { return d; });




//Construction de tous nos pays avec leurs stages respectifs.

//Fonction qui permet de charger les données dans l'ordre où on place nos fichiers GeoJson.
queue()
    .defer(d3.json, "data/world.json")
    .defer(d3.json, "data/internship.json")
    .await(makeMyMap);


//fonction qui créee la map en fonction des données qu'on a chargé précedemment
function makeMyMap(error, countries, internship) {
    
    
    //On s'occupe des pays du fichier World.json
    g.selectAll(".countries")
	.data(topojson.object(countries, countries.objects.countries).geometries)
	.enter()
	.append("path")
	.attr("d", path)
	.attr("class", "countries")
	.on("mouseover", mouseover)
    
	.on("mousemove",  function(d) {
	    
	    
	    var creation_compteurs = d3.nest()
		.key(function(d) { return d.properties.country; })
		.key(function(d) { return d.properties.id; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(internship.features);
	    
	    
	    var creation_compteurs_regions = d3.nest()
		.key(function(d) { return d.properties.region; })
		.key(function(d) { return d.properties.id; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(internship.features);
	    
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
	    
	    //Ca c'est ce qui s'affiche dans la fenêtre au passage de la souris
	    div.html(d.properties.name  + "<br/>" + "internships: " + compteur )
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 50) + "px");
	})
    
    
    
	.on("mouseout", mouseout)
 	.attr("fill", couleur)
	.on("click",ClickPays);

    

    g.selectAll(".internship") 
	.data(internship.features)
	.enter()
	.append("path")
	.attr("d", path.pointRadius(1))
	.attr("class", "internship")
	.on("mouseover", mouseover) 
	.on("mousemove", mousemove)
	.on("mouseout", mouseout);

    

	
    
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
    
      
    

function ClickPays(d) {

    
    if (d.properties.name == "France") {

	    

	function BackToMap(d) {
	    
	    svg.select(".button_back").remove();
	    svg.select(".text_button_back").remove();
	    g.selectAll(".regions").remove();
	    g.selectAll(".internshipFr").remove();	    
	    
	    queue()
		.defer(d3.json, "data/world.json")
		.defer(d3.json, "data/internship.json")
		.await(makeMyMap);
	    
	}

	function ClickZoom(d) {
	    
	    var x, y, z;
	    
	    //Si le zoom n'est pas actif, on peut zoomer.
	    
	    if (zoomON == null) {
		var centroid = path.centroid(d);
		x = centroid[0];
		y = centroid[1];
		z = 11;
	    	
		zoomON = 1; //On note le zoom comme étant actif
	    }
	    
	    //Ici on retourne à la position initiale car le zoom est actif. Donc on veut dezoomer.
	    
	    else {
		x = width / 2;
		y = height / 2;
		z = 1;
		zoomON = null;
	    }
	    
	    //Ici on spécifie les élement que l'on souhaite être concernés par le zoom.
	    g.selectAll(".countries")
		.classed("active", zoomON)
		.transition()
		.duration(750)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + z + ")translate(" + -x + "," + -y + ")");
	    
	    g.selectAll(".regions")
		.classed("active", zoomON )
		.transition()
		.duration(750)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + z + ")translate(" + -x + "," + -y + ")");
	    
	    g.selectAll(".internshipFr")
		.classed("active", zoomON )
		.transition()
		.duration(750)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + z + ")translate(" + -x + "," + -y + ")");
	    
	    
	    
	    
	}

	  
	function makeMyFrance(error, regions, internship) {

	    
	    
	    g.selectAll(".regions")
		.data(regions.features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("class", "regions")
		.on("mouseover", mouseover)
		.on("mousemove",  function(d) {

		    	
		    var creation_compteurs_regions = d3.nest()
			.key(function(d) { return d.properties.region; })
			.key(function(d) { return d.properties.id; })
			.rollup(function(leaves) { return leaves.length; })
			.entries(internship.features);
		    
		    
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
		    div.html(d.properties.nom  + "<br/>" + "compteur " + compteur_regions )
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 50) + "px");
		})
	    
		.on("mouseout", mouseout)
		.attr("fill", couleur_region);
	    
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
	    
	    ClickZoom(d);		
	    
	}
    }


    
    svg.append("rect")
	.attr("class", "button_back")
	.attr("width", 25)
	.attr("height", 25)
	.attr("x", 200)
	.attr("y", 200)
	.on("click", BackToMap);
    
    svg.append("text")
	.attr("class", "text_button_back")
	.attr("x", 230)
	.attr("y", 215)
	.text("retour à la map");
    
    g.selectAll(".internship").remove();
    g.selectAll(".countries").remove();
    
    queue()
	.defer(d3.json, "data/regions.json")
	.defer(d3.json, "data/internship.json")
	.await(makeMyFrance);
    
   
    
}




function mouseover(){
    div.transition()
	.duration(200)
	.style("opacity", .9);
}



function mousemove(d){
    div.html("City: " + d.properties.city  + "<br/>" + "Year: " + d.properties.year + "<br/>" + "Center: " + d.properties.center )
	.style("left", (d3.event.pageX) + "px")
	.style("top", (d3.event.pageY - 50) + "px");
}


function mouseout(){
    div.transition()
	.duration(500)
	.style("opacity", 0);
}


//Création des boutons permettants d'afficher les stages par année.


var buttons_localisation = [[2013],[2014],[2015],[2016]]



var box = svg.selectAll(".rect")
    .data(buttons_localisation)
    .enter()
    .append("g")
    .attr("class", "button")
    .attr("transform", function(d, i) { 
	var hauteur = 1200 ;
	var x = hauteur;
	var y = i * 30;
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




function change() {

    var button_id = this.id;
    console.log("tu viens de cliquer sur le bouton de "+ button_id);
    if (document.getElementById(button_id).style.fill != "Red"){
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
    if (document.getElementById(button_id).style.fill != "Green"){
	document.getElementById(button_id).style.fill = "Green";
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

