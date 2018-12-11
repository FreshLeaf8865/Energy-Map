if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;
var data;

var camera, cameraTarget, scene, renderer;

var mouse = new THREE.Vector2(), INTERSECTED;

var heigth1 = [];
var heigth2 = [];
var heigth3 = [];
var heigth4 = [];
var heigth5 = [];
var heigth6 = [];
var heigth7 = [];
var heigth8 = [];

var layer = [];
var sortedLayers = [];
var heightsGlobal = [];
var heightsGlobal2 = [];

var graph = [];
var graphSystem;

var years = [];

var dataByYear = [];
var filteredData = [];

var stateId = 'NY';
var stateName = 'New York';
var currentYear = 2014;

var frustumSize = 1000;
var currentMaxValue = 0;

$.getJSON('data.json', function (info) {
	data = info;

	var count = Object.keys(data).length;

	for (var i = 1; i < count; i++) {
		years.push(data[i].Year);
	}

	// get unique years
	years = years.filter(uniqueVal);
	years.sort(function (a, b) {return a - b});

	//sort data by years
	for (var i = 0; i < years.length; i++) {
		dataByYear[years[i]] = [];
		for (var j = 1; j < count; j++) {
			if (data[j].Year !== years[i]) { continue }
			dataByYear[years[i]].push(data[j]);
		}
	}

	//if we need clean array

	// for (var i = 0; i<dataByYear.length; i++) {
	//     if (dataByYear[i]) {
	//         filteredData.push(dataByYear[i]);
	//     }
	// }
	//dataByYear.clean(undefined);

	var input = document.getElementById("1");
	input.setAttribute("min", years[0]);
	input.setAttribute("max", years[years.length-1]);
	input.setAttribute("value", years[years.length-1]);

	document.getElementById("slider1-value").innerHTML =years[years.length-1];

	init();
	animate();
	changeData(2010);
});


// RETURN UNIQUE VALUE

