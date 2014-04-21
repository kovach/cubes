//// Scene Stuff
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//// Cubes
// Parameters/Util
var n = 6;
var geometry = new THREE.CubeGeometry(1,1,1);

normalizePos = function(xyz) {
  return [ (xyz[0] - n/2) * 0.7
         , (xyz[1] - n/2) * 0.7
         , (xyz[2] - n/2) * 0.7
         ];
}

makeCube = function(i) {
  var r = Math.random();
  var color = r * 0xffffff;
  var green = 0x00ff00;
  var material = new THREE.MeshLambertMaterial( { color: green } );
  return new THREE.Mesh( geometry, material );
}

addCube = function(cube, i) {
    scene.add(cube);

    var z = Math.floor(i / (n*n));
    var y = Math.floor(i / n) % n;
    var x = i % n;
    var xyz = normalizePos([x,y,z]);
    cube.position.set(xyz[0],xyz[1],xyz[2]);
}

// Make the Cubes
cubes = _.map(_.range(n*n*n), makeCube);
_.each(cubes, addCube);

//// Camera
camera.position.z = 22;
controls = new THREE.OrbitControls( camera, renderer.domElement );

//// Light
addLight = function (xyz) {
  var xyz = normalizePos(xyz);
  var light = new THREE.PointLight(0x888888);
  light.position.set(xyz[0], xyz[1], xyz[2]);
  scene.add(light);
}

var m = n * 1.5;
_.each([[m,0,0], [0,m,0], [0,0,m], [-m,0,0], [0,-m,0], [0,0,-m]], addLight);
//addLight([ n*10,0,0]);
//addLight([-n*10,0,0]);


function render() {
  requestAnimationFrame(render);

  _.each(cubes, function(cube) {

      var r = Math.random();

      cube.rotation.x += r * 0.1;
      cube.rotation.y += r * 0.1;
      });

  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals(); 

  renderer.render(scene, camera);
}
render();
