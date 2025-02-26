import { TransactionRepo } from "../repo/transaction-repo";
import { Transaction } from "../models/transaction";
import { TotalAmountCategoryParam } from "../models/total-amount-category-param";

export class FunctionListService {

    public avaiableFunction: { [key: string]: any };

    private transactionRepo: TransactionRepo;



    constructor() {
        this.avaiableFunction = {
            "add_new": this.add_new.bind(this),
            "total_list_by_category_type": this.total_list_by_category_type.bind(this),
            "category_list": this.category_list.bind(this),
            "total_amount": this.total_amount.bind(this),
            "show_transaction_list": this.show_transaction_list.bind(this)
        }
        this.transactionRepo = new TransactionRepo();
    }

    async add_new(transaction: Transaction) {
        console.log('add_new', transaction);
        await this.transactionRepo.insertTransaction(transaction);
        const message = `Your transactions
        currency: ${transaction.currency},
        amount: ${transaction.amount},
        category: ${transaction.category},
        date: ${transaction.date},
        description: ${transaction.description},
        merchant: ${transaction.merchant},
        type: ${transaction.type}
        has been added successfully.
        `
        console.log('inserted transaction');
        return message;
    
    }
    

    async total_list_by_category_type({from, to, type} : {from: string, to: string, type: string}) {

        console.log('total_list_by_category_type', {from, to, type})

        const result = await this.transactionRepo.total_list_by_category_type({from, to, type});
        
        var message = `Summary from ${from} to ${to} for ${type}\n`;
        for (const item of result) {
            message += `${item.category} : $${item.sum}\n`;
        }
        
        return message;
    }

    async total_amount(param : TotalAmountCategoryParam) {
        console.log('total_amount', param);
        const total = await this.transactionRepo.totalAmountInCategory(param);
        const message = `Total value of ${param.type} from ${param.from} to ${param.to} is $${total}`;
        return message;
    }

    async category_list() {
        console.log('category_list call');
        const categories = await this.transactionRepo.categoryList();
        const message = "Categories are \n -" + categories.join('\n-');
        console.log('category_list', message);
        return message;
    }

    async show_transaction_list({from,to} : {from: string, to: string}) {
        console.log('show_transaction_list')
        const transactions = await this.transactionRepo.transaction_list({from, to});
        var message = `Transactions from ${from} to ${to}\n`;
        for (const transaction of transactions) {
            message += `Amount: $${transaction.amount}, Category: ${transaction.category}, Date: ${transaction.date}, Description: ${transaction.description}, Merchant: ${transaction.merchant}, Type: ${transaction.type}\n`;
        }
        return message;

    }
    



}