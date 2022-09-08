

/**
 * 
 * @author Shauna Lynch 
 * 
 * Copyright <2022> <Shauna Lynch>
 * visit https://www.lynchbyte.com/12_tictacwoe/license_tic_tac_woe for MIT and CC license details
 * 
**/



import {

    AmbientLight,
    AnimationClip,
    AnimationMixer,
    AnimationObjectGroup,
    BoxBufferGeometry,
    BoxGeometry,
    BufferAttribute,
    BufferGeometry,
    Clock,
    Color,
    CylinderGeometry,
    DirectionalLight,
    DoubleSide,
    ExtrudeGeometry,
    Float32BufferAttribute,
    Group,
    InstancedMesh,
    Line,
    LineBasicMaterial,
    LineCurve3,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    NormalBlending,
    PerspectiveCamera,
    PlaneGeometry,
    Quaternion,
    QuaternionKeyframeTrack,
    Raycaster,
    RingGeometry,
    Scene,
    ShaderMaterial,
    Shape,
    SphereGeometry,
    sRGBEncoding,
    TextureLoader,
    TorusGeometry,
    TubeBufferGeometry,
    Uint16BufferAttribute,
    Vector2,
    Vector3,
    VectorKeyframeTrack,
    WebGLRenderer

} from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import { Player } from './addPlayers.js';

import { slp , sgobn} from './gameHelpers.js';

import { makeWinCombos } from './addWinCombos.js';

import { Board } from './addBoard.js';

import { modeChange } from './gameMode.js';

import { onMouseMove, onMouseClick, intObjects, cleanIntersected, requestHitTestSource, getHitTestResults } from './gameSelect.js';

import { addCross } from './addCross.js';

import { newSphere } from './addSphere.js';

import { takeCorner } from './gameP2Move.js';



//Load Shaders
//Game Over Shader
const resultV_go = await fetch('m/sh/go/vert.glsl');
export const vertsh_go = await resultV_go.text();
const resultF_go = await fetch('media/sh/go/frag.glsl');
export const fragsh_go = await resultF_go.text();

//Floor Shader
const resultV_fl = await fetch('m/sh/fl/vert.glsl');
export const vertsh_fl = await resultV_fl.text();
const resultF_fl = await fetch('m/sh/fl/frag.glsl');
export const fragsh_fl = await resultF_fl.text();

//Sphere Shader
const resultV_sp = await fetch('m/sh/sph/vert.glsl');
export const vertsh_sp = await resultV_sp.text();
const resultF_sp = await fetch('m/sh/sph/frag.glsl');
export const fragsh_sp = await resultF_sp.text();

//container for Game Over particles
export const winArr = [];

//Load texture picture
export const txLoader = new TextureLoader();
export const picAll = 'm/all_ui_22.webp';
export const texture = txLoader.load(picAll);
//texture.minfilter = LinearMipMapLinearFilter;  //The default is LinearMipmapLinearFilter
//texture.magFilter = NearestFilter;   //default is LinearFilter,
export const imgNum = 22;

//array for landing page tiles, popoulated at gameMode BB, used at rendertime
export const lpArr = [];
export const mixArr = [];

//if plane is able to be selected
export const clickable = [];

export const world = [];

/**
 * gmCzar
 * Holds the different modes of the game
 */
export const gameMaster = {

    gmMode: [

        'AA',//landing page
        'BB',//show desktop, query and show  vr or ar ?
        'CC',//shows goes first tiles
        'DD',//start desktop
        'EE',//start VR
        'FF',//start AR
        'GG',//win time, when a player has won
        'HH',//show exit & replay planes
        'II',//show draw time, pause then go to HH

    ]

}


export const gmPlayz = {

    currentPlayer: 1,
    uiTime: true,
    gameOver: false,
    ARtime: false,
    Extreme: false,
    mode: 'DT', //'DT', 'VR', 'AR',
    level: 1, ///updated at gameOverClean up

}

export const gmBoard = {

    boardGrp: new Group(),
    // level: 1,
    edgeQty: 3, // (level + 2)
    count: Math.pow(3, 3), //for instanced mesh, (edgeQty, 3)
    offset: (3 - 1) / 2,  //half the dimension of the board, for locating nodes & sticks instanced mesh, (edgeQty - 1)/2

    matNode: new MeshStandardMaterial({ color: new Color(0x14141f), transparent: true }),

    nodesArr: [],
    sticksArr: [],

    nodeSize: 0.1,
    stickLength: 0.8,
    stickDia: 0.01,
    stickCol: 0x000000,

}

