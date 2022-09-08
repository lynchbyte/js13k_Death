import {

  PlaneGeometry,
  Mesh,
  ShaderMaterial

}
  from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import { scene, vertsh_fl, fragsh_fl } from './script.js';


export function addFloor() {

  const flrG = new PlaneGeometry(2, 2, 32, 32);

  const flrM = new ShaderMaterial({
    vertexShader: vertsh_fl,
    fragmentShader: fragsh_fl,
    transparent: true,
  });

  const flr1 = new Mesh(flrG, flrM);
  flr1.rotation.set((-90 * (Math.PI / 180)), 0, 0);
  flr1.position.set(0, -1, 0);
  const fl2 = flr1.clone();

  scene.add(flr1, fl2);


}