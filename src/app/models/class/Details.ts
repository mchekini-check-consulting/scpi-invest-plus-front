export class Details {
    scpi_name: string = "";
     subscription_fees: number=0;
     management_costs: number=0;
     share_price: number=0;
     reconstitution_value: number=0;
     enjoyment_delay: number=0;
     scheduled_payment: boolean=false;
     frequency_payment: string =""
     distribution_rate: number=0;
     minimumSubscription: number=0;
     cashback: number=0;
     capitalization:number=0;
     manager:string="";
    constructor(
        scpi_name: string,
        subscription_fees: number,
        management_costs: number,
        share_price: number,
        reconstitution_value: number ,
        enjoyment_delay: number,
        scheduled_payment: boolean,
        frequency_payment: string,
        distribution_rate: number,
        minimumSubscription: number,
        cashback: number,
        capitalization: number,
        manager:string
    ) {
        this.scpi_name = scpi_name;
        this.subscription_fees = subscription_fees;
        this.management_costs = management_costs;
        this.share_price = share_price;
        this.reconstitution_value = reconstitution_value;
        this.enjoyment_delay = enjoyment_delay;
        this.scheduled_payment = scheduled_payment;
        this.distribution_rate = distribution_rate;
        this.frequency_payment = frequency_payment;
        this.minimumSubscription = minimumSubscription;
        this.cashback = cashback;
        this.capitalization = capitalization;
        this.manager = manager;
    }
}
