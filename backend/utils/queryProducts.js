class queyProducts {
    products = [];
    query = {};

    constructor(products, query) {
        this.products = products;
        this.query = query;
    }

    categoryQuery = () => {
        this.products = this.query.category ? this.products.filter((c) => c.category_name === this.query.category) : this.products;
        return this;
    };

    ratingQuery = () => {
        this.products = this.query.rating ? this.products.filter((c) => parseInt(this.query.rating) <= c.rating && c.rating < parseInt(this.query.rating) + 1) : this.products;
        return this;
    };

    sortByPrice = () => {
        if (this.query.sort_price) {
            if (this.query.sort_price === "low-to-high") {
                this.products = this.products.sort((a, b) => a.price - b.price); // Nếu hàm so sánh trả về một giá trị nhỏ hơn 0, thì a sẽ được đặt trước b
            } else {
                this.products = this.products.sort((a, b) => b.price - a.price); // Nếu nó trả về một giá trị lớn hơn 0, thì b sẽ được đặt trước a
            }
        }
        return this;
    };

    priceQuery = () => {
        if (this.query.price_from && this.query.price_to) {
            this.products = this.products.filter((c) => {
                // Tính giá đã giảm
                const discountedPrice = c.price * (1 - c.discount / 100);
                // Lọc sản phẩm dựa trên giá đã giảm
                return (discountedPrice >= this.query.price_from && discountedPrice <= this.query.price_to);
            });
        }
        return this;
    };

    searchQuery = () => {
        const searchValue = this.query.searchValue?.toLowerCase();
        if (searchValue) {
            this.products = this.products.filter((p) => p.product_name.toLowerCase().includes(searchValue));
        }
        return this;
    };

    skip = () => {
        const {page_number, par_page} = this.query;
        const skipPage = (parseInt(page_number, 10) - 1) * par_page;

        this.products = this.products.slice(skipPage);

        return this;
    };

    limit = () => {
        const {par_page} = this.query;

        this.products = this.products.slice(0, par_page);

        return this;
    };

    getProducts = () => this.products;

    countProducts = () => this.products.length;
}

module.exports = queyProducts;
