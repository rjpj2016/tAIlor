import { Row,Col, Button, Select, Slider } from "antd";
import { useEffect } from "react";
import React, {useState} from 'react';
import * as THREE from "three"
import OBJLoader from 'three-obj-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {graphql} from 'gatsby'
import Img from 'gatsby-image';

import DesignPicker from '../components/designpicker';
import ModelPicker  from '../components/modelpicker';

OBJLoader(THREE);


const {Option} = Select;

const Shirt = (design) => {
    const textureLoader = new THREE.TextureLoader();
    const material2 = new THREE.MeshPhongMaterial({map:textureLoader.load(design)})
    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(24,24,50),material2)
    var cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(24,24,50),material2)
    var cuboid1 = new THREE.Mesh(new THREE.BoxGeometry(20,33,16),material2)
    var cuboid2 = new THREE.Mesh(new THREE.BoxGeometry(20,33,16),material2)
    var upperRaidus =30
    var lowerRadius = 50
    var frustumHeight = 60
    var chest = new THREE.Mesh(new THREE.CylinderGeometry(upperRaidus,lowerRadius,frustumHeight,16),material2)
    var abs = new THREE.Mesh(new THREE.CylinderGeometry(45,36,80,16),material2)
    var sphere1 = new THREE.Mesh(new THREE.SphereGeometry(22,20,20),material2)
    var sphere2 = new THREE.Mesh(new THREE.SphereGeometry(22,20,20),material2)
    var upperRaidus =30
    const scale = 1;
    cylinder.position.set(50,280*scale,-14)
    cylinder.rotation.set(0,0,0.5)
    cylinder2.position.set(-50,280*scale,-24)
    cylinder2.rotation.set(0,0,-0.5)
    chest.position.set(0,290*scale,-15)
    chest.rotation.set(0,0.8,0)
    sphere1.position.set(34,298*scale,-19)
    sphere2.position.set(-34,298*scale,-19)
    abs.position.set(0,285*scale-frustumHeight,-10)	

    cuboid1.position.set(36,289*scale,7)
    cuboid2.position.set(-36,287*scale,7)
    console.log(cuboid1)
    return [cylinder,cylinder2,abs,chest,sphere1,sphere2,cuboid1,cuboid2];
}

export default ({data}) => {
    let domRef;
    let human;
    let scene;
    let loader= new THREE.OBJLoader();


    const designs = data.designs.edges;
    const models = data.models.edges;

    const [design,setDesign_] = useState(designs[0].node.childImageSharp.fluid.src);

    const clothes = Shirt(design);

    const setDesign = (design) => {
        const textureLoader = new THREE.TextureLoader();
        const material2 = new THREE.MeshPhongMaterial({map:textureLoader.load(design)})
        clothes.map( cloth => {
            cloth.material = material2;
        });
        setDesign_(design);
    }

    const setModel = (publicURL) => {
        if (human && scene) {scene.remove(human)}
        loader.load(
            publicURL, // Resource
            (object) => { // Once loaded.
                human = object;
                scene.add(human);
            },
            (xhr) => { //Updates
                console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
            }

        );
    }
    
    useEffect( () => {
        // Make camera
        let near =0.1;
	    let far=10000;
        let fov=45;
        let radiusOfCamera=700;
        let heightOfCamera=225;
        let aspect = domRef.offsetWidth/domRef.offsetHeight;
        let camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

        // Make Scene
        scene = new THREE.Scene();
        // Make renderer
        let renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setClearColor( 0x99dd99, 1);

        let controls = new OrbitControls(camera,renderer.domElement);

        camera.position.z = radiusOfCamera;
        camera.position.y = heightOfCamera;

        renderer.setSize(domRef.offsetWidth, domRef.offsetHeight);
        domRef.appendChild(renderer.domElement);

        // Add a cube just because
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        
        scene.add(...clothes);

        let animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            if(human){

            }
            renderer.render(scene, camera);

        }
        animate();

        loader.load(
            '/humans/human_free.obj', // Resource
            (object) => { // Once loaded.
                human = object;
                human.rotation.y = -Math.PI/2;
                human.position.y=-100
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

        window.addEventListener("resize",() => {
            if (domRef){
                camera.aspect = domRef.offsetWidth / domRef.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(domRef.offsetWidth, domRef.offsetHeight);
            }
        })

        

    },[]);

    return (
        <div style={{height:"100vh"}}>
            <Row style={{height:"100vh"}}>
                <Col xs={0} md={6} xl={5}>
                    <DesignPicker designs={designs} designState={[design,setDesign]}/>

                    
                </Col>
                <Col xs={24} md={12} xl={14} style={{borderLeft:"1px black solid",borderRight:"1px black solid"}}>
                    <div ref={ref => {domRef = ref}} style={{height:"100vh",width:"100%"}}>
                    </div>
                </Col>
                <Col xs={0} md={6} xl={5}>
                    <ModelPicker models={models} modelState={{setModel}}/>
                    
                </Col>
            </Row>
        </div>
    )
}

export const Query = graphql`
query {
    designs : allFile (filter: {relativeDirectory: {eq: "images/designs"}}) {
        edges {
            node {
                childImageSharp {
                    fluid {
                    ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    }
    models: allFile (filter:{
            relativeDirectory:{eq:"humans"},
            extension:{ eq:"obj"}
    }){
        edges {
            node {
                publicURL
                name
            }
        }
    }
}`