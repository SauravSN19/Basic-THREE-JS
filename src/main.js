import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap'
const canvas = document.querySelector('.webgl');


const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const grassTexture = textureLoader.load('/static/field.jpg');
const skytexture = textureLoader.load('/static/sky.jpg'); 
const orgblos= textureLoader.load('/static/original.jpg')
const woodtexture=textureLoader.load('/static/wood.jpeg')
const flower= textureLoader.load('/static/petel.jpg')
const original= textureLoader.load('/static/alpha.jpg')
const matcap2= textureLoader.load('/static/matcap2.jpg')



grassTexture.wrapS=THREE.RepeatWrapping
grassTexture.wrapT=THREE.RepeatWrapping
grassTexture.repeat.set(10,10)
grassTexture.magFilter=THREE.NearestFilter
woodtexture.wrapS=THREE.RepeatWrapping
woodtexture.wrapS=THREE.RepeatWrapping
woodtexture.repeat.set(10,10)




const scene = new THREE.Scene();

const fontLoader = new FontLoader();

fontLoader.load(
'node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
  (font)=>{
 const textGeo = new TextGeometry(
  'THREE . JS',
  {
    font:font,
    size:3,
    height:8,
    depth:0.2,
    curveSegments:12,
    bevelEnabled:true,
    bevelThickness:0.03,
    bevelSize:0.02,
  
    bevelSegments:5

  }

 )
 const textMaterial= new THREE.MeshMatcapMaterial({matcap:matcap2,color:0xffc0c0,side:THREE.DoubleSide})
 const textMesh= new THREE.Mesh(textGeo,textMaterial)

 textMesh.position.set(-0.5, 0.2, 0); // Ensure equal scaling on x, y, z axes
 scene.add(textMesh)
  }

)


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
// const axishelper = new THREE.AxesHelper()
// scene.add(axishelper)
  
///field//

const fieldGeometry = new THREE.PlaneGeometry(180,180)
const fieldMaterial = new THREE.MeshBasicMaterial({map:grassTexture})

const mesh = new THREE.Mesh(fieldGeometry,fieldMaterial)
mesh.rotation.x=(-Math.PI/2)
scene.add(mesh)


//sky//

const skyGeometry=new THREE.SphereGeometry(100,20,20)
const skyMaterial = new THREE.MeshBasicMaterial({map:skytexture, side:THREE.BackSide})
const skyMesh = new THREE.Mesh(skyGeometry,skyMaterial)


skyMesh.rotation.y=-0.5
scene.add(skyMesh)

//branch
const branchGeometry = new THREE.CylinderGeometry(1,2,14,32)
const branchMaterial= new THREE.MeshBasicMaterial({map:woodtexture})
const branchMesh= new THREE.Mesh(branchGeometry,branchMaterial)
branchMesh.position.set(-3,1,0)
scene.add(branchMesh)

const leaveGroup = new THREE.Group();
const leaveMaterial = new THREE.MeshBasicMaterial({ map: orgblos });


const configs = [
  { radiusRange: [0.4, 0.9], xRange: [-4,-5], yRange: [7, 3] ,zRange:[4,-8]},
  { radiusRange: [0.4,0.9], xRange: [2,-6], yRange: [7, 3],zRange:[4,-8] },
  { radiusRange: [1,1.4], xRange: [3,-6], yRange: [9,5] ,zRange:[5,-10]},
  { radiusRange: [1,1.2], xRange: [-4, -6], yRange: [10, 6],zRange:[5,-10] }
];

configs.forEach(config => {
  for (let i = 0; i <80; i++) {
    const radius = Math.random() * config.radiusRange[1] + config.radiusRange[0];
    const leavegeo = new THREE.SphereGeometry(radius, 16, 16);
    const lmesh = new THREE.Mesh(leavegeo, leaveMaterial);

    const x = (Math.random() * config.xRange[1] + config.xRange[0]);
    const y = Math.random() * config.yRange[1] + config.yRange[0];
    const z = Math.random() * config.zRange[1] + config.zRange[0];

    lmesh.position.set(x, y, z);
    leaveGroup.add(lmesh);
  }
});

scene.add(leaveGroup);

//flower

const leafconfig=[
  {x:1,y:8,z:1},
  {x:1.5,y:15,z:3},
  {x:0,y:9,z:-1},
  {x:2,y:12,z:3.5},
  {x:1.5,y:8,z:0},
  {x:1.3,y:10,z:3},
  {x:2.1,y:12.5,z:4},
  {x:2.2,y:11,z:4.5},
  {x:1.1,y:8,z:3},
  {x:2.5,y:10,z:4},
  {x:1,y:8,z:1},
  {x:1.5,y:15,z:3},
  {x:0,y:9,z:-1},
  {x:2,y:12,z:3.5},
  {x:1.5,y:8,z:0},
  {x:1.3,y:10,z:3},
  {x:2.1,y:12.5,z:4},
  {x:2.2,y:11,z:4.5},
  {x:1.1,y:8,z:3},
  {x:2.5,y:10,z:4},
]

//animation leaf
 function animationleaf(flowerMesh,leafconfig){
  gsap.to(flowerMesh.position,{
    y:1,
    x:leafconfig.x+(Math.random()*15),
    z:leafconfig.z+(Math.random()*5-5),
    duration:Math.random()*3+3,
    ease:"linear",
    onComplete:()=>{
      flowerMesh.position.set(leafconfig.x,leafconfig.y,leafconfig.z)
      animationleaf(flowerMesh,leafconfig)
    }
  
  });
  gsap.timeline()
    .to(flowerMesh.rotation, {
      y: Math.PI ,
      duration:Math.random()*2+1, 
      ease: "power2.out",
    })
    .to(flowerMesh.rotation, {
      y: 0, 
      duration: Math.random()*2+1, 
      ease: "none",
    });

 }

for(let i=0;i<20;i++){
  const flowerGeometry= new THREE.PlaneGeometry(1,1)
const flowerMaterial= new THREE.MeshBasicMaterial({map:flower,
  transparent:true,
  alphaMap:original,
  side:THREE.DoubleSide,
 opacity:Math.random()*1+0.5
})

const flowerMesh=new THREE.Mesh(flowerGeometry,flowerMaterial)
flowerMesh.position.set(leafconfig[i].x,leafconfig[i].y,leafconfig[i].z)
scene.add(flowerMesh)
animationleaf(flowerMesh,leafconfig[i])
}


// Camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height ,0.1,1000);
camera.position.set(0,6,70)//6/70
camera.lookAt(0,0,0)

scene.add(camera);

//fog
scene.fog=new THREE.FogExp2(0xffffff ,0.01)



//orbit
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Responsive Window Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera Aspect Ratio
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});




const tick=()=>{
    if(camera.position.y<0.5){
        camera.position.y=0.8
    }
    camera.position.z=Math.min(camera.position.z,70)
    camera.position.y=Math.min(camera.position.y,10)
    camera.position.x=Math.min(camera.position.x,70)
    camera.position.z=Math.max(camera.position.z,-70)
    camera.position.x=Math.max(camera.position.x,-70)
    
  controls.update(); 
  renderer.render(scene, camera); 
  window.requestAnimationFrame(tick); 
};

tick();

