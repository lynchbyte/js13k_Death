import { scene, renderer,  uiPlane, clickable, picAll } from './script.js';
import {  picNew, sgobn} from './gameHelpers.js';


//webXR#1 -   device query, is xr supported by user's device?
export async function XRSuppQry() {

    if ('xr' in navigator) {

        const immersiveVROK = await navigator.xr.isSessionSupported("immersive-vr");
        if (immersiveVROK) {

            //webXR#2 - advertise XR functionality //

            //vr with controller
            const vrPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, 0, 0, 0.002, `vr Pl`, 7, uiPlane);
            let vrp = sgobn(`vr Pl`);
            clickable.push(vrp);

        }

        if (!immersiveVROK) {

            const vrNotPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, 0, 0, 0.002, `vr Not Pl`, 9, uiPlane);

        }

        const immersiveAROK = await navigator.xr.isSessionSupported('immersive-ar');

        if (immersiveAROK) {

            //webXR#2 - advertise XR functionality //

            const arPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, 0, -1.25, 0.002, `ar Pl`, 8, uiPlane);
            let arp = sgobn(`ar Pl`);
            clickable.push(arp);


        }

        if (!immersiveAROK) {

            const arNotPic = new picNew(picAll, 0, (0 * (Math.PI / 180)), 0, 0, -1.25, 0.002, `ar Not Pl`, 10, uiPlane);

        }
    }

}

export async function startSession(type) {

    try {

        //webXR#4 - request an immersive session from the device//

        if (type == 'immersive-ar') {

            const xrSession = await navigator.xr.requestSession(type,
                {

                    requiredFeatures: ['hit-test']

                });

            onSessionStarted(xrSession);
        }

        else {

            const xrSession = await navigator.xr.requestSession(type);

            onSessionStarted(xrSession);
        }


    } catch (error) {

        alert("Failed to start Web XR session.", error);

    }
}


async function onSessionStarted(session) {

    session.addEventListener('end', onSessionEnded);

    renderer.xr.setReferenceSpaceType('local');

    //viewer -> primarily used for creating inline experiences that do not respond to device motion.
    //local -> does not require the user to move around in space, seated
    //local-floor -> does not require the user to move around in space, standing
    //bounded-floor -> not needed to travel beyond a fixed boundary defined by the XR hardware
    //unbounded -> freely move around their physical environment and travel significant distances
    //https://immersive-web.github.io/webxr/spatial-tracking-explainer.html



    //webXR#5 - use the session to run a render loop //
    await renderer.xr.setSession(session);

}

function onSessionEnded() {

    console.log(`xr End`);

}


