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
            // Chuyển đổi từ khóa tìm kiếm sang không dấu
            const normalizedSearch = this.removeVietnameseTones(searchValue);
            
            this.products = this.products.filter((p) => {
                // Chuyển đổi tên sản phẩm sang không dấu để so sánh
                const normalizedProductName = this.removeVietnameseTones(p.product_name.toLowerCase());
                return normalizedProductName.includes(normalizedSearch);
            });
        }
        return this;
    };

    // Hàm chuyển đổi tiếng Việt có dấu sang không dấu
    removeVietnameseTones = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
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
