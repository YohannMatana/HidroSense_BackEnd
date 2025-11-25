import { ImgHTMLAttributes } from 'react';

export default function AppLogoIconSideBar(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { className = '', ...restProps } = props;
    
    const getSizeStyles = () => {
        if (className.includes('size-9')) return { width: '32px', height: '32px' };
        if (className.includes('size-8')) return { width: '28px', height: '28px' };
        if (className.includes('h-10')) return { width: '36px', height: '36px' };
        if (className.includes('h-12')) return { width: '40px', height: '40px' };
        return { width: '28px', height: '28px' }; // padrão bem pequeno
    };

    const sizeStyles = getSizeStyles();
    
    const cleanClassName = className
        .replace(/\bsize-\d+\b/g, '')
        .replace(/\bh-\d+\b/g, '')
        .replace(/\bw-\d+\b/g, '')
        .trim();

    return (
        <img 
            {...restProps}
            src="/images/tiny-hidrosense-LOGO-nobg-gota.png" 
            alt="HidroSense Logo"
            className={`object-contain ${cleanClassName}`}
            style={{
                width: sizeStyles.width,
                height: sizeStyles.height,
                maxWidth: 'none',
                ...props.style
            }}
        />
    );
}