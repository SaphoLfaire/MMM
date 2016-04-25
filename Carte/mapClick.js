//On commence par déclarer toutes nos variables

//On ajoute un div au body. Le div du html va ainsi pouvoir contenir notre tooltip

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);


//Variables qui définissent les dimensions de l'image
var width = 1400,
    height = 800;

var button_width = 40, button_height = 40;



// La variable projection pour projeter les données sur la carte
var projection = d3.geo.mercator()
    .center([10, 70 ])
    .scale(150)
    .rotate([0,0]);



//Création de l'image au format SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);



//On ajoute à notre image un rectangle qui sera notre fond bleu
svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

//L'objet path permet de manipuler les données géographiques de nos fichiers GeoJson
//En fait, path (=chemin) permet de dessiner le contour de nos objets.
var toto = d3.geo.path()
    .projection(projection);



//Variable g, qui permet de grouper les éléments de l'image SVG
var g = svg.append("g");

//La légende

var color = d3.scale.ordinal() //Fonction qui permet d'associer une couleur à une catégorie
    .domain(["0", "1", "2++"])
    .range(["AliceBlue", "GoldenRod", "IndianRed"]);

var taille_rect= 15; //Taille des rectangles
var legendSpacing = 4; //Espace entre les rectangles


var legend =svg.selectAll(".legend")//On sélectionne tous les éléments qu'on va créer
    .data(color.domain())// On récupère nos 3 catégories à légender
    .enter()// On crée des espaces réservés pour chaque donnée (3 donc)
    .append("g") // On ajoute une balise g qui va contenir nos éléments legend
    .attr("class", "legend") // On définit la classe des objets
    .attr("transform", function(d, i) { // On crée un attribut qui va modifier nos éléments en terme de dimensions
	console.log("index: " + i)
	
	var hauteur = taille_rect;
	var x = i *40;
	var y = hauteur;
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



//Fonction qui permet de charger les données dans l'ordre où on place nos fichiers GeoJson
queue()
    .defer(d3.json, "world.json")
    .defer(d3.json, "internship.json")
    .await(makeMyMap);


//fonction qui créee la map en fonction des données qu'on a chargé précedemment
function makeMyMap(error, countries, internship) {
    
    //On s'occupe des pays du fichier World.json
    g.selectAll(".countries")
	.data(topojson.object(countries, countries.objects.countries).geometries)
	.enter()
	.append("path")
	.attr("d", toto)
	.attr("class", "countries")
    
    
	.on("mouseover", mouseover)
    
	.on("mousemove",  function(d) {
	    
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
	    div.html(d.properties.name  + "<br/>" + "compteur " + compteur )
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 50) + "px");
	})
    
    
    
    
    
	.on("mouseout", mouseout)
 	.attr("fill", couleur)
	.on("click", ClickFrance);
    
    function couleur(d) {
	
	
	var creation_compteurs = d3.nest()
	    .key(function(d) { return d.properties.Pays; })
	    .key(function(d) { return d.properties.id; })
	    .rollup(function(leaves) { return leaves.length; })
	    .entries(internship.features);
	
    
	var compteur_couleur;
	var color = "AliceBlue";
	for (var i = 0; i < creation_compteurs.length; i++) {
	    if (d.properties.name == creation_compteurs[i].key) {
		if (creation_compteurs[i].values.length == 1) {
		    color = "GoldenRod";
		    return color;					    
		}						  
		else if (creation_compteurs[i].values.length > 1){
		    color = "IndianRed";
		    return color;					    
		}						  
	    }
	}
	return color;
    }

    
    function ClickFrance(d) {
	
	if (d.properties.name == "France") {
	    g.selectAll(".internship").remove(); //On supprime les objets internship avant de les recréer sur les régions de France.
	    queue()
		.defer(d3.json, "regions.json")
		.defer(d3.json, "internship.json")
		.await(makeMyFrance);

	}
	
	function makeMyFrance(error, regions, internship) {
	    g.selectAll(".regions")
		.data(regions.features)
		.enter()
		.append("path")
		.attr("d", toto)
		.attr("class", "regions")
		.on("mouseover", mouseover)
		.on("mousemove",  function(d) {	
		    div.html(d.properties.nom  + "<br/>" )
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 50) + "px");
		})
		.on("mouseout", mouseout);
	    
	    
	    
	    g.selectAll(".internshipFr")
		.data(internship.features)
		.enter()
		.append("path")
		.attr("d", toto.pointRadius(0.5))
		.attr("class", "internshipFr")
		.on("mouseover", mouseover) 
		.on("mousemove", mousemove) 
		.on("mouseout", mouseout);
	}
}

	    

	   
    
    
    
    
    

    
    //On s'occupe des stages de internship.json
    g.selectAll(".internship") //Ici, on sélectionne tous les objets qu'on va créer (pas clair)
	.data(internship.features) //On spécifie les données que l'on souhaite au sein du fichier json.
	.enter()//Là, on crée des espaces reservés pour chaque entrée spécifiée auparavant.
	.append("path")// Puis on ajoute un élément dans chacun des espaces réservés crées précedemment.
    
    
	.attr("d", toto.pointRadius(1))//On envoie les données (d) à path qui s'occupe de dessiner les coutours des objets, de les représenter donc.
    //On décide de représenter les objets par des points dont on spécifie le rayon.
	.attr("class", "internship")//On définit un attribut class dont la valeur est internship pour tous nos objets.
	.on("mouseover", mouseover) //Fonction
	.on("mousemove", mousemove) //Fonction
	.on("mouseout", mouseout); //Fonction
    
    
    console.log("année du stage: " + internship.features[0].properties.year)
   
    
    //Création des compteur de stages pour chaque pays.
    //Utilisation de la fonction nest qui permet de grouper les données comme on le souhaite.
    //Ici, on regroupe tous les id en fonction de leur pays.
    //Un id identifie un stage de manière unique.
    
    var creation_compteurs = d3.nest()
	.key(function(d) { return d.properties.Pays; })
	.key(function(d) { return d.properties.id; })
	.rollup(function(leaves) { return leaves.length; })
	.entries(internship.features);
    
    //La longeur de la liste d'id pour un pays correspond au nombre de stages effectués dans ce pays.
    
    var compteurUK = creation_compteurs[0].values.length;
    var compteurUK_2015 = creation_compteurs[0].values[0].values;
    var compteurUK_2016 = creation_compteurs[0].values[1].values;
    var pays = creation_compteurs[0].key;
    
    
    console.log(creation_compteurs)
    console.log("stages en UK:  " + compteurUK)
    console.log("stages en UK en 2015: " + compteurUK_2015)
    console.log("stages en UK en 2016: " + compteurUK_2016)
    console.log("Quel pays? " + pays)
    
    
    
}


