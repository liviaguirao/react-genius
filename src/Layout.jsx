import './Layout.css'

const Button = ({ color, onClick , roundedCorner}) => {
    let borderRadius = '0%';
    if (color === 'red' && roundedCorner === 'top-left') {
        borderRadius = '90% 10% 10% 10%';
      } else if (color === 'blue' && roundedCorner === 'top-right') {
        borderRadius = '10% 90% 10% 10%';
      } else if (color === 'yellow' && roundedCorner === 'bottom-left') {
        borderRadius = '10% 10% 10% 90%';
      } else if (color === 'green' && roundedCorner === 'bottom-right') {
        borderRadius = '10% 10% 90% 10%';
      }

    return (
      <button
        className="genius-button"
        style={{ backgroundColor: color, borderRadius: borderRadius}}
        onClick={() => onClick(color)}
      />
    );
  };
  





function Layout() {
    const nivel = 1;
    const nivelMaximo = 1;

    return <body>
        <h1>GENIUS</h1>
        <button className='botaoStart'>Start</button>
        <div className='jogo'>
          <div className='circulo'>
          <div>
            <Button color={'red'} roundedCorner={'top-left'} />
            <Button color={'blue'} roundedCorner={'top-right'}/>
          </div>
          <div>
            <Button color={'yellow'} roundedCorner={'bottom-left'}/>
            <Button color={'green'} roundedCorner={'bottom-right'}/>
          </div>
          </div>
        </div>

        <div className='status'>
         <span>Nível: {nivel}</span>
         <span>Nível máximo: {nivelMaximo}</span>
        </div>
      
    </body>

}
export default Layout

   