export const Player1_Ob = {

    p1ClkClndMeshArr: [], //repository for nodes clicked for P1, immutable
    geoP1: new TorusGeometry(0.19, 0.1, 16, 100),//radius, tube, radialSegments, tubularSegments, arc 
    colP1: new Color(0x4b1207), //Black Bean Red;
    p1ClkClndMeshNameArr: [],//copy of ply1Arr, used in 'check', over written
    winsTotalP1: []

}

export const Player2_Ob = {

    p2ClkClndMeshArr: [],  //repository for nodes clicked for P2
    geoP2: addCross(),
    colP2: new Color(0x2e331f), //Pine Tree Green
    p2ClkClndMeshNameArr: [],//copy of ply2Arr, used in 'check', over written
    winsTotalP2: []

}


/**
 * array for winnining combinations
 */
export const winsTotal = [];


/**
 * sound engine
 * https://codepen.io/KilledByAPixel/pen/BaowKzv KilledByAPixel
 */
const zzfxV = .3; // volume
export const zzfx =    // play sound
    (I = 1, J = .05, g = 220, f = 0, h = 0, m = .1, n = 0, K = 1, r = 0, A = 0, t = 0, B = 0, u = 0, C = 0, v = 0, L = 0, e = 0, d = 2 * Math.PI, b = 44100, w = p => 2 * p * Math.random() - p, x = p => 0 < p ? 1 : -1, M = r *= 500 * d / b ** 2, D = g *= (1 + w(J)) * d / b, N = x(v) * d / 4, q = [], E = 0, F = 0, c = 0, k = 1, G = 0, H = 0, a = 0, l, y, z = zzfxX.createBufferSource()) => { f = 50 + f * b | 0; h = h * b | 0; m = m * b | 0; e = e * b | 0; A *= 500 * d / b ** 3; l = f + h + m + e; v *= d / b; t *= d / b; B *= b; for (u *= b; c < l; q[c++] = a)++H > 100 * L && (H = 0, a = E * g * Math.sin(F * v - N), a = n ? 1 < n ? 2 < n ? 3 < n ? x(Math.sin((a % d) ** 3)) : Math.max(Math.min(Math.tan(a), 1), -1) : 1 - (2 * a / d % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(a / d) - a / d) : Math.sin(a), a = x(a) * Math.abs(a) ** K, a *= I * zzfxV * (c < f ? c / f : c < f + h ? 1 : c < l - e ? 1 - (c - f - h) / m : 0), a = e ? a / 2 + (e > c ? 0 : (c < l - e ? 1 : (c - l) / e) * q[c - e] / 2) : a), E += 1 + w(C), F += 1 + w(C), g += r += A, k && ++k > B && (D += t, g += t, k = 0), u && ++G > u && (g = D, r = M, G = 1, k = k || 1); y = zzfxX.createBuffer(1, q.length, b); y.getChannelData(0).set(q); z.buffer = y; z.connect(zzfxX.destination); z.start() };
const zzfxX = new AudioContext;


//Clock
export const clock = new Clock();

//Scene
export const scene = new Scene();
scene.background = new Color(0xc1c2c3);

export let fov
//if phone , portrait
if (window.innerWidth < window.innerHeight) {
    fov = 100
}

//if desktop, landscape
else {

    fov = 70
}

//Camera
export const camera = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.01, 20);
scene.add(camera);

//Lights
const ambientLight = new AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

export const directionalLight = new DirectionalLight(0xffffff, 0.65);
directionalLight.position.set(0.75, 0.75, 1.0).normalize();
//directional light added at cleanUP G_F

newSphere();

export const player1 = new Player(Player1_Ob.geoP1, Player1_Ob.colP1, `Player1Mesh`);
export const player2 = new Player(Player2_Ob.geoP2, Player2_Ob.colP2, `Player2Mesh`);

//Stat Brd 
texture.offset.set(1 / imgNum * 2, 0);//1/imageNum * imagePlace,
texture.repeat.set(1 / imgNum, 1);
const statBrdMat = new MeshBasicMaterial({ map: texture, side: 2, transparent: true, });//
const statBrdPlane = new PlaneGeometry(1, 1, 32, 32);
export const statBrd = new Mesh(statBrdPlane, statBrdMat);

statBrd.position.set(-3, 1.10, 0.002);
statBrd.name = `Stat Brd`;

