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
        if (cart && cart.itens) {
            const position = cart.itens.findIndex(el => el.produto.id == produto.id);
        } else {
            const position = -1;
        }
        if (position == -1) {
            cart.itens.push({ quantidade: 1, produto: produto});
        }
        this.storage.setCart(cart);
        return cart;
    }

    removeProduto(produto: ProdutoDTO) : Cart {
        const cart = this.getCart();
        if (cart && cart.itens) {
            const position = cart.itens.findIndex(el => el.produto.id == produto.id);
        } else {
            const position = -1;
        }
        if (position != -1) {
            cart.itens.splice(position);
        }
        this.storage.setCart(cart);
        return cart;
    }

    increaseQuantity(produto: ProdutoDTO) : Cart {
        const cart = this.getCart();
        if (cart && cart.itens) {
            const position = cart.itens.findIndex(el => el.produto.id == produto.id);
        } else {
            const position = -1;
        }
        if (position != -1) {
            cart.itens[position].quantidade++;
        }
        this.storage.setCart(cart);
        return cart;
    }

    decreaseQuantity(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        if (cart && cart.itens) {
            const position = cart.itens.findIndex(el => el.produto.id == produto.id);
        } else {
            const position = -1;
        }
        if (position != -1) {
            cart.itens[position].quantidade--;
            if (cart.itens[position].quantidade < 1) {
                cart = this.removeProduto(produto);
            }
        }
        this.storage.setCart(cart);
        return cart;
    }

    total() : number {
        const cart = this.getCart();
        return cart && cart.itens
            ? cart.itens.reduce((acc, curr) => acc + (curr.produto.preco * curr.quantidade), 0)
            : 0
    }
}