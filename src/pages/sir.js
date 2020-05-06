import { Row,Col, Button, Select, Slider } from "antd";
import { useEffect } from "react";
import React, {useState} from 'react';
import * as THREE from "three"
import OBJLoader from 'three-obj-loader';
import {graphql} from 'gatsby'
import Img from 'gatsby-image';
import {RobotOutlined,UploadOutlined} from '@ant-design/icons';

OBJLoader(THREE);


const {Option} = Select;

export default ({data}) => {

    const designs = data.allFile.edges;

    const [texture,setTexture] = useState(designs[0].node.childImageSharp.fluid.src);
    const [model,setModel] = useState({});
    

    let domRef;
    let human;
    let loader= new THREE.OBJLoader();
    useEffect( () => {
        console.log(domRef);
        // Make camera
        let near =0.1;
	    let far=10000;
        let fov=45;
        let radiusOfCamera=700;
        let heightOfCamera=225;
        let aspect = domRef.offsetWidth/domRef.offsetHeight;
        let camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

        // Make Scene
        let scene = new THREE.Scene();
        // Make renderer
        let renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setClearColor( 0x99dd99, 1);

        camera.position.z = radiusOfCamera;
        camera.position.y = heightOfCamera;

        renderer.setSize(domRef.offsetWidth, domRef.offsetHeight);
        domRef.appendChild(renderer.domElement);

        // Add a cube just because
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        let animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            if(human){
                human.rotation.y += 0.003;
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

        window.addEventListener("resize",() => {
            if (domRef){
                camera.aspect = domRef.offsetWidth / domRef.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(domRef.offsetWidth, domRef.offsetHeight);
            }
        })

        

    },[]);

    const unflatten = ([...arr],size) => {
        const new_arr = [[]];
        for(const item of arr){
            if(new_arr[new_arr.length-1].length == size ){
                new_arr.push([]);
            }
            new_arr[new_arr.length-1].push(item);
        }
        console.log(arr,new_arr);
        return new_arr;
    }

    return (
        <div style={{height:"100vh"}}>
            <Row style={{height:"100vh"}}>
                <Col xs={0} md={6} xl={5}>
                    <div style={{height:"100%",width:"100%",backgroundColor:"#F5F5DC",position:"relative"}}>
                        <Row style={{display:"flex","justifyContent":"center"}}>
                            <h1 style={{margin:"auto"}}>Texture</h1>
                        </Row>
                        <Row style={{display:"flex","justifyContent":"center",marginTop:"1em"}}>
                            <img src={texture} style={{width:"100%",padding:"1em"}}/>
                        </Row>
                        <Row style={{display:"flex","justifyContent":"center",marginTop:"1em"}}>
                            <div style={{width:"100%"}}>
                                {unflatten(designs,3).map(row => (
                                    <Row style={{display:"flex",justifyContent:"center"}}>
                                        {row.map( design => (
                                            <Col 
                                                span={8}
                                                style={{padding:"0.5em"}}
                                                onClick={() => setTexture(design.node.childImageSharp.fluid.src)}> 
                                                <Img fluid={design.node.childImageSharp.fluid} style={{height:"100%",width:"100%"}} />
                                            </Col>) )}
                                    </Row>
                                ))}
                            </div>
                        </Row>
                        <Row style={{position:"absolute",bottom:"0",right:"0",left:"0",height:"50px"}}>
                            <Col span={24} style={{display:"flex",justifyContent:"center"}}>
                                <Button size="large" type="primary" shape="circle" icon={<RobotOutlined/>} />  
                                <Button size="large" type="primary" shape="circle" icon={<UploadOutlined/>} />   
                            </Col>
                        </Row>
                        
                    </div>
                </Col>
                <Col xs={24} md={12} xl={14} style={{borderLeft:"1px black solid",borderRight:"1px black solid"}}>
                    <div ref={ref => {domRef = ref}} style={{height:"100vh",width:"100%"}}>
                    </div>
                </Col>
                <Col xs={0} md={6} xl={5}>
                    <div style={{height:"100%",width:"100%",backgroundColor:"#F5F5DC"}}>
                        <Row style={{display:"flex","justifyContent":"center"}}>
                            <h1 style={{margin:"auto"}}>Models</h1>
                        </Row>
                        <Row style={{height:"60%"}}>
                        </Row>
                        <Row style={{borderTop:"1px black solid"}}>
                            <div style={{display:"flex",justifyContent:"center",width:"100%",color:"#111"}}><p>Parameters</p></div>
                            
                            <div style={{width:"100%"}}>
                                <Row style={{marginBottom:"0.5em"}}>
                                    <Col span={8} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                        Ethnicity :
                                    </Col>
                                    <Col span={16}>
                                        <Select placeholder="Ethnicity" style={{width:"100%"}}>
                                            <Option value="Asian">Asian</Option>
                                            <Option value="Hispanic">Hispanic</Option>
                                            <Option value="White">White</Option>
                                            <Option value="Nordic">Nordic</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <Row style={{marginBottom:"0.5em"}}>
                                    <Col span={8} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                        Gender :
                                    </Col>
                                    <Col span={16}>
                                        <Select placeholder="Gender" style={{width:"100%"}}>
                                            <Option value="Male">Male</Option>
                                            <Option value="Female">Female</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <Row style={{marginBottom:"0.5em"}}>
                                    <Col span={8} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                        Fitness :
                                    </Col>
                                    <Col span={16}>
                                        <Slider defaultValue={Math.random()*100} style={{margin:"0.5em"}}/>
                                    </Col>
                                </Row>
                                <Row style={{marginBottom:"0.5em"}}>
                                    <Col span={8} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                        Skintone :
                                    </Col>
                                    <Col span={16}>
                                        <Slider defaultValue={Math.random()*100} style={{margin:"0.5em"}}/>
                                    </Col>
                                </Row>
                            </div>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export const Query = graphql`
    query {
        allFile {
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
    }`