import React, { useState } from "react"

import TailorLayout from '../components/layout';

import '../../static/css/index.css';
import { graphql } from "gatsby";

import Img from 'gatsby-image';
import { Row,Col, Button } from "antd";

import TexturePicker from '../components/texturepicker';

const Stages = {
    TEXTURE_PICKER: "Select Texture",
    MODEL_PICKER: "Select closest model",
    INTERACTOR: "Interactive Demo"
}

export default ({data}) => {
    const designs = data.allFile.edges;

    const StagesOrder = [Stages.TEXTURE_PICKER, Stages.MODEL_PICKER, Stages.INTERACTOR];
    const [stage,setStage] = useState(StagesOrder.indexOf(Stages.TEXTURE_PICKER));
    const [texture,setTexture] = useState(designs[0].node.childImageSharp.fluid.src);
    const [model,setModel] = useState({});

    console.log(texture,designs[0]);

    return (<TailorLayout>
        <div className="mainScreen">
            <Row className="stageSelector">
                <Col span={4}>
                    <Button type="primary" block  disabled={stage == 0} onClick={ () => {setStage(stage - 1 )}}>
                        Previous
                    </Button>
                </Col>
                <Col span={16} className="stageInfo">
                    {StagesOrder[stage]}
                </Col>
                <Col span={4}>
                    <Button type="primary" block disabled={stage == (StagesOrder.length-1) } onClick={ () => {setStage(stage + 1 )}}>
                        Next
                    </Button>
                </Col>
            </Row>
            <TexturePicker textureState={[texture,setTexture]}/>

            
        </div>
    </TailorLayout>)
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