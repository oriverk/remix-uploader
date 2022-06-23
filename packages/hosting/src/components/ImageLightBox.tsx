import { FC } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}
export const ImageLightbox: FC<Props> = (props) => {
  const { src, alt, ...rest } = props
  // const [index, setIndex] = useState(0);
  // const [isOpen, setIsOpen] = useState(false);

  // const images = typeof src === 'string' ? [src] : [...src];

  return (
    <>
      {/* <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='focus:outline-none'
      > */}
        <img src={src} alt={alt} {...rest} />
      {/* </button> */}
      {/* {isOpen && (
        <Lightbox
          mainSrc={images[index]}
          nextSrc={images[(index + 1) % images.length]}
          prevSrc={images[(index + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setIndex(
              (prevIndex) => (prevIndex + images.length - 1) % images.length
            )
          }
          onMoveNextRequest={() =>
            setIndex((prevIndex) => (prevIndex + 1) % images.length)
          }
        />
      )} */}
    </>
  );
}