function uniqueVal(value, index, self) { 
  return self.indexOf(value) === index;
}
// CLEAR ARRAY 
Array.prototype.clean = function (deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

function init() {
	container = document.getElementById('canvas');

	var aspect = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10000);
	// camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 2000 );
							
	camera.position.set(0, 50, 100);

	cameraTarget = new THREE.Vector3(0, 30, 0);

	scene = new THREE.Scene();
	///scene.background = new THREE.Color( 0x72645b );
	scene.fog = new THREE.Fog(0xffffff, 100, 150);

	// Ground if needed

	var plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(40, 40),
		new THREE.MeshPhongMaterial({color: 0x9FD6E1, specular: 0x101010})
	);
	plane.rotation.x = -Math.PI/2;
	//scene.add( plane );

	// var axesHelper = new THREE.AxesHelper( 500 );
	// scene.add( axesHelper );

	// plane.receiveShadow = true;

	var spread = 10.5;
	graphSystem = new THREE.Group();
	graphSystem.position.z = -100;
	graphSystem.rotation.y = Math.PI;
	//graphSystem.geometry.translate( 0, 0, -50 );
	//graphSystem.applyMatrix( new THREE.Matrix4().makeTranslation( 0,0,50 ) );
	scene.add(graphSystem);

	function createGraph() {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var material1 = new THREE.MeshPhongMaterial( { color: 0x333333, transparent: true, shininess: 200, opacity: 0.8 } );
				var material2 = new THREE.MeshPhongMaterial( { color: 0x999999, transparent: true, shininess: 200, opacity: 0.8 } );

				var material6 = new THREE.MeshPhongMaterial( { color: 0xFFDB87, transparent: true, shininess: 200, opacity: 0.8 } ); //Solar
				var material4 = new THREE.MeshPhongMaterial( { color: 0x3C8FBB, transparent: true, shininess: 200, opacity: 0.8 } ); //Wind
				var material7 = new THREE.MeshPhongMaterial( { color: 0xF77C48, transparent: true, shininess: 200, opacity: 0.8 } ); //Geothermal
				var material3 = new THREE.MeshPhongMaterial( { color: 0x4E6EB1, transparent: true, shininess: 200, opacity: 0.8 } ); //Hydro
				var material5 = new THREE.MeshPhongMaterial( { color: 0x9DD7A5, transparent: true, shininess: 200, opacity: 0.8 } ); //BioFuel
				var material8 = new THREE.MeshPhongMaterial( { color: 0xD9444E, transparent: true, shininess: 200, opacity: 0.8 } ); //Nuclear


				heigth1[i] = 1;
				heigth2[i] = 1;
				heigth3[i] = 1;
				heigth4[i] = 1;
				heigth5[i] = 1;
				heigth6[i] = 1;
				heigth7[i] = 1;
				heigth8[i] = 1;

				var firstLetter = i + 1;
				var secondLetter = j + 1;

				var geometry1 = new THREE.BoxBufferGeometry( 10, heigth1[i], 10 );
				var geometry2 = new THREE.BoxBufferGeometry( 10, heigth2[i], 10 );
				var geometry3 = new THREE.BoxBufferGeometry( 10, heigth3[i], 10 );
				var geometry4 = new THREE.BoxBufferGeometry( 10, heigth4[i], 10 );
				var geometry5 = new THREE.BoxBufferGeometry( 10, heigth5[i], 10 );
				var geometry6 = new THREE.BoxBufferGeometry( 10, heigth6[i], 10 );
				var geometry7 = new THREE.BoxBufferGeometry( 10, heigth7[i], 10 );
				var geometry8 = new THREE.BoxBufferGeometry( 10, heigth8[i], 10 );

				var cube = new THREE.Mesh( geometry1, material1 );
				cube.position.set(spread * i - 11, heigth1[i] / 2, spread * j - 111);
				cube.name = 'B-' + firstLetter + '' + secondLetter + '';
				cube.energyType = 'waste';
				graphSystem.add(cube);
				graph.push(cube);

				var cube2 = new THREE.Mesh( geometry2, material2 );
				cube2.position.set(spread * i - 11, heigth2[i] / 2 + heigth1[i], spread * j - 111);
				cube2.name = 'C-' + firstLetter + '' + secondLetter + '';
				cube2.energyType = 'waste';
				if (secondLetter == 1) {
					cube.energyType = 'Coal';
					// cube2.energyType = 'Coal';
					cube.material.color = new THREE.Color( 0x585B62 );
					cube2.material.color = new THREE.Color( 0x585B62 );
					cube2.material.transparent = true;
					cube2.material.opacity = 0.8;
				}

				if (secondLetter == 2) {
					cube.energyType = 'Petroleum';
					// cube2.energyType = 'Petroleum';
					cube.material.color = new THREE.Color( 0x808080 );
					cube2.material.color = new THREE.Color( 0x808080 );
					cube2.material.transparent = true;
					cube2.material.opacity = 0.8;
				}

				if (secondLetter == 3) {
					cube.energyType = 'Natural Gas';
					// cube2.energyType = 'Natural Gas';
					cube.material.color = new THREE.Color( 0xAEAEAE );
					cube.material.color = new THREE.Color( 0xAEAEAE );
					cube2.material.transparent = true;
					cube2.material.opacity = 0.8;
				}
				graphSystem.add(cube2);
				graph.push(cube2);

				var cube3 = new THREE.Mesh(geometry3, material3);
				cube3.position.set(spread * i - 11, heigth3[i] / 2 + heigth1[i] + heigth2[i], spread * j - 111);
				cube3.name = 'A4-' + firstLetter + '' + secondLetter + '';
				cube3.energyType = 'Hydro';
				graphSystem.add(cube3);
				graph.push(cube3);

				var cube4 = new THREE.Mesh(geometry4, material4);
				cube4.position.set(spread * i - 11, heigth4[i] / 2 + heigth1[i] + heigth2[i] + heigth3[i], spread * j - 111);
				cube4.name = 'A2-' + firstLetter + '' + secondLetter + '';
				cube4.energyType = 'Wind';
				graphSystem.add(cube4);
				graph.push(cube4);

				var cube5 = new THREE.Mesh(geometry5, material5);
				cube5.position.set(spread * i - 11, heigth5[i] / 2 + heigth1[i] + heigth2[i] + heigth3[i] + heigth4[i], spread * j - 111);
				cube5.name = 'A5-' + firstLetter + '' + secondLetter + '';
				cube5.energyType = 'Biofuel';
				graphSystem.add(cube5);
				graph.push(cube5);

				var cube6 = new THREE.Mesh(geometry6, material6);
				cube6.position.set(spread * i - 11, heigth6[i] / 2 + heigth1[i] + heigth2[i] + heigth3[i] + heigth4[i] + heigth5[i], spread * j - 111);
				cube6.name = 'A1-' + firstLetter + '' + secondLetter + '';
				cube6.energyType = 'Solar';
				graphSystem.add(cube6);
				graph.push(cube6);

				var cube7 = new THREE.Mesh(geometry7, material7);
				cube7.position.set(spread * i - 11, heigth7[i] / 2 + heigth1[i] + heigth2[i] + heigth3[i] + heigth4[i] + heigth5[i] + heigth6[i], spread * j - 111);
				cube7.name = 'A3-' + firstLetter + '' + secondLetter + '';
				cube7.energyType = 'Geothermal';
				graphSystem.add(cube7);
				graph.push(cube7);

				var cube8 = new THREE.Mesh(geometry8, material8);
				cube8.position.set(spread * i - 11, heigth8[i] / 2 + heigth1[i] + heigth2[i] + heigth3[i] + heigth4[i] + heigth5[i] + heigth6[i] + heigth7[i], spread * j - 111);
				cube8.name = 'A6-' + firstLetter + '' + secondLetter + '';
				cube8.energyType = 'Nuclear';
				graphSystem.add(cube8);
				graph.push(cube8);
			}
		}
		//scene.add(graph);
	}

	function createGraph2() {
		var material00 = new THREE.MeshPhongMaterial( { color: 0xAEAEAE, transparent: true, shininess: 200, opacity: 0.8 } );
		var material01 = new THREE.MeshPhongMaterial( { color: 0x808080, transparent: true, shininess: 200, opacity: 0.8 } );
		var material02 = new THREE.MeshPhongMaterial( { color: 0x585B62, transparent: true, shininess: 200, opacity: 0.8 } );

		var material1 = new THREE.MeshPhongMaterial( { color: 0x333333, transparent: true, shininess: 200, opacity: 0.8 } );
		var material2 = new THREE.MeshPhongMaterial( { color: 0x999999, transparent: true, shininess: 200, opacity: 0.8 } );
		var material6 = new THREE.MeshPhongMaterial( { color: 0xFFDB87, transparent: true, shininess: 200, opacity: 0.8 } ); //Solar
		var material4 = new THREE.MeshPhongMaterial( { color: 0x3C8FBB, transparent: true, shininess: 200, opacity: 0.8 } ); //Wind
		var material7 = new THREE.MeshPhongMaterial( { color: 0xF77C48, transparent: true, shininess: 200, opacity: 0.8 } ); //Geothermal
		var material3 = new THREE.MeshPhongMaterial( { color: 0x4E6EB1, transparent: true, shininess: 200, opacity: 0.8 } ); //Hydro
		var material5 = new THREE.MeshPhongMaterial( { color: 0x9DD7A5, transparent: true, shininess: 200, opacity: 0.8 } ); //BioFuel
		var material8 = new THREE.MeshPhongMaterial( { color: 0xD9444E, transparent: true, shininess: 200, opacity: 0.8 } ); //Nuclear

		var geometry = new THREE.BoxBufferGeometry( 20, 1, 20 );

		var cube00 = new THREE.Mesh(geometry, material00);
		cube00.position.set(0, 0, 100);
		cube00.name = 'B00';
		cube00.singleTower = true;
		cube00.energyType = 'Natural gas';
		graphSystem.add(cube00);
		graph.push(cube00);

		var cube01 = new THREE.Mesh(geometry, material01);
		cube01.position.set(0, 1, 100);
		cube01.name = 'B01';
		cube01.singleTower = true;
		cube01.energyType = 'Petroleum';
		graphSystem.add(cube01);
		graph.push(cube01);

		var cube02 = new THREE.Mesh(geometry, material02);
		cube02.position.set(0, 2, 100);
		cube02.name = 'B02';
		cube02.singleTower = true;
		cube02.energyType = 'Coal';
		graphSystem.add(cube02);
		graph.push(cube02);

		// var cube = new THREE.Mesh( geometry, material1 );
		// cube.position.set(0,0,100);
		// cube.name = 'B';
		// cube.singleTower = true;
		// cube.energyType = 'Natural gas';
		// graphSystem.add(cube);
		// graph.push( cube );

		var cube2 = new THREE.Mesh(geometry, material2);
		cube2.position.set(0, 3, 100);
		cube2.name = 'C';
		cube2.singleTower = true;
		cube2.energyType = 'waste';
		cube2.material.color = new THREE.Color(0xCAC9C9);
		graphSystem.add(cube2);
		graph.push(cube2);

		var cube3 = new THREE.Mesh(geometry, material3);
		cube3.position.set(0, 4, 100);
		cube3.name = 'A4';
		cube3.singleTower = true;
		cube3.energyType = 'Hydro';
		graphSystem.add(cube3);
		graph.push(cube3);

		var cube4 = new THREE.Mesh( geometry, material4 );
		cube4.position.set(0,5,100);
		cube4.name = 'A2';
		cube4.singleTower = true;
		cube4.energyType = 'Wind';
		graphSystem.add(cube4);
		graph.push( cube4 );

		var cube5 = new THREE.Mesh(geometry, material5);
		cube5.position.set(0, 6, 100);
		cube5.name = 'A5';
		cube5.singleTower = true;
		cube5.energyType = 'Biofuel';
		graphSystem.add(cube5);
		graph.push(cube5);

		var cube6 = new THREE.Mesh(geometry, material6);
		cube6.position.set(0, 7, 100);
		cube6.name = 'A1';
		cube6.singleTower = true;
		cube6.energyType = 'Solar';
		graphSystem.add(cube6);
		graph.push(cube6);

		var cube7 = new THREE.Mesh(geometry, material7);
		cube7.position.set(0, 8, 100);
		cube7.name = 'A3';
		cube7.singleTower = true;
		cube7.energyType = 'Geothermal';
		graphSystem.add(cube7);
		graph.push(cube7);

		var cube8 = new THREE.Mesh(geometry, material8);
		cube8.position.set(0, 9, 100);
		cube8.name = 'A6';
		cube8.singleTower = true;
		cube8.energyType = 'Nuclear';
		graphSystem.add(cube8);
		graph.push(cube8);
	}

	createGraph();
	createGraph2();   

	// Lights shortcodes to add light

	scene.add( new THREE.HemisphereLight( 0xffffff, 0xcccccc, 0.4 ) );

	addShadowedLight( 1, 0, 1, 0xffffff, 0.6 );
	addShadowedLight( -1, 0, 1, 0xffffff, 0.6 );

	// renderer scene settings. Don't touch it

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor( 0xffffff );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.renderReverseSided = false;

	// CONTROLS
	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.addEventListener( 'change', render );

	container.appendChild( renderer.domElement );

	// stats - uncomment this to see the FPS

	//stats = new Stats();
	//container.appendChild( stats.dom );

	//

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'mousemove', onDocumentMouseMove, false );
}

