import React from 'react';

import {graphql,useStaticQuery} from 'gatsby';
import { Row,Col } from 'antd';

import Img from 'gatsby-image';

import '../../static/css/texturepicker.css';

export default ({textureState}) => {
    const data = useStaticQuery(graphql`
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
    }`);


    const [texture,setTexture] = textureState;
    const designs = data.allFile.edges;

    console.log(designs[0]);


    return (
        <div className="texturePicker">
            <Row className="selectedTexture">
                <img src={texture} /> 
            </Row>
            <Row style={{bottom: "0",marginTop: "0.5em", borderTop: "1px black solid"}}>
                <Col span={8}></Col>
                <Col span={16}>
                    <ul style={{display: "flex", flexDirection:"row",overflowX:"auto"}}>
                        {designs.map( design => (
                            <li style={{flex: "0 0 auto",height:"150px",width:"150px"}}
                                onClick={() => setTexture(design.node.childImageSharp.fluid.src)}>
                                <Img fluid={design.node.childImageSharp.fluid}/>
                            </li>
                        ) )}
                    </ul>
                </Col>
            </Row>
        </div>
    )
}