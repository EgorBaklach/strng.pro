import {Link} from "react-router-dom";

import Tags from "./Tags.jsx";

export default ({article}) => <div className="article-item box">
    <h2 className="name"><Link to={'/blog/' + article.slug + '/'}>{article.name}</Link></h2>
    <Link to={'/blog/' + article.slug + '/'} className="picture">
        <img src={article.pictures[1]} alt={article.name}/>
        <div className="social">
            <ul>
                <li className="likes">{article.cnt_likes}</li>
                <li className="views">{article.cnt_views}</li>
                <li className="comments">{article.cnt_comments}</li>
            </ul>
        </div>
    </Link>
    <div className="preview">{article.announce}</div>
    <Tags article={article} className="article-tags">
        <li className="detail"><Link to={'/blog/' + article.slug + '/'}>Подробнее...</Link></li>
    </Tags>
</div>;