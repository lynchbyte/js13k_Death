import {

  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  NormalBlending,
  ShaderMaterial,
  Uint16BufferAttribute,

}
  from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import {
  scene,
  winArr,
  vertsh_go,
  fragsh_go,

} from './script.js';


export function add_GO_points(col) {


  //shader 'adapted' from https://codepen.io/takumifukasawa/pen/RwPQVzW

  const geo = new BufferGeometry();

  const index = [];
  const vertices = [];
  const uvs = [];
  const offsets = [];
  const indices = [];
  const sizes = [];
  const colors = [];
  winArr.length = 0;


  const particleNum = 2000;
  const rOfRg= 12;//randomOffsetRange
  const sizeRange = 1.1;
  const sizeMin = 0.02;

  for (let i = 0; i < particleNum; i++) {
    const px = Math.random() * rOfRg- rOfRg* 0.5;
    const py = Math.random() * rOfRg- rOfRg* 0.5;
    const pz = Math.random() * rOfRg- rOfRg* 0.5;
    const size = Math.random() * sizeRange + sizeMin;

    const color = {
      x: col.r,
      y: col.g,
      z: col.b,
    };

    for (let j = 0; j < 4; j++) {
      index.push(i);
      vertices.push(px, py, pz);
      sizes.push(size, size);
      colors.push(color.x, color.y, color.z);
    }
    uvs.push(
      0, 0,
      1, 0,
      1, 1,
      0, 1
    );
    offsets.push(
      -1, -1,
      1, -1,
      1, 1,
      -1, 1
    );
    const vertexIndex = i * 4;
    indices.push(
      vertexIndex + 0, vertexIndex + 1, vertexIndex + 2,
      vertexIndex + 2, vertexIndex + 3, vertexIndex + 0
    );
  }
  geo.setIndex(indices);
  geo.setAttribute('index', new Uint16BufferAttribute(index, 1));
  geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geo.setAttribute('uv', new Uint16BufferAttribute(uvs, 2));
  geo.setAttribute('offset', new Float32BufferAttribute(offsets, 2));
  geo.setAttribute('size', new Float32BufferAttribute(sizes, 2));
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3));

  const mat = new ShaderMaterial({
    vertexShader: vertsh_go,
    fragmentShader: fragsh_go,
    transparent: true,
    blending: NormalBlending,
    alphaTest: 0.01,
    depthWrite: false,
    uniforms: {
      uTime: {
        value: 0,
      },
    },
  });

  const dots = new Mesh(geo, mat);
  dots.name = "Dots"
  scene.add(dots);
  winArr.push(dots);

}