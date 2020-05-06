import React, { useEffect } from 'react';

import * as THREE from "three"
import OBJLoader from 'three-obj-loader';

OBJLoader(THREE);
export default () => {
    let domRef;
    let loader= new THREE.OBJLoader();
    let human;
    useEffect( () => {

        // Make camera
        let near =0.1;
	    let far=10000;
        let fov=90;
        let radiusOfCamera=310;
        let heightOfCamera=225;
        let aspect = domRef.offsetWidth/domRef.offsetHeight;
        const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

        // Make Scene
        let scene = new THREE.Scene();

        // Make renderer
        let renderer = new THREE.WebGLRenderer();

        camera.position.z = radiusOfCamera;
        camera.position.y = heightOfCamera;

        renderer.setSize(domRef.offsetWidth, domRef.offsetHeight);
        domRef.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        let animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            if(human){
                human.rotation.y += 0.01;
            }
            renderer.render(scene, camera);

        }
        animate();
        
        loader.load(
            '/humans/human_free.obj', // Resource
            (object) => { // Once loaded.
                human = object;
                human.rotation.y= -Math.PI / 2;
                scene.add(human);
            },
            (xhr) => { //Updates
                console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
            }

        );
        //we need some light
        {
            const color =0xffffff;
            const intensity=0;
            const light  = new THREE.DirectionalLight(color,intensity)
            light.position.set(0,10,0);
            light.target.position.set(-5,0,0)
            scene.add(light);
            scene.add(light.target)
        }

        // hemisphere light
        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 1;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            scene.add(light);
        }

    },[]);

    return (
        <div ref={ref => (domRef=ref)} style={{width:"100%"}}>

        </div>
    )
}