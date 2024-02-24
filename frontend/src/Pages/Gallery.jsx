import {Link} from "react-router-dom";
import {useEffect} from "react"

//import Tags from "../Components/Tags.jsx";
import Layout from "../Components/Layout"
import Wrapper from "../Components/Wrapper.jsx";
import Slider from "../Components/Slider";

/*const AlbumItem = ({article}) =>
{
    return <div className="article-item">
        <h2 className="article-item-name"><Link to={'/blog/' + article.slug + '/'}>{article.name}</Link></h2>
        <div className="article-item-preview">{article.announce}</div>
        <Tags article={article}>
            <Link to={'/blog/' + article.slug + '/'} className="article-item-link article-item-detail">Подробнее...</Link>
        </Tags>
    </div>
}*/

export default ({Context}) =>
{
    return <Layout articles={Context.articles}>
        <Wrapper component="main" role="main" className="wrapper">
            <Link to="/" className="mobile-home-icon"></Link>
            {/*<Slider>
                <div style={{ width: 100 }}>
                    <p>100</p>
                </div>
                <div style={{ width: 200 }}>
                    <p>200</p>
                </div>
                <div style={{ width: 75 }}>
                    <p>75</p>
                </div>
                <div style={{ width: 300 }}>
                    <p>300</p>
                </div>
                <div style={{ width: 225 }}>
                    <p>225</p>
                </div>
                <div style={{ width: 175 }}>
                    <p>175</p>
                </div>
            </Slider>*/}
        </Wrapper>
    </Layout>;
}