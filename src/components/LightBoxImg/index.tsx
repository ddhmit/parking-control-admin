import React, { useState } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import classNames from 'classnames';
import styles from './index.less';

interface LightBoxImgProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  wrapperClassName?: string;
  [s: string]: any;
}

const LightBoxImg: React.FC<LightBoxImgProps> = (props) => {
  const { wrapperClassName, className, src, alt, ...restProps } = props;
  const [magnified, setMagnified] = useState(false);

  const onToggle = (e: any) => {
    e.stopPropagation();
    setMagnified((status) => !status);
  };

  return (
    <div onClick={onToggle} className={classNames(styles.lightBoxImgWrapper, wrapperClassName)}>
      <img
        className={classNames(styles.lightBoxImgWrapper, className)}
        src={src}
        alt={alt}
        {...restProps}
      />
      {src && (
        <ModalGateway>
          {magnified ? (
            <Modal allowFullscreen={false} onClose={onToggle}>
              <Carousel
                components={{
                  Header: undefined,
                  Footer: undefined,
                  Navigation: undefined,
                  NavigationPrev: undefined,
                  NavigationNext: undefined,
                  // View: CustomView
                }}
                currentIndex={0}
                views={[{ source: src }]}
                styles={{
                  view: (styObj, state) => {
                    // console.log('styles => ', styObj, state);
                    return {
                      ...styObj,
                      height: '90vh',
                      display: '-webkit-flex',
                      alignItems: 'center',
                    };
                  },
                }}
                trackProps={{ swipe: false, contain: true, infinite: false, viewsToShow: 1 }}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      )}
    </div>
  );
};
export default LightBoxImg;
