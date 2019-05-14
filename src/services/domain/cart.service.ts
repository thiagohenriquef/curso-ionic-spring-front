import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";


@Injectable()
export class CartService {
    constructor(public storage: StorageService) {

    }

    createOrClearCart() : Cart {
        const cart : Cart = {
            itens: []
        }
        this.storage.setCart(cart);
        return cart;
    }

    getCart() : Cart {
        const cart : Cart = this.storage.getCart();
        if (cart == null) {
            this.createOrClearCart();
        }
        return cart;
    }

    addProduto(produto: ProdutoDTO) : Cart {
        const cart = this.getCart();
        const position = cart.itens.findIndex(el => el.produto.id == produto.id);
        if (position == -1) {
            cart.itens.push({ quantidade: 1, produto: produto});
        }
        this.storage.setCart(cart);
        return cart;
    }
}