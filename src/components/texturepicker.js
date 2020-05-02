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


    return (
        <div className="texturePicker">
            <Row className="selectedTexture">
                <img src={texture}/>
            </Row>
            <Row style={{height: "150px"}}>
                <Col span={8} style={{backgroundColor: "#e22"}}>
                </Col>
                <Col span={8} style={{backgroundColor: "#2e2"}}>
                </Col>
                <Col span={8} style={{backgroundColor: "#22e"}}>
                </Col>
            </Row>
        </div>
    )
}