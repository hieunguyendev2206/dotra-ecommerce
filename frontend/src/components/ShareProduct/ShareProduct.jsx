import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import PropTypes from "prop-types";

const ShareProduct = ({ product }) => {
    const shareUrl = `${window.location.origin}/product/${product.slug}`;
    const shareTitle = product.product_name;

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    const shareToTwitter = () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    const shareToInstagram = () => {
        // Instagram không có API chia sẻ trực tiếp, nên sẽ copy link vào clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Đã sao chép link sản phẩm vào clipboard. Bạn có thể dán vào Instagram!');
    };

    return (
        <div className="flex items-center gap-4 mt-4">
            <span className="text-gray-600">Chia sẻ:</span>
            <div className="flex gap-3">
                <button
                    onClick={shareToFacebook}
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Chia sẻ lên Facebook"
                >
                    <FaFacebook size={20} />
                </button>
                <button
                    onClick={shareToTwitter}
                    className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                    title="Chia sẻ lên Twitter"
                >
                    <FaTwitter size={20} />
                </button>
                <button
                    onClick={shareToInstagram}
                    className="p-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition-colors"
                    title="Chia sẻ lên Instagram"
                >
                    <FaInstagram size={20} />
                </button>
            </div>
        </div>
    );
};

ShareProduct.propTypes = {
    product: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired
    }).isRequired
};

export default ShareProduct; 