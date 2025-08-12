import { SVGAttributes } from 'react';
import { MdOutline360 } from 'react-icons/md';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    // Menggunakan ikon 360 dari Material Design icons
    return <MdOutline360 {...props} />;
}
