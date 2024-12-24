class queryOrders {
    orders = [];
    query = {};

    constructor(orders, query) {
        this.orders = orders;
        this.query = query;
    }

    recentOrdersQuery = () => {
        if (this.query.order_recently) {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - Number(this.query.order_recently));
            this.orders = this.orders.filter((order) => new Date(order.createdAt) >= daysAgo);
        }
        return this;
    };

    statusQuery = () => {
        if (this.query.status) {
            this.orders = this.orders.filter((order) => order.delivery_status === this.query.status);
        }
        return this;
    };

    paymentQuery = () => {
        if (this.query.payment) {
            this.orders = this.orders.filter((order) => order.payment_status === this.query.payment);
        }
        return this;
    };

    skip = () => {
        const {pageNumber, parPage} = this.query;
        const skipPage = (parseInt(pageNumber, 10) - 1) * parPage;
        this.orders = this.orders.slice(skipPage);
        return this;
    };

    limit = () => {
        const {parPage} = this.query;
        this.or = this.orders.slice(0, parPage);
        return this;
    };

    getOrders = () => this.orders;

    countOrders = () => this.orders.length;
}

module.exports = queryOrders;
