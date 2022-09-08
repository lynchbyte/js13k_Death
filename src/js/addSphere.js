
import {

    Mesh,
    ShaderMaterial,
    SphereGeometry,
    PlaneGeometry


}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import { scene, vertsh_sp, fragsh_sp, world } from './script.js';

export function newSphere() {

    const geoSphere = new SphereGeometry(15, 32, 16);

    //testing
    //const geoSphere =  new PlaneGeometry(1, 1)

    const matSphere = new ShaderMaterial({
        vertexShader: vertsh_sp,
        fragmentShader: fragsh_sp,
        transparent: true,
        side: 2,
        uniforms:
        {
            uTime: { value: 0 }
        }
    });

    const sphere = new Mesh(geoSphere, matSphere);

    sphere.name = 'Sphere'
    sphere.rotation.set(0, (90 * (Math.PI / 180)), 0);

    //testing
    //sphere.position.set(0,0,-1)
   // sphere.rotation.set(0, (0 * (Math.PI / 180)), 0);

    scene.add(sphere);
    world.push(sphere)

}
