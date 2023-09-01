
import numeral from 'numeral';

const PriceFormmater = ({ priceInVND , hasSymbol = "" , textBefore = "" , className }) => {
  const formattedPrice = numeral(priceInVND).format('0,0 VND');

  return <p className={className}>{`${textBefore}${hasSymbol} ${formattedPrice}đ`}</p>;
};

export default PriceFormmater;
