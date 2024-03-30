export default ({article}) => {

    console.log('Render Article Social');

    return <div className="social">
        <ul>
            <li className="likes">{article.cnt_likes}</li>
            <li className="views">{article.cnt_views}</li>
            <li className="comments">{article.cnt_comments}</li>
        </ul>
    </div>;
}