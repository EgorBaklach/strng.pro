import {Link} from "react-router-dom";
import {forwardRef} from "react";

export default forwardRef(({article, children, className}, ref) =>
{
    return <div className={className} ref={ref}>
        <ul>
            {Object.keys(article.tags).map((tid) =>
                <li key={article.id + '' + tid}><Link to={'/blog/tag/' + article.tags[tid].slug + '/'} className="link">#{article.tags[tid].name}</Link></li>
            )}
            <li>{article.date}</li>
            {children}
        </ul>
    </div>
})