// Function that creates light with its given parameters
function addShadowedLight(x, y, z, color, intensity) {
	var directionalLight = new THREE.DirectionalLight(color, intensity);
	directionalLight.position.set(x, y, z);
	scene.add(directionalLight);

	directionalLight.castShadow = true;

	var d = 1;
	directionalLight.shadow.camera.left = -d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = -d;

	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 4;

	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;

	directionalLight.shadow.bias = -0.005;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	camera.lookAt(cameraTarget);

	// graphSystem.rotation.y += 0.1;

	render();
}

function render() {
	TWEEN.update();
	renderer.render(scene, camera);
}

// SLIDERS
var sliders = document.getElementsByClassName('slider');

for (var i = 0; i < sliders.length; i++) {
	sliders[i].addEventListener('input', onSliderInput, false);
	sliders[i].addEventListener('change', onSliderChange, false);
}
function onSliderInput() {
	var output = 'slider' + this.id + '-value';
	document.getElementById(output).innerHTML = this.value;
  changeData(this.value);
}
function onSliderChange() {
  changeData(this.value);
}
function onDocumentMouseMove(event) {
	if (!INTERSECTED) {
		var popupX = event.clientX;
		var popupY = event.clientY - 140;
	}

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(graph);

	if (intersects.length > 0) {
		if (INTERSECTED != intersects[ 0 ].object) {
			if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

			for (var i = 0; i < graph.length; i++) {
				graph[i].material.opacity = 0.6;
			}

			INTERSECTED = intersects[0].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex(0xff0000);
			INTERSECTED.material.opacity = 0.8;

			$('html,body').css('cursor', 'pointer');
		}

		var towerName = INTERSECTED.name;
		towerName = towerName.substring(towerName.indexOf("-") + 1); // get tower index (11...33)

		if (INTERSECTED.singleTower) {
			var totalSum =  parseInt(scene.getObjectByName( 'B00' ).value) +
											parseInt(scene.getObjectByName( 'B01' ).value) +
											parseInt(scene.getObjectByName( 'B02' ).value) +
											parseInt(scene.getObjectByName( 'C' ).value) +
											parseInt(scene.getObjectByName( 'A1' ).value) +
											parseInt(scene.getObjectByName( 'A2' ).value) +
											parseInt(scene.getObjectByName( 'A3' ).value) +
											parseInt(scene.getObjectByName( 'A4' ).value) +
											parseInt(scene.getObjectByName( 'A5' ).value) +
											parseInt(scene.getObjectByName( 'A6' ).value);

			// var sectorType = ' All type of </b> sector(s)';
			var sectorType = '';
		} else {
			var totalSum =  parseInt(scene.getObjectByName( 'B-'+towerName+'' ).value) +
											parseInt(scene.getObjectByName( 'C-'+towerName+'' ).value) +
											parseInt(scene.getObjectByName( 'A1-'+towerName+'' ).value) +
											parseInt(scene.getObjectByName( 'A2-'+towerName+'' ).value) +
											parseInt(scene.getObjectByName( 'A3-'+towerName+'' ).value) +
											parseInt(scene.getObjectByName( 'A4-'+towerName+'' ).value) +
											parseInt(scene.getObjectByName( 'A5-'+towerName+'' ).value) +
											parseInt(scene.getObjectByName( 'A6-'+towerName+'' ).value);

			var sectorType = ' in ' + INTERSECTED.sector + '</b> sector(s)';
		}

		if (INTERSECTED.energyType == 'waste') {
			var verb = 'wasted';
			var energyType = '';
		} else {
			var verb = 'used';
			var energyType = INTERSECTED.energyType;
		}

		// console.log('tower index: ',towerName, 'tower total value: ',totalSum); // Helps better understand what tower type is hovered and its sum

		// $('#popup').html('<b>'+INTERSECTED.state+'</b> '+verb+' <b>'+INTERSECTED.value+'</b> Quads of <b>'+energyType+'</b> energy<b>'+sectorType+', out of <b>'+totalSum+'</b> Quads total, in <b>'+INTERSECTED.year+'</b> year<br>Some additional text here<br>Link: <a href="">You cant click this link :D</a>'); //show some data in popup window on intersection
		$('#popup').html('<b>' + stateName + '</b> ' + verb + ' <b>' + INTERSECTED.value + '</b> Quads of <b>' + energyType + '</b> energy<b>' + sectorType + ', out of <b>' + totalSum + '</b> Quads total, in <b>' + INTERSECTED.year + '</b> year<br>Some additional text here<br>Link: <a href="#" onclick="onDocumentClickPopUp(' + INTERSECTED.id + ');">You cant click this link :D</a>'); //show some data in popup window on intersection
		$('#popup').fadeIn(300);
		$('#popup').css('left', '' + popupX + 'px');
		$('#popup').css('top', '' + popupY + 'px');
	} else {
		if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

		INTERSECTED = null;
		$('html,body').css('cursor', 'default');

		for (var i = 0; i < graph.length; i++) {
			graph[i].material.opacity = 0.8;
		}

		if ($( '#popup' ).hasClass('close')) {
			$('#popup').fadeOut(400);            
		} else {
			$('#popup').fadeIn(100);       
		}
	}
}
function rotateGraph(angle) {
  graphSystem.rotation.y = angle;
}

