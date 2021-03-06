import React from 'react';

import {Row, Col,Select, Slider,List, Button } from 'antd';


const {Option} = Select;

export default ({models,modelState,setWaist}) => {
    const {setModel} = modelState;
    console.log(models);
    return (
        <div style={{width:"100%",backgroundColor:"#F5F5DC",display:"flex",alignItems:"center",position:"absolute",bottom:0}}>
            {/* <Row style={{display:"flex","justifyContent":"center"}}>
                <h1 style={{margin:"auto"}}>Models</h1>
            </Row>
            <Row style={{height:"60%"}}>
                <List style={{width:"100%",padding:"1em 1em"}}>
                    {models.map((model,index)=> (
                        <div key={index} style={{border:"1px #333 solid ", backgroundColor:"#fff",minHeight:"3em",width:"100%",marginBottom:"1em"}}>
                            <Row style={{display:"flex",textAlign:"center"}}>
                                <div style={{justifyContent:"center",alignItems:"center",width:"100%"}}>
                                    <p style={{alignItems:"center",marginBottom:0}}>
                                        {model.node.name}
                                    </p>
                                </div>

                            </Row>
                            <Button block type="primary" onClick={() => setModel(model.node.publicURL)}>
                                Load
                            </Button>
                        </div>
                    ))}
                </List>
                
            </Row> */}
            {/* <Row style={{borderTop:"1px black solid",width:"100%"}}> */}
            <Row style={{width:"100%"}}>
                <div style={{display:"flex",justifyContent:"center",width:"100%",color:"#111"}}><p>Parameters</p></div>
                
                <div style={{width:"100%"}}>
                    <Row style={{marginBottom:"0.5em"}}>
                        <Col span={10} style={{display:"flex",justifyContent:"flex-end",paddingRight:"1em",alignItems:"center"}}>
                            Waist :
                        </Col>
                        <Col span={14}>
                            <Slider defaultValue={5} min={1} max={10} style={{margin:"0.5em"}} onChange={setWaist}/>
                        </Col>
                    </Row>
                </div>
            </Row>
        </div>
    )
}
