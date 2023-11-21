
import Categories from './Categories';
import Drawer from './Drawer';

const Header: React.FC<{}> = () => {
    return (
        <div>
            <Drawer />
            <Categories />
        </div>
    );
};

export default Header;