function getMaxValue() {
	var max_value = 0;
	for (var j = 0; j < years.length; j++) {
		filteredData = [];
		var year = years[j];

		for (var i = 0; i < dataByYear[year].length; i++) {
			if (dataByYear[year][i].State == stateId) {
				filteredData.push(dataByYear[year][i]);
			}
		}
		var arr = [];
		for (var i = 0; i < filteredData.length; i++) {
			arr.push(filteredData[i]['11']);
			arr.push(filteredData[i]['12']);
			arr.push(filteredData[i]['13']);
			arr.push(filteredData[i]['21']);
			arr.push(filteredData[i]['22']);
			arr.push(filteredData[i]['23']);
			arr.push(filteredData[i]['31']);
			arr.push(filteredData[i]['32']);
			arr.push(filteredData[i]['33']);
		}
		for (var i = 0; i < arr.length; i++) {
			arr[i] = parseFloat(arr[i]);
		}
		arr.sort(function(a, b) {
			return a - b;
		});

		var scaled_arr = [];
		var hash = {};
		scaled_arr.push(Math.log(arr[0] + 2));
		for (var i = 0; i < arr.length - 1; i++) {
			var diff = Math.log((arr[i + 1] - arr[i]) + 1);
			var last = scaled_arr[scaled_arr.length - 1]
			scaled_arr.push(last + diff);
		}
		for (var i = 0; i < scaled_arr.length; i++) {
			max_value = Math.max(max_value, scaled_arr[i]);
		}
	}
	return max_value;
}

