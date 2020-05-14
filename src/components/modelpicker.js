import React from 'react';

import {Row, Col,Select, Slider } from 'antd';

const {Option} = Select;

export default () => {
    return (
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
                            Hair Style :
                        </Col>
                        <Col span={16}>
                            <Select placeholder="Hair Style" style={{width:"100%"}}>
                                <Option value="Afro">Afro</Option>
                                <Option value="Buzz">Buzz</Option>
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
    )
}