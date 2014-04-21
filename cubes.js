randcolor = function() {
  var r = Math.random();
  return r * 0xffffff;
}
green = function() { return 0x00ff00; }
blue = function() { return 0x0000ff; }
red = function() { return 0xff0000; }
lightGroup = function(m) {
  return [[m,0,0], [0,m,0], [0,0,m], [-m,0,0], [0,-m,0], [0,0,-m]];
}
lightSingle = function(m) { return [m * 5, 0, 0]; }


//// Cubes
initCubes = function(n, dilation, lights, color) {
  return function(scene, camera, renderer) {

    var geometry = new THREE.CubeGeometry(1,1,1);

    normalizePos = function(xyz) {
      return [ (xyz[0] - n/2 + 1/2) * dilation
             , (xyz[1] - n/2 + 1/2) * dilation
             , (xyz[2] - n/2 + 1/2) * dilation
             ];
    }

    makeCube = function(i) {
      var material = new THREE.MeshLambertMaterial( { color: color() } );
      var cube = new THREE.Mesh( geometry, material );

      var z = Math.floor(i / (n*n));
      var y = Math.floor(i / n) % n;
      var x = i % n;
      var xyz = normalizePos([x,y,z]);

      var isEdge = function(x) {
        return x == 0 || x == n-1;
      }
      if (! (isEdge(x) || isEdge(y) || isEdge(z))) {
        return undefined;
      } else {
        scene.add(cube);
        cube.position.set(xyz[0],xyz[1],xyz[2]);
        return cube;
      }
    }

    // Make the Cubes

    // some makeCube calls will return undefined
    makeCubes = function() {
      return _.filter(_.map(_.range(n*n*n), makeCube), function(x) { return x; })
    }

    //// Camera
    makeCamera = function() {
      camera.position.z = 11;
      controls = new THREE.OrbitControls( camera, renderer.domElement );
    }

    //// Light
    addLight = function (xyz) {
      var xyz = normalizePos(xyz);
      var light = new THREE.PointLight(0x888888);
      light.position.set(xyz[0], xyz[1], xyz[2]);
      scene.add(light);
    }

    addLights = function(lights) {
      var m = n * 1.5;
      _.each(lights(m), addLight);
      //addLight([ n*10,0,0]);
      addLight([-n*10,0,0]);
    }


    var cubes = makeCubes();
    makeCamera();
    addLights(lights);

    return cubes;
  }
}

renderCubes = function(cubes) {
  _.each(cubes, function(cube) {
    var r = Math.random();

    cube.rotation.x += r * 0.06;
    cube.rotation.y += r * 0.06;
  });
}



initGL = function(initFn, renderFn) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var data = initFn(scene, camera, renderer);

  var render = function() {
    requestAnimationFrame(render);

    renderFn(data);

    renderer.render(scene, camera);
  }

  render();
}