function changeData(year) {
	currentYear = year;
	currentMaxValue = getMaxValue();

	filteredData = [];

	for (var i = 0; i < dataByYear[year].length; i++) {
		if (dataByYear[year][i].State == stateId) {
			filteredData.push(dataByYear[year][i]);
		}
	}

	for (var i = 0; i < 8; i++) {
		layer[i] = [];
	}

	var arr = [];
	for (var i = 0; i < filteredData.length; i++) {
		arr.push(filteredData[i]['11']);
		arr.push(filteredData[i]['12']);
		arr.push(filteredData[i]['13']);
		arr.push(filteredData[i]['21']);
		arr.push(filteredData[i]['22']);
		arr.push(filteredData[i]['23']);
		arr.push(filteredData[i]['31']);
		arr.push(filteredData[i]['32']);
		arr.push(filteredData[i]['33']);
	}
	for (var i = 0; i < arr.length; i++) {
		arr[i] = parseFloat(arr[i]);
	}
	arr.sort(function(a, b) {
		return a - b;
	});

	var scaled_arr = [];
	var hash = {};
	scaled_arr.push(Math.log(arr[0] + 2));
	for (var i = 0; i < arr.length - 1; i++) {
		var diff = Math.log((arr[i + 1] - arr[i]) + 1);
		var last = scaled_arr[scaled_arr.length - 1]
		scaled_arr.push(last + diff);
	}
	for (var i = 0; i < scaled_arr.length; i++) {
		scaled_arr[i] = scaled_arr[i] / currentMaxValue * 10;
	}
	for (var i = 0; i < arr.length; i++) {
		hash[arr[i]] = scaled_arr[i];
	}
	
	for (var i = 0; i < filteredData.length; i++) {
		fillGraph( filteredData[i].Type, filteredData[i], i, hash );
	}

	updateGraphVisually();

	// updateChart();
}

function fillGraph(name,dataSet,layerNumber, hash) {
	layer[layerNumber].name = name; //assigning layer name

	var correctionValue = 2; // any dummy positive value otherwise logarithmic scale returns -Infinity

	for (var i = 0; i < 8; i++) {
		heightsGlobal2[i] = [];
	}

	if (name == 'B') {
		var object00 = scene.getObjectByName( 'B00' );
		var rawValue2 = parseInt(dataSet['11']) + parseInt(dataSet['12']) + parseInt(dataSet['13']);
		object00.value = Math.round(rawValue2);
		object00.state = dataSet.State;
		object00.year = dataSet.Year;
		var visValue2;

		if (rawValue2 < 1) { visValue2 = Math.log(correctionValue) / 5 } else { visValue2 = Math.log(rawValue2) / 5 }

		object00.visValue = visValue2;
		object00.scale.y = visValue2;

		var object01 = scene.getObjectByName( 'B01' );
		var rawValue2 = parseInt(dataSet['21']) + parseInt(dataSet['22']) + parseInt(dataSet['23']);
		object01.value = Math.round(rawValue2);
		object01.state = dataSet.State;
		object01.year = dataSet.Year;
		var visValue2;

		if (rawValue2 < 1) { visValue2 = Math.log(correctionValue) / 5 } else { visValue2 = Math.log(rawValue2) / 5 }

		object01.visValue = visValue2;
		object01.scale.y = visValue2;

		var object02 = scene.getObjectByName( 'B02' );
		var rawValue2 = parseInt(dataSet['31']) + parseInt(dataSet['32']) + parseInt(dataSet['33']);
		object02.value = Math.round(rawValue2);
		object02.state = dataSet.State;
		object02.year = dataSet.Year;
		var visValue2;

		if (rawValue2 < 1) { visValue2 = Math.log(correctionValue) / 5 } else { visValue2 = Math.log(rawValue2) / 5 }

		object02.visValue = visValue2;
		object02.scale.y = visValue2;
	} else {
		var object2 = scene.getObjectByName( name );
		var rawValue2 = parseInt(dataSet['11']) + parseInt(dataSet['12']) + parseInt(dataSet['13']) + parseInt(dataSet['21']) + parseInt(dataSet['22']) + parseInt(dataSet['23']) + parseInt(dataSet['31']) + parseInt(dataSet['32']) + parseInt(dataSet['33']);
		object2.value = Math.round(rawValue2);
		object2.state = dataSet.State;
		object2.year = dataSet.Year;
		var visValue2;

		if (rawValue2 < 1) { visValue2 = Math.log(correctionValue) / 5 } else { visValue2 = Math.log(rawValue2) / 5 }

		object2.visValue = visValue2;
		object2.scale.y = visValue2;
	}

	// heightsGlobal2[layerNumber] = visValue2; // not needed for now

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var firstLetter = i + 1;
			var secondLetter = j + 1;
			var object = scene.getObjectByName( '' + name + '-' + firstLetter + '' + secondLetter + '' );

			if (firstLetter == 1) {
				object.sector = 'Home';
			}

			if (firstLetter == 2) {
				object.sector = 'Business';
			}

			if (firstLetter == 3) {
				object.sector = 'Transport';
			}

			// if (secondLetter == 1) {
			//     object.energyType = 'Coal';
			// }

			// if (secondLetter == 2) {
			//     object.energyType = 'Petroleum';
			// }

			// if (secondLetter == 3) {
			//     object.energyType = 'Natural Gas';
			// }		

			var rawValue = dataSet['' + firstLetter + '' + secondLetter + ''];
			object.value = Math.round(rawValue);
			object.state = dataSet.State;
			object.year = dataSet.Year;

			var visValue;
			visValue = hash[rawValue];
			// if ( rawValue < 1 ) { visValue = Math.log(correctionValue) } else {  }

			layer[layerNumber].push(object);
			object.visValue = visValue;
			object.scale.y = visValue;
		}
	}    
}

