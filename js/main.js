var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('renderCanvas'), antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.z = 1000;

var scene = new THREE.Scene();

//LIGHTS
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 0.5);
scene.add(pointLight);

//BOX
var boxGeo = new THREE.BoxGeometry(200, 400, 50);
var boxMat = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	transparent: true,
	opacity: 0.2,
	roughness: 0.5,
	metalness: 0
});
var box = new THREE.Mesh(boxGeo, boxMat);
scene.add(box);

//WIREFRAME
var wireGeo = new THREE.EdgesGeometry(boxGeo);
var wireMat = new THREE.LineBasicMaterial({
	color: 0xffffff,
	linewidth: 1
});
var wireframe = new THREE.LineSegments(wireGeo, wireMat);
box.add(wireframe);

//JOURNAL OBJECT
var journal = {
	day01: {
		url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Billet_Breitlauenen_Wilderswil_%28Edmondsonsche_Fahrkarte%29.jpg',
		txt: 'Schuetzenstrasse 70, bitte.',
		date: 'March 3, 2018'
	},
	day02: {
		url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Berliner-Dom-1905.jpg',
		txt: 'In Berlin zu Hause.',
		date: 'July 17, 2018'
	}
};

var date = document.getElementById('date');
date.innerText = journal.day01.date;

//ITEM
var url = journal.day01.url;
itemGenerate();
function itemGenerate() {
	var itemGeo = new THREE.BoxGeometry(100, 100, 4);
	var loader = new THREE.TextureLoader();
	var itemMat = new THREE.MeshBasicMaterial({
		map: loader.load(url),
		side: THREE.DoubleSide
	});
	var item = new THREE.Mesh(itemGeo, itemMat);
	item.position.y = 30;
	item.position.z = -2;
	box.add(item);
};

//TEXT
var loader = new THREE.FontLoader();
var txt = journal.day01.txt;
textGenerate();
function textGenerate() {
	loader.load('js/helvetiker_regular.typeface.json', function(font) {
		var textGeo = new THREE.TextGeometry(txt, {
			font: font,
			size: 8,
			height: 1,
			curveSegments: 12
		});
		var textMat = new THREE.MeshLambertMaterial({
			color: 0xffffff
		});
		var text = new THREE.Mesh(textGeo, textMat);
		text.position.x = -80;
		text.position.y = -80;
		text.position.z = 24.5;
		box.add(text);
	});
};

//COMPOSER
var composer = new THREE.EffectComposer(renderer);

//PASSES
var renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

var effectFilm = new THREE.FilmPass(1, 0.05, 256, false);
composer.addPass(effectFilm);

var effectGlitch = new THREE.GlitchPass(3000);
composer.addPass(effectGlitch);
effectGlitch.renderToScreen = true;

//EVENT
var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

domEvents.addEventListener(box, 'click', function() {
	if (txt == journal.day01.txt) {
		txt = journal.day02.txt;
		box.remove(box.children[2]);
		textGenerate();
		url = journal.day02.url;
		box.remove(box.children[1]);
		itemGenerate();
		date.innerText = journal.day02.date;
	} else {
		txt = journal.day01.txt;
		box.remove(box.children[2]);
		textGenerate();
		url = journal.day01.url;
		box.remove(box.children[1]);
		itemGenerate();
		date.innerText = journal.day01.date;
	};
});

//RENDER LOOP
render();

function render() {
	box.rotation.y += 0.01;
	composer.render();
	requestAnimationFrame(render);
};