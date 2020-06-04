import { Row,Col, Button, Select, Slider } from "antd";
import { useEffect } from "react";
import React, {useState,useRef} from 'react';
import * as THREE from "three"
import OBJLoader from 'three-obj-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {graphql} from 'gatsby'
import Img from 'gatsby-image';

import DesignPicker from '../components/designpicker';
import ModelPicker  from '../components/modelpicker';



OBJLoader(THREE);


const {Option} = Select;

export default ({data}) => {
    let domRef;
    let human = useRef(null);
    let shirt = useRef(null);
    let scene = useRef(null);



    const designs = data.designs.edges;
    const models = data.models.edges;

    const [design,setDesign_] = useState(designs[0].node.childImageSharp.fluid.src);


    const setDesign = (design) => {
        setDesign_(design);
        const textureLoader = new THREE.TextureLoader();
        const material2 = new THREE.MeshPhongMaterial({map:textureLoader.load(design)})
        shirt.current.traverse( child => {
            if (child instanceof THREE.Mesh){
                child.material = material2;
                child.material.needsUpdate= true;
                child.material.map.needsUpdate = true;
                child.needsUpdate = true;
            }
        });
    }

    const setModel = (publicURL) => {
        if (human.current && scene.current) {scene.remove(human)}
        let loader= new THREE.OBJLoader();
        loader.load(
            publicURL, // Resource
            (object) => { // Once loaded.
                human.current = object;
                human.current.rotation.y = -Math.PI/2;
                console.log(scene.current,human.current);
                scene.add(human.current);
            },
            (xhr) => { //Updates
                console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
            }

        );
    }
    
    useEffect( () => {
        let loader= new THREE.OBJLoader();

        // Make camera
        let near =0.1;
	    let far=10000;
        let fov=45;
        let radiusOfCamera=2;
        let heightOfCamera=0;
        let aspect = domRef.offsetWidth/domRef.offsetHeight;
        let camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

        // Make Scene
        scene.current = new THREE.Scene();
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

    

        let animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            if(human.current){

            }
            renderer.render(scene.current, camera);

        }
        animate();

        loader.load('/clothes/girl_shirt.obj',
            (object) => {
                console.log("Got shirt!")
                shirt.current = object;
                //shirt.material.color.setHex( 0xff0000 );
                //shirt.material = new THREE.MeshPhongMaterial({color:0xff0000});
                /*shirt.traverse(child => {
                    if (child instanceof THREE.Mesh){
                        child.material.color.setRGB (1,0,0);
                    }
                })*/
                const textureLoader = new THREE.TextureLoader();
                const material2 = new THREE.MeshPhongMaterial({map:textureLoader.load(design)})
                shirt.current.traverse( child => {
                    if (child instanceof THREE.Mesh){
                        child.material = material2;
                    }
                });
                //shirt.position.z += 5;
                shirt.current.position.y += 0.143;
                //shirt.scale.set(0.006,0.006,0.006);
                scene.current.add(shirt.current);
            },
            (xhr) => {
                console.log("Shirt: ",xhr.loaded/xhr.total*100 ,"% Loaded")
            }
        )

        loader.load(
            '/humans/girl.obj', // Resource
            (object) => { // Once loaded.
                human.current = object;
                //human.rotation.y = -Math.PI/2;
                human.current.position.y -= 1
                const mat = new THREE.MeshPhongMaterial({color:0xFFDBAC})
                human.current.traverse(child => {
                    if (child instanceof THREE.Mesh){
                        child.material = mat;
                    }
                })
                scene.current.add(human.current);
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
            scene.current.add(light);
            scene.current.add(light.target)
        }

        // hemisphere light
        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor =  0x999999//0xB97A20;  // brownish orange
            const intensity = 1;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            scene.current.add(light);
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