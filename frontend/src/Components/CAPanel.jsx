export default ({cookies}) => cookies.values?.access !== 'Y' && <div className="cookies-panel">
    <div className="notice">На сайте ведется запись <span onClick={() => alert('Записывается только Ваш IP адрес')}>Cookies</span></div>
    <button onClick={() => cookies.set('access', 'Y') && document.body.classList.add('cookies-panel-hide')}>Ok</button>
</div>