export const uiPlane = new Mesh(new PlaneGeometry(0.011, 0.011), new MeshBasicMaterial({
    transparent: true,
    opacity: 0
}));
uiPlane.position.set(0, 0, -4.1);


//Renderer
export const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true //do not delete, used for AR
});
renderer.setPixelRatio(Math.max(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.outputEncoding = sRGBEncoding;
document.body.appendChild(renderer.domElement);

export const ctr1 = renderer.xr.getController(0);
export const ctr2 = renderer.xr.getController(1);


export const hitOb = {

    hitTestSource: null,
    hitTestSourceRequested: false

}

export const reticle = new Mesh(

    new RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
    new MeshBasicMaterial()

);

reticle.matrixAutoUpdate = false;
reticle.visible = false;
reticle.name = 'Reticle';
scene.add(reticle);

makeWinCombos();

//ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
modeChange(gameMaster.gmMode[0]);
//ZZZZZZZZZZZZZZZZZZZZZZZZZZZ


//event listeners
window.addEventListener('resize', onWindowResize);

document.addEventListener('click', firstClick);

document.addEventListener('mousemove', onMouseMove);

document.addEventListener('click', onMouseClick);

renderer.xr.addEventListener('sessionstart', xrSessionStarted);

renderer.xr.addEventListener('sessionend', xrSessionEnded);

ctr1.addEventListener('select', onRetSelect)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

animate();

function xrSessionStarted(event) {

    console.log(`XR sess start`);

}

function xrSessionEnded(event) {

    console.log(`XR sess end`);

}

export function onWindowResize() {

    if (gmPlayz.ARtime == true) { return }

    if (window.innerWidth < window.innerHeight) {
        fov = 100
    }

    //if desktop, landscape
    else {

        fov = 70
    }

    camera.fov = fov;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

export function firstClick() {

    const el = document.getElementById("info");

    if (el !== null) {

        el.parentNode.removeChild(el);

    }

    slp(750).then(() => {

        //ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
        modeChange(gameMaster.gmMode[1]);
        //ZZZZZZZZZZZZZZZZZZZZZZZZZZZ

        const el2 = document.getElementById("info2");
        el2.style.display = 'flex';

    });

}

export async function goSide() {

    await document.body.requestFullscreen();

    try {

        await screen.orientation.lock("landscape");

    } catch (error) {

         console.log(error);
    }

    fov = 70
    camera.fov = 70;
    camera.updateProjectionMatrix();
}

export function onRetSelect() {

    if (reticle.visible) {

        const brd = new Board();
        scene.add(gmBoard.boardGrp);

        gmBoard.boardGrp.position.setFromMatrixPosition(reticle.matrix);
        gmBoard.boardGrp.translateY(0.5);
        gmBoard.boardGrp.scale.set(0.25, 0.25, 0.25);

        uiPlane.add(statBrd);
        gmPlayz.uiTime = false;

        //delete recticle
        var r = sgobn('Reticle');
        scene.remove(r);

        ctr1.removeEventListener('select', onRetSelect);

        if (gmPlayz.Extreme == true) {

            extremeAdjustment();

            takeCorner();

        }

        else { return };

    }

}

function animate() {

    renderer.setAnimationLoop(render);

}

//for landing page tile animation
const speed = 1;

function render(timestamp, frame) {

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    //for sphere spin
    if (world.length > 0) {

        // world[0].rotateY(delta * 0.25);
        world[0].material.uniforms.uTime.value = elapsedTime
    }

    //for landing page tile animation
    if (lpArr.length == 10) {

        mixArr.forEach(e => e.update(delta * speed))

    }

    //for win animation
    if (gmPlayz.gameOver == true && winArr.length > 0) {

        winArr[0].material.uniforms.uTime.value = elapsedTime * 600;

    }

    //for board rotation
    if (gmPlayz.ARtime !== true) {

        gmBoard.boardGrp.rotateY(delta * 0.025);

    }

    //vr controller
    let XRsesh = renderer.xr.getSession();

    if (XRsesh !== null) {

        cleanIntersected();
        intObjects(ctr1);

        if (XRsesh.inputSources.length > 1) {

            intObjects(ctr2);
        }

    }

    //hit test
    if (gmPlayz.ARtime === true) {

        if (hitOb.hitTestSourceRequested === false) {

            requestHitTestSource();

        }

        if (hitOb.hitTestSource) {

            getHitTestResults(frame);

        }

    }

    renderer.render(scene, camera);

}











