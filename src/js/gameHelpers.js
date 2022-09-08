

import {

    Mesh,
    MeshStandardMaterial,
    MeshBasicMaterial,
    PlaneGeometry,

}
    from 'https://unpkg.com/three@0.143.0/build/three.module.js';

import { scene, txLoader, imgNum, texture, statBrd } from './script.js';




export function removeOb(name, parent) {

    let ob = sgobn(name);

    parent.remove(ob);

}

export function sgobn(namestring){

   let ob =  scene.getObjectByName(namestring);
   return ob;

}



// export function removeDups(arr) {

//     let temp = []

//     arr.forEach(e => temp.push(e.name));

//     const nwzArr = (Array.from(new Set(temp)));

//     return { nwzArr }

// }

/**
 * Creates a new plane with a textured material added to the scene.
 * Plane size 1 x 1, can vary; rotation and size, not scale.
 * eg; const makeLandPic = new picNew('src/media/landing.png', 0, (0 * (Math.PI / 180)), 0, 0, 0, 0.25, `Landing Plane`);
 */
export class picNew extends Mesh {

    /**
        * @param {string}  url - The path + url to the file to be displayed
        * @param {number}  rotX - Rotation about the X axis, in radians; (degrees * (Math.PI / 180))
        * @param {number}  rotY - Rotation about the Y axis, in radians; (degrees * (Math.PI / 180))
        * @param {number}  rotZ - Rotation about the Z axis, in radians; (degrees * (Math.PI / 180))
        * @param {number}  posX - Position along X axis
        * @param {number}  posY - Position along X axis
        * @param {number}  posZ - Position along X axis
        * @param {string}  name - populate mesh.name with this string
        */

    constructor(url, rotX, rotY, rotZ, posX, posY, posZ, name, imagePlace, parent) {

        super();

        this.url = url;
        this.rotX = rotX;
        this.rotY = rotY;
        this.rotZ = rotZ;
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.name = name;
        this.imagePlace = imagePlace;
        this.parent = parent;

        const texture = txLoader.load(url);

        if (imgNum !== undefined){
        texture.offset.set(1 / imgNum * imagePlace, 0);
        texture.repeat.set(1 / imgNum, 1);
        }

        const matPlane = new MeshStandardMaterial({ map: texture, side: 2, transparent: true });//

        const gPlane = new PlaneGeometry(1, 1, 32, 32);

        const newPicMesh = new Mesh(gPlane, matPlane);

        newPicMesh.rotation.set(this.rotX, this.rotY, this.rotZ);
        newPicMesh.position.set(this.posX, this.posY, this.posZ);

        newPicMesh.name = this.name;

        parent.add(newPicMesh);

    }
}

/**
 * @description Function that takes an array and returns an array of all the possible permutations of 'list', with 
 * each permutation having a length of 'size'.
 *  generatePermutations
 * {@link https://stackoverflow.com/questions/9960908/permutations-in-javascript/37580979#37580979 Stackoverflow permutations-in-javascript - Andrew Richesson }
 * @param {Array} list - The array to cycle through
 * @param {number} [size =  list.length] - The length of arrays to return
 * @returns { Array }  - An array of arrays (strings)

*/
export function genPerms(list, size = list.length) {

    if (size > list.length) {

        return [];
    }

    else if (size == 1) {

        return list.map(d => [d]);
    }

    return list.flatMap((d) =>

        genPerms(

            list.filter((a) => a !== d),
            size - 1

        )
            .map((item) => [d, ...item])
    );

}


export function slp(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}



export function statBrdUpdate(imgLoc) {

    texture.offset.set(1 / imgNum * imgLoc, 0);//1/imageNum * imagePlace,
    texture.repeat.set(1 / imgNum, 1);

    statBrd.material = new MeshBasicMaterial({ map: texture, side: 2, transparent: true, });

    statBrd.material.needsUpdate = true;

}







