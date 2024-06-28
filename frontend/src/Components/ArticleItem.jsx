import {Link} from "react-router-dom";

import Tags from "./Tags.jsx";
import Social from "./Social.jsx";

export default ({article}) => <div className="article-item box">
    <h2 className="name"><Link to={'/blog/' + article.slug + '/'}>{article.name}</Link></h2>
    <Link to={'/blog/' + article.slug + '/'} className="picture">
        <img src={article.pictures[1]} alt={article.name}/>
        <Social social={{likes: article.cnt_likes, visits: article.cnt_visits, comments: article.cnt_comments}} id={article.id} key={"social-" + article.id}/>
    </Link>
    <div className="preview">{article.announce}</div>
    <Tags article={article} className="article-tags">
        <li className="detail"><Link to={'/blog/' + article.slug + '/'}>Подробнее...</Link></li>
    </Tags>
</div>;