import {Link} from "react-router-dom";
import {forwardRef} from "react";

export default forwardRef(({article, children}, ref) =>
{
    return <div className="article-item-tags" ref={ref}>
        <ul>
            {Object.keys(article.tags).map((tid) =>
                <li key={article.id + '' + tid}><Link to={'/blog/tag/' + article.tags[tid].slug + '/'} className="article-item-link">#{article.tags[tid].name}</Link></li>
            )}
            <li>{article.date}</li>
            <li>{children}</li>
        </ul>
    </div>
})