import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const ProductSchema = ({ product }) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images[0],
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.shop.name
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "VND",
      "price": product.discountPrice || product.originalPrice,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.ratings.toString(),
      "reviewCount": product.reviews.length.toString()
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

ProductSchema.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    shop: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    discountPrice: PropTypes.number,
    originalPrice: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    ratings: PropTypes.number.isRequired,
    reviews: PropTypes.array.isRequired
  }).isRequired
};

export default ProductSchema; 