function updateGraphVisually() {
	for (var i = 0; i < 3; i++) {
		heightsGlobal[i] = [];
		for (var j = 0; j < 3; j++) {
			heightsGlobal[i][j] = 0;
		}
	}

	for (var i = 0; i < layer.length; i++) {
		if (layer[i].name == 'B') { sortedLayers[0] = layer[i] }
		if (layer[i].name == 'C') { sortedLayers[1] = layer[i] }

		if (layer[i].name == 'A4') { sortedLayers[2] = layer[i] }
		if (layer[i].name == 'A2') { sortedLayers[3] = layer[i] }
		if (layer[i].name == 'A5') { sortedLayers[4] = layer[i] }
		if (layer[i].name == 'A1') { sortedLayers[5] = layer[i] }
		if (layer[i].name == 'A3') { sortedLayers[6] = layer[i] }
		if (layer[i].name == 'A6') { sortedLayers[7] = layer[i] }
	}

	for (var k = 0; k < sortedLayers.length; k++) {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var firstLetter = i + 1;
				var secondLetter = j + 1;

				var object = scene.getObjectByName('' + sortedLayers[k].name + '-' + firstLetter + '' + secondLetter + '');

				if (sortedLayers[k].name == 'B') {
					object.position.y = object.visValue / 2;
					heightsGlobal[i][j] += object.visValue;
				} else {
					object.position.y = object.visValue / 2 + heightsGlobal[i][j];
					heightsGlobal[i][j] += object.visValue;
				}
			}
		}
	}

	var object00 = scene.getObjectByName( 'B00' );
	object00.position.y = object00.visValue / 2;

	var object01 = scene.getObjectByName( 'B01' );
	object01.position.y = object01.visValue / 2 + object00.visValue;

	var object02 = scene.getObjectByName( 'B02' );
	object02.position.y = object02.visValue / 2 + object00.visValue + object01.visValue;

	var object2 = scene.getObjectByName( 'C' );
	object2.position.y = object2.visValue / 2 + object00.visValue + object01.visValue + object02.visValue;

	var object3 = scene.getObjectByName( 'A4' );
	object3.position.y = object3.visValue / 2 + object00.visValue + object01.visValue + object02.visValue + object2.visValue;

	var object4 = scene.getObjectByName( 'A2' );
	object4.position.y = object4.visValue / 2 + object00.visValue + object01.visValue + object02.visValue + object2.visValue + object3.visValue;

	var object5 = scene.getObjectByName( 'A5' );
	object5.position.y = object5.visValue / 2 + object00.visValue + object01.visValue + object02.visValue + object2.visValue + object3.visValue + object4.visValue;

	var object6 = scene.getObjectByName( 'A1' );
	object6.position.y = object6.visValue / 2 + object00.visValue + object01.visValue + object02.visValue + object2.visValue + object3.visValue + object4.visValue + object5.visValue;

	var object7 = scene.getObjectByName( 'A3' );
	object7.position.y = object7.visValue / 2 + object00.visValue + object01.visValue + object02.visValue + object2.visValue + object3.visValue + object4.visValue + object5.visValue + object6.visValue;

	var object8 = scene.getObjectByName( 'A6' );
	object8.position.y = object8.visValue / 2 + object00.visValue + object01.visValue + object02.visValue + object2.visValue + object3.visValue + object4.visValue + object5.visValue + object6.visValue + object7.visValue;

}

// function updateChart() {

//     dataD.datasets[0].data[0] = Math.random()*20;

//     dataD.datasets[0].data[1] = Math.random()*20;

//     dataD.datasets[0].data[2] = Math.random()*20;
//     dataD.datasets[0].data[3] = Math.random()*20;
//     dataD.datasets[0].data[4] = Math.random()*10;
//     dataD.datasets[0].data[5] = Math.random()*10;