//Le zoom.

var zoom = d3.behavior.zoom()
.on("zoom",function() {
g.attr("transform","translate("+ 
       d3.event.translate.join(",")+")scale("+d3.event.scale+")");



});

svg.call(zoom)


//fonctions de comportement des éléments de l'image au passage de la souris.




function mouseover(){
    div.transition()
	.duration(200)
	.style("opacity", .9);
}

function mousemove(d){
    div.html("ville: " + d.properties.name  + "<br/>" + "année: " + d.properties.year )
	.style("left", (d3.event.pageX) + "px")
	.style("top", (d3.event.pageY - 50) + "px");
}

function mouseout(){
    div.transition()
	.duration(500)
	.style("opacity", 0);
}


	/*
function couleur(d) {
    
    
    var creation_compteurs = d3.nest()
	.key(function(d) { return d.properties.Pays; })
	.key(function(d) { return d.properties.id; })
	.rollup(function(leaves) { return leaves.length; })
	.entries(internship.features);
    
    
    
    
    var compteur_couleur;
    var color = "AliceBlue";
    for (var i = 0; i < creation_compteurs.length; i++) {
	if (d.properties.name == creation_compteurs[i].key) {
	    if (creation_compteurs[i].values.length == 1) {
		color = "GoldenRod";
		return color;					    
	    }						  
	    else if (creation_compteurs[i].values.length > 1){
		color = "IndianRed";
		return color;					    
	    }						  
	}
    }
    return color;
}



//Compteur année.
/*
  
  var creation_compteurs = d3.nest()
  .key(function(d) { return d.properties.Pays; })
  .key(function(d) { return d.properties.year; })
  .rollup(function(leaves) { return leaves.length; })
  .entries(internship.features);
  
  var compteurUK = creation_compteurs[0].values.length;
  var compteurUK_2015 = creation_compteurs[0].values[0].values;
  var compteurUK_2016 = creation_compteurs[0].values[1].values;
  var pays = creation_compteurs[0].key;
  
  
  console.log(creation_compteurs)
  console.log("stages en UK:  " + compteurUK)
  console.log("stages en UK en 2015: " + compteurUK_2015)
  console.log("stages en UK en 2016: " + compteurUK_2016)
  console.log("Quel pays? " + pays)
  
*/


