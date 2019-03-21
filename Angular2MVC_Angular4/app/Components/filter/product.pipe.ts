import { PipeTransform, Pipe } from '@angular/core';
import { IProduct } from '../../Model/Product/product';

@Pipe({
    name: 'productFilter'
})

export class ProductFilterPipe implements PipeTransform {

    transform(value: IProduct[], filter: string): IProduct[] {
        filter = filter ? filter.toLocaleLowerCase() : null;
        return filter ? value.filter((app: IProduct) =>
            app.Description != null && app.Description.toLocaleLowerCase().indexOf(filter) != -1
            || app.MaterialCode != null && app.MaterialCode.toLocaleLowerCase().indexOf(filter) != -1
            
            

        ) : value;

    }
}