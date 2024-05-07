import './Layout.css'


function Layout() {
    const nivel = 1;
    const nivelMaximo = 1;

    return <body>
    <h1>GENIUS</h1>
    <div className='status'>
        <span>Nível: {nivel}</span>
        <span>Nível máximo: {nivelMaximo}</span>
    </div>
    </body>

}
   
   export default Layout