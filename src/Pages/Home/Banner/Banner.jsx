import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import imageBanner1 from "../../../assets/banner/banner1.png";
import imageBanner2 from "../../../assets/banner/banner2.png";
import imageBanner3 from "../../../assets/banner/banner3.png";
const Banner = () => {
  return (
    <Carousel autoPlay={true} showThumbs={false} infiniteLoop={true}>
      <div>
        <img src={imageBanner1} />
      </div>
      <div>
        <img src={imageBanner2} />
      </div>
      <div>
        <img src={imageBanner3} />
      </div>
    </Carousel>
  );
};

export default Banner;
