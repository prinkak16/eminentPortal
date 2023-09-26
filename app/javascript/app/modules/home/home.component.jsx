import React from 'react';
import './home.styles.scss'
import Imagelogo from '../../images/imagelogo.svg'

const HomeComponent = () => {

    return (
        <>
            <div className='hello'>
                Hi there!
            </div>
            <div>
                Find me here: app/javascript/app/modules/home/home.component.jsx
                <Imagelogo/>
                {/*<img src={image} alt='dchjvsbj'/>*/}
            </div>
        </>
    );
}

export default HomeComponent;