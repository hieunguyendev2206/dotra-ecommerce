import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, name, type }) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      
      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

SEO.defaultProps = {
  title: 'Dotra - Sàn thương mại điện tử đa người bán',
  description: 'Dotra - Nền tảng mua sắm trực tuyến hàng đầu với đa dạng sản phẩm từ nhiều người bán. Mua sắm an toàn, tiện lợi với giá tốt nhất.',
  name: 'Dotra',
  type: 'website'
};

export default SEO; 