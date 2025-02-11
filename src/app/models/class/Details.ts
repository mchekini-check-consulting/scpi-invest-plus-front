export class Details {
    private scpi_name: string = "";
    private subscription_fees: number=0;
    private management_costs: number=0;
    private share_price: number=0;
    private reconstitution_value: number=0;
    private enjoyment_delay: number=0;
    private scheduled_payment: boolean=false;
    private distribution_rate: number=0;
    private minimumSubscription: number=0;
    private cashback: number=0;
    constructor(
        scpi_name: string,
        subscription_fees: number,
        management_costs: number,
        share_price: number,
        reconstitution_value: number ,
        enjoyment_delay: number,
        scheduled_payment: boolean,
        distribution_rate: number,
        minimumSubscription: number,
        cashback: number
    ) {
        this.scpi_name = scpi_name;
        this.subscription_fees = subscription_fees;
        this.management_costs = management_costs;
        this.share_price = share_price;
        this.reconstitution_value = reconstitution_value;
        this.enjoyment_delay = enjoyment_delay;
        this.scheduled_payment = scheduled_payment;
        this.distribution_rate = distribution_rate;
        this.minimumSubscription = minimumSubscription;
        this.cashback = cashback;
    }
}
