import { transactionTable } from '../db/schema/transactions';
import db from '../db/database';
import { eq, gte, lte, SQL, sql, and } from 'drizzle-orm';
import { Transaction } from '../models/transaction';
import { TotalAmountCategoryParam } from '../models/total-amount-category-param';

export class TransactionRepo {


    async insertTransaction(transaction: Transaction) {
        console.log("insert transaction", transaction);
        await db.insert(transactionTable).values({
            amount: transaction.amount,
            category: transaction.category.toLocaleLowerCase(),
            currency: transaction.currency,
            date: new Date(transaction.date),
            description: transaction.description,
            merchant: transaction.merchant,
            type: transaction.type.toLocaleLowerCase()
        }).execute();
    }

    async categoryList(): Promise<string[]> {
        const result = await db.selectDistinct({ category: transactionTable.category }).from(transactionTable).orderBy(transactionTable.category);
        return result.map((item: any) => item.category);
    }

    async transaction_list(param: { from: string, to: string}) : Promise<Transaction[]> {

        const result = await db.select().from(transactionTable).where(
            and(
                gte(transactionTable.date, new Date(param.from)),
                lte(transactionTable.date, new Date(param.to))
            )
        );
        
        return result.map(row => ({
            id: row.id ?? null,
            amount: Number(row.amount) || 0,
            category: row.category || '',
            currency: row.currency || '',
            date: row.date != null ? this.formatDate(row.date) : "",
            description: row.description || '',
            merchant: row.merchant || '',
            type: row.type || ''
        }));
        
    } 

    formatDate(date: Date): string {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    }

    async total_list_by_category_type(param: { from: string, to: string, type: string }): Promise<{
        category: string | null;
        sum: number;
    }[]> {
        const result = await db.select({
            category: transactionTable.category,
            sum: sql<number>`cast(sum(amount) as decimal(10,2))`
        }).from(transactionTable)
            .where(
                and(
                    eq(transactionTable.type, param.type.toLocaleLowerCase()),
                    gte(transactionTable.date, new Date(param.from)),
                    lte(transactionTable.date, new Date(param.to))
                )
            )
            .groupBy(transactionTable.category)
            .orderBy(transactionTable.category);


        return result
    }

    async totalAmountInCategory(param: TotalAmountCategoryParam): Promise<number> {

        if (param.category !== '' && param.category !== null) {
            const categoryName: string = param.category;
            const result = await db.select({
                sum: sql<number>`cast(sum(amount) as decimal(10,2))`
            }).from(transactionTable)
                .where(
                    and(
                        eq(transactionTable.category, categoryName.toLocaleLowerCase()),
                        eq(transactionTable.type, param.type.toLocaleLowerCase()),
                        gte(transactionTable.date, new Date(param.from)),
                        lte(transactionTable.date, new Date(param.to))
                    )
                )
            return result[0].sum;
        }
        else {
            const result = await db.select({
                sum: sql<number>`cast(sum(amount) as decimal(10,2))`
            }).from(transactionTable)
                .where(
                    and(
                        eq(transactionTable.type, param.type.toLocaleLowerCase()),
                        gte(transactionTable.date, new Date(param.from)),
                        lte(transactionTable.date, new Date(param.to))
                    )
                )
            return result[0].sum;
        }

    }
}