//     myDoughnutChart.update();
// }
function makeFlat(){
	scene.getObjectByName( 'B00' ).scale.z = 0.01;
	scene.getObjectByName( 'B01' ).scale.z = 0.01;
	scene.getObjectByName( 'B02' ).scale.z = 0.01;
	scene.getObjectByName( 'C' ).scale.z = 0.01;
	scene.getObjectByName( 'A4' ).scale.z = 0.01;
	scene.getObjectByName( 'A2' ).scale.z = 0.01;
	scene.getObjectByName( 'A5' ).scale.z = 0.01;
	scene.getObjectByName( 'A1' ).scale.z = 0.01;
	scene.getObjectByName( 'A3' ).scale.z = 0.01;
	scene.getObjectByName( 'A6' ).scale.z = 0.01;
}
function makeFat(){
	scene.getObjectByName( 'B00' ).scale.z = 1;
	scene.getObjectByName( 'B01' ).scale.z = 1;
	scene.getObjectByName( 'B02' ).scale.z = 1;
	scene.getObjectByName( 'C' ).scale.z = 1;
	scene.getObjectByName( 'A4' ).scale.z = 1;
	scene.getObjectByName( 'A2' ).scale.z = 1;
	scene.getObjectByName( 'A5' ).scale.z = 1;
	scene.getObjectByName( 'A1' ).scale.z = 1;
	scene.getObjectByName( 'A3' ).scale.z = 1;
	scene.getObjectByName( 'A6' ).scale.z = 1;
}
$('.mdl-radio__button').click(function() {
	var value = $(this).attr('value');

	if (value == '1') {
		rotateGraph(Math.PI);
		makeFat();
		cameraControls.enabled = true;
		cameraTarget = new THREE.Vector3(0, 30, 0);
	}
	if (value == '2') {
		rotateGraph(0);
		makeFat();
		cameraControls.enabled = true;
		cameraTarget = new THREE.Vector3(0, 10, 0);
	}
	if (value == '3') {
		rotateGraph(0);
		cameraControls.reset();
		cameraControls.enabled = false;
		makeFlat();
		cameraTarget = new THREE.Vector3(0, 20, 0);
	}
});

$('#popup').hover(function() {
  $('#popup').removeClass('close');
});

$( '#popup' ).mouseleave(function() {
  $('#popup').addClass('close');
});

$('.filter-item').click(function() {
	var clickedId = $(this).attr('id');

	if ($(this).hasClass('on')) {
		$(this).removeClass('on');
		$(this).addClass('off');

		for (var i = graph.length - 1; i >= 0; i--) {
			if (graph[i].energyType == clickedId) {
				graph[i].visible = false;
			}
		}
	} else {
		$(this).removeClass('off');
		$(this).addClass('on');

		for (var i = graph.length - 1; i >= 0; i--) {
			if (graph[i].energyType == clickedId) {
				graph[i].visible = true;
			}
		}
	}
});

$('.filter-item2').click(function() {
	var clickedId = $(this).attr('id');

	if ($(this).hasClass('on')) {
		$(this).removeClass('on');
		$(this).addClass('off');

		for (var i = graph.length - 1; i >= 0; i--) {
			if ((graph[i].name.slice(-3) == '-1' + clickedId || graph[i].name.slice(-3) == '-2' + clickedId || graph[i].name.slice(-3) == '-3' + clickedId)) {
				graph[i].visible = false;
			}
		}
	} else {
		$(this).removeClass('off');
		$(this).addClass('on');

		for (var i = graph.length - 1; i >= 0; i--) {
			if ((graph[i].name.slice(-3) == '-1' + clickedId || graph[i].name.slice(-3) == '-2' + clickedId || graph[i].name.slice(-3) == '-3' + clickedId)) {
				graph[i].visible = true;
			}
		}
	}
});

simplemaps_usmap.hooks.click_state = function(id) {
	stateId = id;
	stateName = simplemaps_usmap_mapdata.state_specific[id].name;
	changeData(currentYear);
}

function onDocumentClickPopUp(id) {
	var raycaster = new THREE.Raycaster();

	function raycast(camera, items, type) {
		var listener = function (event) {
			var vector = new THREE.Vector3();

			var mouse = {
				x:  ((event.clientX - (window.innerWidth - 800) / 2 -1) / 760 ) * 2 - 1,
				y: -((event.clientY - 170 - 1) / 460) * 2 + 1
			};

			vector.set(mouse.x, mouse.y , 0.5);
			vector.unproject(camera);

			raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

			var target = raycaster.intersectObjects(items);

			if (target.length) {
				target[0].type = type;
				target[0].object.dispatchEvent(target[0]);
			}
		};

		document.addEventListener(type, listener, false);
	}	

	var boxes = [];
	var cells = [];
	var mouse = new THREE.Vector2();
	var treeMapElementToDraw = document.getElementById("grayMapBody");
	var canvas = d3.select(treeMapElementToDraw).append("canvas")
			.style("opacity", 0)
			.style('background-color', '#EAEAEA');

	canvas.node().getContext("webgl").globalCompositeOperation = 'destination-over';
	var renderer = new THREE.WebGLRenderer({ canvas: canvas.node(), antialias: true });
	renderer.setSize(760, 460);
	treeMapElementToDraw.appendChild(renderer.domElement);

	var camera = new THREE.PerspectiveCamera(30, 760 / 460, 1, 7000);
	camera.position.z = 2000;
	camera.position.y = -8500;

	var scene = new THREE.Scene();

	var light = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);
	light.position.set(0, 3000, 0);
	scene.add(light);

	window.addEventListener('resize', onWindowResize, false);

	function onWindowResize() {
		camera.aspect = 760 / 460;
		camera.updateProjectionMatrix();
		renderer.setSize(760, 460);
	}

	var carpet = THREE.ImageUtils.loadTexture('img/carpet.jpg', null, function () {
		canvas.transition().duration(2000).style("opacity", 1);
		d3.select("#loading").transition().duration(2000).style("opacity", 0).remove();
	});

	id = 1;

	d3.json('data/' + id + '.json', function (err, data) {
			var _width = 1000;
			var _height = 1000;
			var _depth = 1000;

			var treemap = d3.layout.treemap()
					.size([_width, _height])
					.value(function (d) {
						return d["size"];
					});

			var sumx = [];
			var sumy = [];
			var maxe = 0;

			for (var i = 0; i < data.xn; i++) {
				for (var j = 0; j < data.yn; j++) {
					maxe = Math.max(maxe, data.e[i][j])
				}
			}
			for (var i = 0; i < data.xn; i++) {
				if (i == 0) sumx[i] = 0;
				else sumx[i] = sumx[i - 1] + data.xi[i - 1];
			}
			sumx[data.xn] = sumx[data.xn - 1] + data.xi[data.xn - 1];
			for (var i = 0; i < data.yn; i++) {
				if (i == 0) sumy[i] = 0;
				else sumy[i] = sumy[i - 1] + data.yi[i - 1];
			}
			sumy[data.yn] = sumy[data.yn - 1] + data.yi[data.yn - 1];
			for (var i = 0; i < data.xn; i++) {
				for (var j = 0; j < data.yn; j++) {
					boxes.push({
						w: data.xi[i] * _width / sumx[data.xn],
						h: data.yi[j] * _height / sumy[data.yn],
						depth: data.e[i][j] * _depth / maxe,
						x: sumx[i] * _width / sumx[data.xn],
						y: sumy[j] * _height / sumy[data.yn],
						id: i + j * data.xn + 1,
					});
				}
			}
			var size = [_width, _height] // Width, Height
			var cscale = d3.scale.category10();

			var color1 = new THREE.MeshPhongMaterial({ color: '#ff0000' });
			var backing = new THREE.BoxGeometry(size[0], size[1], 100);

			var root = SubUnit.select(scene);
			var container = root.append("object");

			var xAxis = 0, yAxis = 0;
			$(document).on('mousemove', function (event) {
				xAxis = event.clientX;     // Get the horizontal coordinate
				yAxis = event.clientY;
			})
			var someValue = 1;
			function timeFrame() {					
				var prevVal = $("#checkchange").val() !== undefined ? $("#checkchange").val() : null;
				if (prevVal == someValue) {
					$('#popup').fadeOut(300);
				} else {
					someValue = prevVal;
				}
			}
			var _myInterval = setInterval(function () {
				timeFrame();
			}, 1000)

			var cells = container.selectAll("cell")
													.data(boxes).enter()
													.append("mesh")
													.attr("tags", "bar")
													.attr("material", function (d) {
															// d.baseMaterial = new THREE.MeshPhongMaterial({color: cscale(d.id), shininess: 100});
															d.baseMaterial = new THREE.MeshPhongMaterial({ color: '#BBBBBB' });
															return d.baseMaterial;
													})
													.attr("geometry", function (d) {
															// var w = Math.max(0, d.dx-1);
															// var h = Math.max(0, d.dy-1);
															return new THREE.BoxGeometry(d.w, d.h, d.depth);
													})
													.each(function (d, i) {
															var x0 = d.x + (d.w / 2) - _width / 2;
															var y0 = d.y + (d.h / 2) - _height / 2;
															var z0 = d.depth / 2;
															this.position.set(x0, y0, z0);
													})
													.on('click', function (event, d) {
															d3.select("#msg").html("id: " + d.id);
															// d3.select('#popup').html("id: " + d.id);
															if (this.material === color1) {
																	this.material = d.baseMaterial;
															} else {
																	this.material = color1;
															}
													})
													.on('mousemove', function (event, d) {
															mouse.x = (xAxis / 760) * 2 - 1;
															mouse.y = -(yAxis / 460) * 2 + 1;
															var popupY = yAxis;
															$('#popup').html('<b>ID: </b>' + d.id); //show some data in popup window on intersection
															$('#popup').fadeIn(300);
															$('#popup').css('left', '' + xAxis + 'px');
															$('#popup').css('top', '' + popupY + 'px');
															$("#checkchange").val(d.id);
													});

			camera.position.z = 2500;

			raycast(camera, d3.merge(cells), 'click');
			raycast(camera, d3.merge(cells), 'mousemove');

			var cntrl = new THREE.TrackballControls(camera, renderer.domElement);
			cntrl.rotateSpeed = 2.0;
			cntrl.minDistance = 100;
			cntrl.maxDistance = 6000;

			function animate() {
				cntrl.update();
				TWEEN.update();
				requestAnimationFrame(animate);
				renderer.render(scene, camera);
			}

			animate();
	});

	var modal = document.getElementById('treeMapPopUp');
	modal.style.display = "block";
}

function formTreeMapDataForCube(cubeName) {
	cubeJsonFile = 'data/' + cubeName + '.json';
	$("#grayMapBody").html('');
	createMapTreeGraphForSpecificCube(cubeJsonFile);
}

/*
* 
* Close PopUp
* 
*/
function closePopUp() {
	$("#grayMapBody").html('');
	var modal = document.getElementById('treeMapPopUp');
	modal.style.display = "none";
}